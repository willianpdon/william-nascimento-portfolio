import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Certifications.module.css";

interface Certification {
  name: string;
  code: string;
  issuer: string;
  date: string;
  credentialUrl: string | null;
}

interface EducationEntry {
  program: string;
  institution: string;
  status: string;
}

export function Certifications() {
  const { t } = useTranslation();
  const certifications = t("certifications.certificationsList", {
    returnObjects: true,
  }) as unknown as Certification[];
  const education = t("certifications.educationList", {
    returnObjects: true,
  }) as unknown as EducationEntry[];

  return (
    <section
      id="certifications"
      className={styles.certifications}
      aria-labelledby="certifications-heading"
    >
      <Container>
        <SectionHeading
          id="certifications-heading"
          eyebrow={t("certifications.eyebrow")}
          title={t("certifications.title")}
        />

        <div className={styles.columns}>
          <div className={styles.column}>
            <p className={styles.columnTitle}>{t("certifications.certificationsTitle")}</p>
            {certifications.map((cert) => (
              <div key={cert.code} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{cert.name}</h3>
                  <span className={styles.cardCode}>{cert.code}</span>
                </div>
                <p className={styles.cardMeta}>
                  {cert.issuer} · {cert.date}
                </p>
                {cert.credentialUrl ? (
                  <a
                    className={styles.cardLink}
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t("certifications.viewCredential")}
                  </a>
                ) : (
                  <span className={styles.cardPending}>{t("certifications.credentialPending")}</span>
                )}
              </div>
            ))}
          </div>

          <div className={styles.column}>
            <p className={styles.columnTitle}>{t("certifications.educationTitle")}</p>
            {education.map((entry) => (
              <div key={entry.program} className={styles.card}>
                <h3 className={styles.cardTitle}>{entry.program}</h3>
                <p className={styles.cardMeta}>{entry.institution}</p>
                <span className={styles.cardStatus}>{entry.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
