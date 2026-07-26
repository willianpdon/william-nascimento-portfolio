/**
 * Non-translatable profile data: external links and asset paths.
 * CV files are still placeholders — replace before launch. Nothing
 * here is invented biographical content.
 */
export const profile = {
  linkedinUrl: "https://www.linkedin.com/in/william-nascimento-a3b92633/",
  githubUrl: "https://github.com/willianpdon",
  // TODO: add the real CV files and point these paths at them.
  // Until then the Download CV button renders in a disabled state.
  cv: {
    en: null as string | null,
    pt: null as string | null,
  },
  contactEmail: "willianpdon@gmail.com",
} as const;
