import { useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useLang } from "../i18n/useLang";
import Torn from "../paper/Torn";
import { CloseIcon, DownloadIcon } from "./Icons";
import InstallGuideModal from "./InstallGuideModal";
import InstallNativeModal from "./InstallNativeModal";

export default function InstallBanner() {
  const {
    standalone,
    isIOS,
    canInstallNative,
    dismissed,
    dismiss,
    promptInstall,
  } = useInstallPrompt();
  const { t } = useLang();
  const [guideOpen, setGuideOpen] = useState(false);
  const [nativeIntroOpen, setNativeIntroOpen] = useState(false);

  if (standalone || dismissed || !(isIOS || canInstallNative)) return null;

  return (
    <>
      {/* Biglietto su carta gialla, come "Installa" sulla landing. L'animazione
          d'ingresso sta sul wrapper: il cartellino strappato ha un filtro. */}
      <div className="animate-banner-in mb-4">
        <Torn
          seed={23}
          amp={5}
          bg="var(--color-wheat-tint)"
          className="flex rotate-[0.3deg] items-start gap-3 px-5 py-4"
        >
          <span className="animate-icon-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wheat text-ink">
            <DownloadIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-ink">
              {t.installBanner.title}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {t.installBanner.body}
            </p>
            <button
              type="button"
              onClick={
                canInstallNative
                  ? () => setNativeIntroOpen(true)
                  : () => setGuideOpen(true)
              }
              className="btn-primary focus-ring mt-3"
            >
              {canInstallNative
                ? t.installBanner.cta
                : t.installBanner.ctaGuide}
            </button>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.installBanner.dismissAria}
            className="focus-ring -m-1 shrink-0 rounded-full p-1 text-ink-soft transition-colors hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </Torn>
      </div>
      <InstallGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <InstallNativeModal
        open={nativeIntroOpen}
        onClose={() => setNativeIntroOpen(false)}
        onContinue={() => {
          setNativeIntroOpen(false);
          promptInstall();
        }}
      />
    </>
  );
}
