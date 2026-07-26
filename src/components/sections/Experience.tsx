import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Experience.module.css";

interface Initiative {
  title: string;
  description: string;
  highlights: string[];
}

interface ExperienceItem {
  company: string;
  location: string;
  period: string;
  roles: string[];
  summary: string;
  responsibilities: string[];
  technologies: string[];
  initiatives?: Initiative[];
  recognition?: string;
}

export function Experience() {
  const { t } = useTranslation();
  const items = t("experience.items", { returnObjects: true }) as unknown as ExperienceItem[];

  return (
    <section id="experience" className={styles.experience} aria-labelledby="experience-heading">
      <Container>
        <SectionHeading
          id="experience-heading"
          eyebrow={t("experience.eyebrow")}
          title={t("experience.title")}
          intro={t("experience.intro")}
        />

        <ol className={styles.timeline}>
          {items.map((item) => (
            <li key={item.company} className={styles.item}>
              <span className={styles.itemMarker} aria-hidden="true" />

              <div className={styles.itemHeader}>
                <h3 className={styles.company}>
                  {item.company} <span className={styles.location}>· {item.location}</span>
                </h3>
                <span className={styles.period}>{item.period}</span>
              </div>

              <div className={styles.roles}>
                {item.roles.map((role) => (
                  <span key={role} className={styles.role}>
                    {role}
                  </span>
                ))}
              </div>

              <p className={styles.summary}>{item.summary}</p>

              <p className={styles.subheading}>{t("experience.responsibilitiesLabel")}</p>
              <ul className={styles.responsibilities}>
                {item.responsibilities.map((responsibility) => (
                  <li key={responsibility} className={styles.responsibility}>
                    {responsibility}
                  </li>
                ))}
              </ul>

              {item.technologies.length > 0 && (
                <>
                  <p className={styles.subheading}>{t("experience.technologiesLabel")}</p>
                  <div className={styles.techList}>
                    {item.technologies.map((tech) => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {item.initiatives && item.initiatives.length > 0 && (
                <div className={styles.initiatives}>
                  {item.initiatives.map((initiative) => (
                    <div key={initiative.title} className={styles.initiative}>
                      <h4 className={styles.initiativeTitle}>{initiative.title}</h4>
                      <p className={styles.initiativeDescription}>{initiative.description}</p>
                      <div className={styles.initiativeHighlights}>
                        {initiative.highlights.map((highlight) => (
                          <span key={highlight} className={styles.initiativeHighlight}>
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {item.recognition && (
                <p className={styles.recognition}>
                  <span className={styles.recognitionLabel}>
                    {t("experience.recognitionLabel")}
                  </span>
                  <span>{item.recognition}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
