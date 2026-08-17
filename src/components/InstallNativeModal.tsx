import { useLang } from '../i18n/useLang'
import LogoTile from './LogoTile'
import Modal from './Modal'

interface Props {
  open: boolean
  onClose: () => void
  onContinue: () => void
}

export default function InstallNativeModal({ open, onClose, onContinue }: Props) {
  const { t } = useLang()

  return (
    <Modal open={open} onClose={onClose} titleId="install-native-title">
      <div className="flex flex-col items-center text-center">
        <LogoTile className="animate-icon-pop h-16 w-16" />
        <h2 id="install-native-title" className="mt-3 text-base font-bold text-ink">
          {t.installBanner.title}
        </h2>
        <p className="mt-1 text-sm text-ink-dim">{t.installBanner.body}</p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="focus-ring mt-5 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-transform duration-[var(--duration-fast)] active:scale-[0.97]"
      >
        {t.installBanner.continueCta}
      </button>
    </Modal>
  )
}
