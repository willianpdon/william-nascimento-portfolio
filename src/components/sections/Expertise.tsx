import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Expertise.module.css";

interface ExpertiseGroup {
  title: string;
  items: string[];
}

export function Expertise() {
  const { t } = useTranslation();
  const groups = t("expertise.groups", { returnObjects: true }) as unknown as ExpertiseGroup[];

  return (
    <section id="expertise" className={styles.expertise} aria-labelledby="expertise-heading">
      <Container>
        <SectionHeading
          id="expertise-heading"
          eyebrow={t("expertise.eyebrow")}
          title={t("expertise.title")}
          intro={t("expertise.intro")}
        />

        <div className={styles.grid}>
          {groups.map((group) => (
            <div key={group.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{group.title}</h3>
              <div className={styles.itemList} role="list">
                {group.items.map((item) => (
                  <span key={item} className={styles.item} role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
