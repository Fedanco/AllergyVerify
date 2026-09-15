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
        <LogoTile className="animate-icon-pop h-16" />
        <h2 id="install-native-title" className="mt-3 text-base font-bold text-ink">
          {t.installBanner.title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{t.installBanner.body}</p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="btn-primary focus-ring mt-5 w-full"
      >
        {t.installBanner.continueCta}
      </button>
    </Modal>
  )
}
