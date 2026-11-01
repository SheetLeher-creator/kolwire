import type { Asset, Entity } from "./types";

export const INDICATIONS: Entity[] = [
  { slug: "nsclc", name: "NSCLC", description: "Non-small cell lung cancer — the most crowded ADC and IO battleground in oncology." },
  { slug: "sclc", name: "SCLC", description: "Small cell lung cancer — an area of renewed interest for DLL3- and B7-H3-directed approaches." },
  { slug: "ovarian", name: "Ovarian cancer", description: "Ovarian cancer — folate receptor alpha and CDH6 ADCs dominate expert discussion." },
  { slug: "breast", name: "Breast cancer", description: "Breast cancer — HER2, HER2-low and TROP2 ADCs reshaping sequencing debates." },
  { slug: "endometrial", name: "Endometrial cancer", description: "Endometrial cancer — post-IO settings and TROP2 ADC exploration." },
  { slug: "prostate", name: "Prostate cancer", description: "Prostate cancer — radioligand therapy and PSMA-targeted approaches." },
  { slug: "pancreatic", name: "Pancreatic cancer", description: "Pancreatic cancer — KRAS-directed agents and high unmet need." },
  { slug: "head-neck", name: "Head and neck cancer", description: "Head and neck cancer — bispecifics and EGFR-directed combinations." },
];

export const COMPANIES: Entity[] = [
  { slug: "merck", name: "Merck & Co.", description: "Large-cap oncology leader with an expanding ADC portfolio including sac-TMT (with Kelun-Biotech)." },
  { slug: "astrazeneca", name: "AstraZeneca", description: "Oncology major co-developing Enhertu and Datroway with Daiichi Sankyo." },
  { slug: "daiichi-sankyo", name: "Daiichi Sankyo", description: "DXd ADC platform originator; partner on Enhertu and Datroway." },
  { slug: "gilead", name: "Gilead Sciences", description: "Developer of Trodelvy (sacituzumab govitecan), a TROP2 ADC." },
  { slug: "pfizer", name: "Pfizer", description: "Expanded ADC presence following the Seagen acquisition." },
  { slug: "abbvie", name: "AbbVie", description: "Oncology pipeline including ABBV-706 and Elahere." },
  { slug: "genmab", name: "Genmab", description: "Antibody innovator developing rinatabart sesutecan (Rina-S)." },
  { slug: "gsk", name: "GSK", description: "Oncology portfolio including Jemperli and B7-H3 ADC programs." },
];

export const ASSETS: Asset[] = [
  { slug: "sac-tmt", name: "Sacituzumab tirumotecan", company: "merck", modality: "ADC", target: "TROP2", description: "TROP2-directed ADC (MK-2870 / sac-TMT)." },
  { slug: "enhertu", name: "Trastuzumab deruxtecan", company: "astrazeneca", modality: "ADC", target: "HER2", description: "HER2-directed DXd ADC (Enhertu)." },
  { slug: "datroway", name: "Datopotamab deruxtecan", company: "astrazeneca", modality: "ADC", target: "TROP2", description: "TROP2-directed DXd ADC (Datroway)." },
  { slug: "trodelvy", name: "Sacituzumab govitecan", company: "gilead", modality: "ADC", target: "TROP2", description: "TROP2-directed SN-38 ADC (Trodelvy)." },
  { slug: "rina-s", name: "Rinatabart sesutecan", company: "genmab", modality: "ADC", target: "FRα", description: "Folate receptor alpha ADC (Rina-S)." },
  { slug: "abbv-706", name: "ABBV-706", company: "abbvie", modality: "ADC", target: "SEZ6", description: "SEZ6-directed ADC in development for SCLC." },
  { slug: "tarlatamab", name: "Tarlatamab", company: "pfizer", modality: "TCE", target: "DLL3", description: "DLL3 x CD3 T-cell engager class used here as a TCE discussion example (illustrative company tag)." },
  { slug: "lu-psma", name: "Lu-177 PSMA radioligand", company: "pfizer", modality: "Radiopharmaceutical", target: "PSMA", description: "PSMA-targeted radioligand class (illustrative company tag)." },
];

export const CONFERENCES = ["ASCO", "ESMO", "AACR", "WCLC", "SABCS", "SGO"];
export const SPECIALTIES = ["Thoracic oncology", "Breast oncology", "Gynecologic oncology", "GU oncology", "GI oncology", "Head & neck oncology", "Translational science"];

export const indicationName = (s: string) => INDICATIONS.find((i) => i.slug === s)?.name ?? s;
export const companyName = (s: string) => COMPANIES.find((i) => i.slug === s)?.name ?? s;
export const assetName = (s: string) => ASSETS.find((i) => i.slug === s)?.name ?? s;
