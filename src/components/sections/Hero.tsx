import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  LinkedInIcon,
  GitHubIcon,
  DownloadIcon,
} from "@/components/icons";
import { profile } from "@/content/profile";
import profilePhoto from "@/assets/images/profile.jpg";
import styles from "./Hero.module.css";

interface PanelLine {
  label: string;
  value: string;
}

export function Hero() {
  const { t, i18n } = useTranslation();
  const themes = t("hero.themes", { returnObjects: true }) as unknown as string[];

  const panelLines: PanelLine[] = [
    t("hero.panel.location", { returnObjects: true }) as unknown as PanelLine,
    t("hero.panel.role", { returnObjects: true }) as unknown as PanelLine,
    t("hero.panel.focus", { returnObjects: true }) as unknown as PanelLine,
    t("hero.panel.experience", { returnObjects: true }) as unknown as PanelLine,
  ];

  // Prefer the CV in the active language, falling back to English.
  // Both are currently unset — the button renders disabled until a
  // real file is supplied (see src/content/profile.ts).
  const activeLanguage = i18n.language.split("-")[0] as "en" | "pt";
  const cvHref = profile.cv[activeLanguage] ?? profile.cv.en;
  const isCvAvailable = Boolean(cvHref);

  return (
    <section id="home" className={styles.hero} aria-label={t("hero.name")}>
      <Container className={styles.grid}>
        <div className={styles.content}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            {t("hero.kicker")}
          </p>

          <h1 className={styles.name}>{t("hero.name")}</h1>
          <p className={styles.role}>{t("hero.role")}</p>
          <p className={styles.summary}>{t("hero.summary")}</p>

          <div className={styles.themes} role="list" aria-label={t("hero.themesLabel")}>
            <span className={styles.themesLabel}>{t("hero.themesLabel")}</span>
            {themes.map((theme) => (
              <span key={theme} className={styles.chip} role="listitem">
                {theme}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            <Button href="#contact" variant="primary">
              {t("hero.ctaContact")}
            </Button>

            <Button
              href={cvHref ?? "#"}
              variant="secondary"
              disabled={!isCvAvailable}
              icon={<DownloadIcon />}
              download={isCvAvailable || undefined}
            >
              {isCvAvailable ? t("hero.ctaDownloadCV") : t("hero.ctaDownloadCVUnavailable")}
            </Button>

            <div className={styles.socialRow}>
              <a
                className={styles.socialLink}
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t("hero.linkedinLabel")}
              >
                <LinkedInIcon />
              </a>
              <a
                className={styles.socialLink}
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t("hero.githubLabel")}
              >
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.photoCard}>
            <img
              className={styles.photoImage}
              src={profilePhoto}
              alt={t("hero.photoAlt")}
              width={320}
              height={320}
            />
          </div>

          <aside className={styles.panel} aria-hidden="true">
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} />
              <span className={styles.panelDot} />
              <span className={styles.panelDot} />
              <span className={styles.panelTitle}>{t("hero.panel.title")}</span>
            </div>
            <div className={styles.panelBody}>
              {panelLines.map((line) => (
                <p key={line.label} className={styles.panelLine}>
                  <span className={styles.panelPrompt}>{line.label}</span>
                  <span className={styles.panelValue}>{line.value}</span>
                </p>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
