import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "./Container";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Button } from "@/components/ui/Button";
import styles from "./Header.module.css";

// Structural nav map — labels come from translations, ids point at
// section anchors. Sections beyond Hero ship in later phases; the
// links are harmless no-ops until those ids exist in the DOM.
const NAV_ITEMS = [
  { key: "home", id: "home" },
  { key: "about", id: "about" },
  { key: "experience", id: "experience" },
  { key: "expertise", id: "expertise" },
  { key: "projects", id: "projects" },
  { key: "certifications", id: "certifications" },
  { key: "journey", id: "journey" },
  { key: "contact", id: "contact" },
] as const;

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <a href="#home" className={styles.logo} aria-label="William Nascimento">
          <span className={styles.logoMark} aria-hidden="true">
            WN
          </span>
          <span className={styles.logoText}>
            William Nascimento <span className={styles.dim}>— Tech Lead</span>
          </span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={styles.navLink}>
                  {t(`nav.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch />
          <Button href="#contact" variant="secondary">
            {t("nav.contact")}
          </Button>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={t(isMenuOpen ? "nav.menuClose" : "nav.menuOpen")}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MenuIcon isOpen={isMenuOpen} />
        </button>
      </Container>

      {isMenuOpen && (
        <div id="mobile-nav-panel" className={styles.mobilePanel}>
          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  {t(`nav.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <LanguageSwitch />
            <Button href="#contact" variant="primary" onClick={closeMenu}>
              {t("nav.contact")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  if (isOpen) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M2 2L16 16M16 2L2 16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 4.5H16M2 9H16M2 13.5H16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
