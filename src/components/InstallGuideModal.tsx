import { useLang } from '../i18n/useLang'
import { ChevronDownIcon, HomeAddIcon, ShareIcon } from './Icons'
import Modal from './Modal'

interface Props {
  open: boolean
  onClose: () => void
}

export default function InstallGuideModal({ open, onClose }: Props) {
  const { t } = useLang()

  return (
    <Modal open={open} onClose={onClose} titleId="install-guide-title">
      <h2 id="install-guide-title" className="text-base font-bold text-ink">
        {t.installGuide.title}
      </h2>
      <div className="mt-4 flex flex-col items-center gap-1">
        <Step index={0} Icon={ShareIcon} label={t.installGuide.step1} />
        <span
          style={{ '--i': 1 } as React.CSSProperties}
          aria-hidden
          className="animate-step-in text-ink-soft [animation-delay:calc(var(--i)*180ms)]"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </span>
        <Step index={2} Icon={HomeAddIcon} label={t.installGuide.step2} highlight />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="btn-primary focus-ring mt-5 w-full"
      >
        {t.installGuide.gotIt}
      </button>
    </Modal>
  )
}

function Step({
  index,
  Icon,
  label,
  highlight,
}: {
  index: number
  Icon: (p: { className?: string }) => React.ReactNode
  label: string
  highlight?: boolean
}) {
  return (
    <div
      style={{ '--i': index } as React.CSSProperties}
      className="chip animate-step-in flex w-full items-center gap-3 px-4 py-3 [animation-delay:calc(var(--i)*180ms)]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          highlight ? 'bg-blue text-white' : 'bg-paper-2 text-ink-soft'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm text-ink">{label}</p>
    </div>
  )
}
