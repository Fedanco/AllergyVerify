# Genera tutte le icone dell'app da un'unica sorgente: assets/logo-source.png,
# il file sorgente del logo (tile squircle bianco su sfondo trasparente).
#
# Uso:  powershell -ExecutionPolicy Bypass -File scripts/build-icons.ps1
#
# Regola non negoziabile: la scala e' sempre UNIFORME (stesso fattore su x e
# y). La sorgente non e' quadrata (1008x1056), quindi forzarla in un quadrato
# allargherebbe il disegno del 3,4% - esattamente il difetto da cui nasce
# questo script.
#
# Le icone di sistema sono salvate OPACHE: iOS rende la trasparenza come nero
# e in Home comparirebbe un riquadro nero. Solo logo-v2.png, che vive sulle
# superfici scure dentro l'app, conserva il canale alpha.

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$srcPath = Join-Path $root 'assets\logo-source.png'
$outDir = Join-Path $root 'public'

if (-not (Test-Path $srcPath)) { throw "Sorgente mancante: $srcPath" }

$src = New-Object System.Drawing.Bitmap($srcPath)
$W = $src.Width
$H = $src.Height

# --- lettura dei pixel in un colpo solo -------------------------------------
# GetPixel su un milione di pixel in PowerShell e' proibitivo: si copia la
# bitmap in un array di byte (BGRA) e si legge quello.
$rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
$data = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $data.Stride
$buf = New-Object byte[] ($stride * $H)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $buf.Length)
$src.UnlockBits($data)

# --- i due riquadri che servono ---------------------------------------------
# tile: lo squircle opaco, cioe' tutto cio' che non e' trasparente
# art:  il solo disegno. Soglia doppia perche' il manico della lente e'
#       argento, quindi grigio: cercare solo i pixel saturi lo taglierebbe.
$tMinX = $W; $tMinY = $H; $tMaxX = -1; $tMaxY = -1
$aMinX = $W; $aMinY = $H; $aMaxX = -1; $aMaxY = -1

for ($y = 0; $y -lt $H; $y++) {
  $row = $y * $stride
  for ($x = 0; $x -lt $W; $x++) {
    $i = $row + ($x * 4)
    if ($buf[$i + 3] -lt 24) { continue }

    if ($x -lt $tMinX) { $tMinX = $x }
    if ($x -gt $tMaxX) { $tMaxX = $x }
    if ($y -lt $tMinY) { $tMinY = $y }
    if ($y -gt $tMaxY) { $tMaxY = $y }

    if ($buf[$i + 3] -lt 200) { continue }
    $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]
    $max = [Math]::Max($r, [Math]::Max($g, $b))
    $min = [Math]::Min($r, [Math]::Min($g, $b))
    if ((($max - $min) -gt 25) -or ($max -lt 210)) {
      if ($x -lt $aMinX) { $aMinX = $x }
      if ($x -gt $aMaxX) { $aMaxX = $x }
      if ($y -lt $aMinY) { $aMinY = $y }
      if ($y -gt $aMaxY) { $aMaxY = $y }
    }
  }
}

$tileX = $tMinX; $tileY = $tMinY
$tileW = $tMaxX - $tMinX + 1; $tileH = $tMaxY - $tMinY + 1
$artX = $aMinX; $artY = $aMinY
$artW = $aMaxX - $aMinX + 1; $artH = $aMaxY - $aMinY + 1

Write-Host "sorgente : ${W}x${H}"
Write-Host "tile     : ${tileW}x${tileH} @ ($tileX,$tileY)"
Write-Host "disegno  : ${artW}x${artH} @ ($artX,$artY)"
Write-Host ''

# --- utilita' di disegno -----------------------------------------------------
function New-Graphics($bmp) {
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  return $g
}

# TileFlipXY evita l'alone semitrasparente che GDI+ lascia sul bordo quando
# ridimensiona: senza, ogni icona avrebbe una cornice chiara di un pixel.
function New-Attrs() {
  $a = New-Object System.Drawing.Imaging.ImageAttributes
  $a.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
  return $a
}

function Save-Png($bmp, [string]$name) {
  $path = Join-Path $outDir $name
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $kb = [Math]::Round((Get-Item $path).Length / 1KB)
  Write-Host ("  {0,-28} {1}x{2}  {3} kB" -f $name, $bmp.Width, $bmp.Height, $kb)
}

# --- 1. logo dell'interfaccia: alpha conservato ------------------------------
# Tutta la sorgente rimpicciolita, angoli trasparenti inclusi: dentro l'app il
# logo si comporta come un'icona sulla Home di iOS, poggiata sul fondo scuro
# senza nessuna cornice intorno. A schermo non supera i 64px.
#
# I nomi delle variabili locali NON possono essere $w/$h: PowerShell non
# distingue maiuscole e minuscole, quindi ombreggerebbero $W/$H (le dimensioni
# della sorgente) e il ritaglio finirebbe sull'angolo in alto a sinistra.
function Build-AppLogo([int]$maxSide, [string]$name) {
  $scale = [double]$maxSide / [double][Math]::Max($W, $H)
  $outW = [int][Math]::Round($W * $scale)
  $outH = [int][Math]::Round($H * $scale)
  $bmp = New-Object System.Drawing.Bitmap $outW, $outH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = New-Graphics $bmp
  $g.Clear([System.Drawing.Color]::Transparent)
  $dest = New-Object System.Drawing.Rectangle 0, 0, $outW, $outH
  $g.DrawImage($src, $dest, 0, 0, $W, $H, [System.Drawing.GraphicsUnit]::Pixel, (New-Attrs))
  $g.Dispose()
  Save-Png $bmp $name
  $bmp.Dispose()
}

# --- 2. icone di sistema: il tile intero, senza ritagli ---------------------
# Scala uniforme sul lato lungo del tile, centrato su bianco. L'inquadratura
# resta identica a quella del sorgente: nessun ingrandimento, nessun
# ritaglio.
#
# Gli angoli restano bianchi come il tile, quindi non si vedono: iOS e Android
# ci mettono sopra la loro maschera, e bianco su bianco non lascia contorni.
function Build-SystemIcon([int]$size, [string]$name) {
  $scale = [double]$size / [double][Math]::Max($tileW, $tileH)
  $dw = [int][Math]::Round($tileW * $scale)
  $dh = [int][Math]::Round($tileH * $scale)
  $dx = [int][Math]::Round(($size - $dw) / 2.0)
  $dy = [int][Math]::Round(($size - $dh) / 2.0)
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = New-Graphics $bmp
  $g.Clear([System.Drawing.Color]::White)
  $dest = New-Object System.Drawing.Rectangle $dx, $dy, $dw, $dh
  $g.DrawImage($src, $dest, $tileX, $tileY, $tileW, $tileH, [System.Drawing.GraphicsUnit]::Pixel, (New-Attrs))
  $g.Dispose()
  Save-Png $bmp $name
  $bmp.Dispose()
}

# --- 3. maskable Android: solo il disegno, dentro la zona sicura -------------
# Android ritaglia l'icona con una maschera propria (cerchio, goccia, squircle
# a seconda del telefono): il disegno deve stare nel 62% centrale, il resto e'
# sfondo sacrificabile.
#
# Qui lo squircle sorgente NON va incluso: la maschera di Android lo
# ritaglierebbe dentro un cerchio, che e' esattamente l'accostamento sbagliato
# (una forma dentro un'altra). Si prende quindi il solo soggetto piu' un bordo
# stretto di tile - abbastanza da non toccarne mai il rim, cosi' il passaggio
# al bianco del canvas avviene su pixel gia' quasi bianchi.
function Build-Maskable([int]$size, [double]$safe, [string]$name) {
  $box = $size * $safe
  $scale = [Math]::Min($box / [double]$artW, $box / [double]$artH)
  $pad = 48
  $sx = [Math]::Max($tileX, $artX - $pad)
  $sy = [Math]::Max($tileY, $artY - $pad)
  $sw = [Math]::Min($tileX + $tileW, $artX + $artW + $pad) - $sx
  $sh = [Math]::Min($tileY + $tileH, $artY + $artH + $pad) - $sy
  $dw = [int][Math]::Round($sw * $scale)
  $dh = [int][Math]::Round($sh * $scale)
  $dx = [int][Math]::Round(($size - $dw) / 2.0)
  $dy = [int][Math]::Round(($size - $dh) / 2.0)
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = New-Graphics $bmp
  $g.Clear([System.Drawing.Color]::White)
  $dest = New-Object System.Drawing.Rectangle $dx, $dy, $dw, $dh
  $g.DrawImage($src, $dest, $sx, $sy, $sw, $sh, [System.Drawing.GraphicsUnit]::Pixel, (New-Attrs))
  $g.Dispose()
  Save-Png $bmp $name
  $bmp.Dispose()
}

Write-Host 'generati:'
Build-AppLogo 260 'logo-v2.png'
Build-SystemIcon 180 'favicon-v5.png'
Build-SystemIcon 180 'apple-touch-icon-v5.png'
# Copia senza suffisso di versione: alcuni flussi "aggiungi a Home" (iOS/Safari
# e altri) cercano /apple-touch-icon.png alla radice per convenzione, ignorando
# il <link rel="apple-touch-icon"> in <head>. È un fallback voluto, non un
# residuo da ripulire.
Build-SystemIcon 180 'apple-touch-icon.png'
Build-SystemIcon 192 'pwa-192-v2.png'
Build-SystemIcon 512 'pwa-512-v2.png'
Build-Maskable 512 0.62 'pwa-maskable-512-v2.png'

$src.Dispose()
Write-Host ''
Write-Host 'fatto.'
