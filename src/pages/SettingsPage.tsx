import PageHeader from '../components/PageHeader'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Info" subtitle="AllergyScan Web" />

      <div className="flex flex-col gap-3">
        <img
          src="./logo.png"
          alt="Logo AllergyScan"
          className="mx-auto h-24 w-24"
        />
        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">Che cos'è</h2>
          <p className="text-sm text-ink-dim">
            Versione web di AllergyScan: scansiona o cerca un prodotto alimentare
            e scopri subito se contiene i tuoi allergeni, in base al profilo attivo.
          </p>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">Dati</h2>
          <p className="text-sm text-ink-dim">
            I dati dei prodotti provengono da{' '}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Open Food Facts
            </a>
            , il database alimentare libero e collaborativo. Profili e storico
            restano solo su questo dispositivo (localStorage): nessun account,
            nessun server.
          </p>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">Installa l'app</h2>
          <p className="text-sm text-ink-dim">
            AllergyScan si può aggiungere alla schermata Home come una vera app:
            su iPhone tocca <span className="text-ink">Condividi → Aggiungi alla
            schermata Home</span>; su Android usa il banner di installazione o il
            menu del browser (<span className="text-ink">Installa app</span>).
          </p>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">Attenzione</h2>
          <p className="text-sm text-ink-dim">
            Le informazioni potrebbero essere incomplete o non aggiornate:
            in caso di allergie gravi, verifica sempre l'etichetta del prodotto.
          </p>
        </section>

        <p className="mt-2 text-center text-xs text-ink-dim/60">
          AllergyScan Web · v0.2.1
        </p>
      </div>
    </div>
  )
}
