export const other = [
  { given: "Pierre", family: "Bories" }, // 2021
  { given: "Barbara", family: "Vögele" },
  {
    given: "Øystein",
    family: "Varpe",
    orcid: "0000-0002-5895-6983",
    alt: [{ given: "Øystein Heggernes" }],
    // Affiliated with Akvaplan-niva & UiB:
    // https://doi.org/10.1016/j.marenvres.2021.105262
    // https://doi.org/10.3354/meps13237
  },
  {
    given: "O",
    family: "Varpe",
    orcid: "0000-0002-5895-6983",
  },
  {
    // Affiliated with Akvaplan-niva & CNRS, Univ Brest, IRD, Ifremer, LEMAR, 29280 Plouzane, France
    // https://doi.org/10.1098/rsta.2019.0369 [2020]
    given: "Nathalie",
    family: "Morata",
  },
  { given: "Stig", family: "Falk‐Petersen", email: "sfp@akvaplan.niva.no" }, // with real hyphen: "‐" (not minus: "-")
  { given: "Stig Falk", family: "Petersen", email: "sfp@akvaplan.niva.no" }, // wrong family name (missing hyphen)

  { given: "Jos", family: "Kogeler", email: null },
  { given: "Ole Anders", family: "Nost", email: "oan@akvaplan.niva.no" },
  { given: "Claudia", family: "Halsband-Lenk", email: "clh@akvaplan.niva.no" },
];
