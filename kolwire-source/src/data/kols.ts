import type { Kol } from "./types";

/**
 * FICTIONAL demonstration KOLs. Names, institutions and bios are invented.
 * Add `linkedinUrl` / `xUrl` only after verifying a real expert's public profile.
 */
const k = (id: string, name: string, title: string, institution: string, specialty: string, region: string, hue: number, bio: string): Kol => ({
  id, name, title, institution, specialty, region, hue, bio, isDemo: true,
  initials: name.replace("Dr. ", "").split(" ").map((w) => w[0]).slice(0, 2).join(""),
});

export const KOLS: Kol[] = [
  k("elena-varga", "Dr. Elena Varga", "Professor of Medical Oncology", "Northbridge Cancer Institute (fictional)", "Thoracic oncology", "Europe", 200, "Fictional thoracic oncologist focused on ADC sequencing in NSCLC and biomarker strategy."),
  k("marcus-hale", "Dr. Marcus Hale", "Director, Breast Oncology Program", "Lakeshore University Medical Center (fictional)", "Breast oncology", "North America", 250, "Fictional breast oncologist with interest in HER2-low disease and ADC tolerability."),
  k("priya-raman", "Dr. Priya Raman", "Associate Professor, Gynecologic Oncology", "Westfield Women's Cancer Center (fictional)", "Gynecologic oncology", "North America", 170, "Fictional gynecologic oncologist studying FRα-directed therapy in ovarian cancer."),
  k("kenji-morita", "Dr. Kenji Morita", "Chief, Thoracic Medical Oncology", "Pacific Rim Oncology Hospital (fictional)", "Thoracic oncology", "Asia-Pacific", 220, "Fictional thoracic oncologist active in SCLC trial design and T-cell engagers."),
  k("sofia-lindqvist", "Dr. Sofia Lindqvist", "Senior Consultant Oncologist", "Nordic Clinical Research Unit (fictional)", "Breast oncology", "Europe", 190, "Fictional consultant with focus on TNBC and TROP2 ADC sequencing."),
  k("david-okafor", "Dr. David Okafor", "Professor of Urologic Oncology", "Riverside Comprehensive Cancer Center (fictional)", "GU oncology", "North America", 140, "Fictional GU oncologist covering radioligand therapy and PSMA imaging."),
  k("amara-chen", "Dr. Amara Chen", "Translational Scientist", "Helix Institute for Cancer Biology (fictional)", "Translational science", "North America", 280, "Fictional translational researcher examining ADC payload biology and resistance."),
  k("luca-bernardi", "Dr. Luca Bernardi", "Head of Gynecologic Oncology Trials", "Mediterranean Oncology Network (fictional)", "Gynecologic oncology", "Europe", 30, "Fictional investigator focused on endometrial cancer after immunotherapy."),
  k("hannah-weiss", "Dr. Hannah Weiss", "Assistant Professor, GI Oncology", "Summit Health Cancer Center (fictional)", "GI oncology", "North America", 10, "Fictional GI oncologist focused on pancreatic cancer and KRAS-directed therapy."),
  k("rafael-ortiz", "Dr. Rafael Ortiz", "Head & Neck Medical Oncologist", "Andes Regional Cancer Hospital (fictional)", "Head & neck oncology", "Latin America", 60, "Fictional H&N oncologist tracking bispecifics and EGFR combinations."),
  k("mei-tanaka", "Dr. Mei Tanaka", "Clinical Pharmacologist", "Eastern Bay Research Hospital (fictional)", "Translational science", "Asia-Pacific", 320, "Fictional pharmacologist focused on ADC exposure-toxicity relationships."),
  k("oliver-grant", "Dr. Oliver Grant", "Consultant Thoracic Oncologist", "Kingsgate Teaching Hospital (fictional)", "Thoracic oncology", "Europe", 235, "Fictional thoracic oncologist interested in TROP2 biomarkers and ILD management."),
  k("nadia-farouk", "Dr. Nadia Farouk", "Director, Women's Cancer Research", "Crescent Medical University (fictional)", "Gynecologic oncology", "Middle East & Africa", 300, "Fictional researcher covering ovarian and endometrial ADC development."),
];

export const getKol = (id: string) => KOLS.find((x) => x.id === id);
