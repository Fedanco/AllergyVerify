import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { CheckMarkIcon, PlusIcon, TrashIcon } from '../components/Icons'
import { ALLERGEN_CATALOG } from '../data/allergenCatalog'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useLang } from '../i18n/useLang'
import type { AllergyProfile } from '../types/product'

export default function ProfilePage() {
  const {
    profiles,
    activeProfiles,
    multi,
    createProfile,
    updateProfile,
    deleteProfile,
    setActive,
    toggleActive,
    setMulti,
  } = useAllergyProfile()
  const { lang, t } = useLang()
  const [editing, setEditing] = useState<AllergyProfile | 'new' | null>(
    profiles.length === 0 ? 'new' : null,
  )
  const activeIds = new Set(activeProfiles.map((p) => p.id))

  return (
    <div>
      <PageHeader
        title={t.profile.title}
        subtitle={multi ? t.profile.subtitleMulti : t.profile.subtitle}
      />

      {/* Interruttore esplicito: con un profilo solo l'app si comporta come
          prima, e nessuno si ritrova verdetti di altre persone senza averlo
          chiesto. Compare solo quando i profili sono almeno due, perché con
          uno solo non avrebbe nulla da fare. */}
      {profiles.length > 1 && (
        <div className="card mb-3 flex items-start gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{t.profile.multiTitle}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-dim">
              {t.profile.multiHint}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={multi}
            aria-label={t.profile.multiTitle}
            onClick={() => setMulti(!multi)}
            className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition-colors duration-[var(--duration-fast)] ${
              multi ? 'bg-accent' : 'inset-surface'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full transition-[left,background-color] duration-[var(--duration-fast)] ${
                multi ? 'left-6 bg-bg' : 'left-1 bg-ink-dim'
              }`}
            />
          </button>
        </div>
      )}

      {profiles.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {profiles.map((p) => {
            const isActive = activeIds.has(p.id)
            return (
              <li
                key={p.id}
                /* Il profilo attivo si distingue per superficie, non solo per
                   un bordo colorato: e' lo stato che decide tutti i verdetti
                   dell'app, deve vedersi senza cercarlo. */
                className={`card flex items-center gap-3 p-4 transition-colors duration-[var(--duration-fast)] ${
                  isActive ? 'border-accent/50 bg-surface-2' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => (multi ? toggleActive(p.id) : setActive(p.id))}
                  aria-pressed={isActive}
                  className="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
                >
                  {/* Cerchio quando la scelta è esclusiva, quadrato quando se
                      ne possono selezionare più d'uno: è la convenzione che
                      distingue "scegli uno" da "scegli quanti vuoi". */}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-[background-color,border-color] duration-[var(--duration-fast)] ${
                      multi ? 'rounded-md' : 'rounded-full'
                    } ${isActive ? 'border-accent bg-accent text-bg' : 'border-edge'}`}
                  >
                    {isActive && <CheckMarkIcon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-ink-dim">
                      {p.allergens.length === 0
                        ? t.profile.noAllergens
                        : ALLERGEN_CATALOG.filter((a) => p.allergens.includes(a.tag))
                            .map((a) => a.label[lang])
                            .join(', ')}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(p)}
                  className="focus-ring rounded-lg border border-edge px-2.5 py-1.5 text-xs text-ink-dim transition-colors hover:text-ink"
                >
                  {t.profile.edit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t.profile.confirmDelete(p.name))) deleteProfile(p.id)
                  }}
                  className="focus-ring rounded-lg border border-edge p-1.5 text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
                  aria-label={t.profile.deleteAria(p.name)}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {editing ? (
        <ProfileEditor
          key={editing === 'new' ? 'new' : editing.id}
          profile={editing === 'new' ? null : editing}
          onSave={(name, allergens) => {
            if (editing === 'new') createProfile(name, allergens)
            else updateProfile(editing.id, name, allergens)
            setEditing(null)
          }}
          onCancel={profiles.length > 0 ? () => setEditing(null) : undefined}
        />
      ) : (
        /* Un oggetto premibile a tutti gli effetti: superficie, disco grano e
           testo pieno. L'incavo vuoto provato prima era troppo timido — di
           fatto si vedeva solo la scritta, e aggiungere un profilo e' l'azione
           principale di questa schermata. */
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="card focus-ring flex w-full items-center gap-3 p-3.5 text-left transition-[background-color,box-shadow,transform] duration-[var(--duration-fast)] hover:bg-surface-2 hover:shadow-md active:scale-[0.99]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg">
            <PlusIcon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">{t.profile.newProfile}</span>
        </button>
      )}
    </div>
  )
}

function ProfileEditor({
  profile,
  onSave,
  onCancel,
}: {
  profile: AllergyProfile | null
  onSave: (name: string, allergens: string[]) => void
  onCancel?: () => void
}) {
  const { lang, t } = useLang()
  const [name, setName] = useState(profile?.name ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set(profile?.allergens ?? []))

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // Il nome non è obbligatorio: chi ha un solo profilo non ha motivo di
        // inventargli un'etichetta. Se manca ne mettiamo uno sensato, invece
        // di bloccare il salvataggio con un bottone spento che non spiega sé
        // stesso (era la causa del "il tasto salva non funziona").
        onSave(name.trim() || t.profile.defaultName, [...selected])
      }}
      className="card animate-fade-up p-4"
    >
      <h2 className="mb-3 text-sm font-semibold">
        {profile ? t.profile.editorTitleEdit(profile.name) : t.profile.editorTitleNew}
      </h2>

      <label htmlFor="profile-name" className="mb-1.5 block text-xs text-ink-dim">
        {t.profile.nameLabel}
      </label>
      <input
        id="profile-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.profile.namePlaceholder}
        className="inset-surface mb-4 w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-dim/60 focus:border-accent"
      />

      <p id="allergens-label" className="mb-2 text-xs text-ink-dim">
        {t.profile.allergensLabel}
      </p>
      <div role="group" aria-labelledby="allergens-label" className="mb-4 flex flex-wrap gap-2">
        {ALLERGEN_CATALOG.map(({ tag, label, emoji }) => {
          const on = selected.has(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              /* Selezionato = premuto: la pillola passa da superficie in
                 rilievo a incavo. È un feedback fisico che si capisce prima
                 di leggere, e sostituisce il vecchio ingrandimento del 3%. */
              className={`focus-ring rounded-full px-3 py-1.5 text-xs transition-[background-color,box-shadow,color] duration-[var(--duration-fast)] ${
                on
                  ? 'inset-surface font-semibold text-accent'
                  : 'chip font-medium text-ink-dim hover:text-ink'
              }`}
              aria-pressed={on}
            >
              {emoji} {label[lang]}
            </button>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="focus-ring flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg transition-colors duration-[var(--duration-fast)]"
        >
          {t.profile.save}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring rounded-xl border border-edge px-4 text-sm text-ink-dim transition-colors hover:text-ink"
          >
            {t.profile.cancel}
          </button>
        )}
      </div>
    </form>
  )
}
