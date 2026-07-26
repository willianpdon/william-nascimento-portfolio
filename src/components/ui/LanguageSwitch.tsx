import { useTranslation } from "react-i18next";
import { supportedLanguages, type SupportedLanguage } from "@/i18n";
import styles from "./LanguageSwitch.module.css";

const LABELS: Record<SupportedLanguage, string> = {
  en: "EN",
  pt: "PT",
};

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.language.split("-")[0] as SupportedLanguage;

  return (
    <div
      className={styles.switch}
      role="group"
      aria-label={t("common.languageSwitchLabel")}
    >
      {supportedLanguages.map((lng) => {
        const isActive = activeLanguage === lng;
        return (
          <button
            key={lng}
            type="button"
            className={isActive ? `${styles.option} ${styles.optionActive}` : styles.option}
            aria-pressed={isActive}
            onClick={() => void i18n.changeLanguage(lng)}
          >
            {LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
}
