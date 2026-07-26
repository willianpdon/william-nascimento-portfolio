import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  children?: ReactNode;
}

/**
 * Shared eyebrow + title pattern used at the top of every content
 * section (About, Experience, Expertise, Certifications, ...), so
 * sections read as one consistent system rather than independently
 * styled blocks.
 */
export function SectionHeading({ eyebrow, title, intro, id, children }: SectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <p className={styles.eyebrow}>
        <span className={styles.eyebrowDot} aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
      {intro && <p className={styles.intro}>{intro}</p>}
      {children}
    </div>
  );
}
