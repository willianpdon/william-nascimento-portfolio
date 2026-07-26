import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Certifications } from "@/components/sections/Certifications";
import { useHtmlLang } from "@/hooks/useHtmlLang";

export function App() {
  useHtmlLang();
  const { t } = useTranslation();

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("nav.skipToContent")}
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Expertise />
        <Certifications />
        {/* Projects, International Journey and Contact sections ship
            in later phases — see README roadmap. */}
      </main>
    </>
  );
}
