import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./About.module.css";

interface Stat {
  label: string;
  value: string;
}

export function About() {
  const { t } = useTranslation();
  const paragraphs = t("about.paragraphs", { returnObjects: true }) as unknown as string[];
  const stats = t("about.stats", { returnObjects: true }) as unknown as Stat[];

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <Container>
        <SectionHeading id="about-heading" eyebrow={t("about.eyebrow")} title={t("about.title")} />
        <div className={styles.layout}>
          <div className={styles.copy}>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
