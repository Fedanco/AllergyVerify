import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useLang } from '../i18n/useLang'
import { CloseIcon, DownloadIcon } from './Icons'
import InstallGuideModal from './InstallGuideModal'
import InstallNativeModal from './InstallNativeModal'

export default function InstallBanner() {
  const { standalone, isIOS, canInstallNative, dismissed, dismiss, promptInstall } =
    useInstallPrompt()
  const { t } = useLang()
  const [guideOpen, setGuideOpen] = useState(false)
  const [nativeIntroOpen, setNativeIntroOpen] = useState(false)

  if (standalone || dismissed || !(isIOS || canInstallNative)) return null

  return (
    <>
      <div className="animate-banner-in mb-4 flex items-start gap-3 rounded-banner border border-accent/30 bg-accent/10 px-5 py-4 shadow-md">
        <span className="animate-icon-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <DownloadIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-ink">{t.installBanner.title}</p>
          <p className="mt-0.5 text-sm text-ink-dim">{t.installBanner.body}</p>
          <button
            type="button"
            onClick={canInstallNative ? () => setNativeIntroOpen(true) : () => setGuideOpen(true)}
            className="focus-ring mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform duration-[var(--duration-fast)] active:scale-[0.97]"
          >
            {canInstallNative ? t.installBanner.cta : t.installBanner.ctaGuide}
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.installBanner.dismissAria}
          className="focus-ring -m-1 shrink-0 rounded-full p-1 text-ink-dim transition-colors hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <InstallGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <InstallNativeModal
        open={nativeIntroOpen}
        onClose={() => setNativeIntroOpen(false)}
        onContinue={() => {
          setNativeIntroOpen(false)
          promptInstall()
        }}
      />
    </>
  )
}
