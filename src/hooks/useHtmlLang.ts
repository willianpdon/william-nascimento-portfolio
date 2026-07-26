import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Keeps the <html lang="..."> attribute in sync with the active
 * i18next language, which matters for accessibility (screen readers)
 * and SEO.
 */
export function useHtmlLang(): void {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
}
