// Fix
// 10.1017/S0022149X10000660 Ligulaintestinalis Rutilusrutilus
// ["Salmo salarL."]
// ["Gadus morhuaL."]

const _species = [
  "Acartia longiremis",
  "Acritagasyllis longichaetosus", // Annelida: Phyllodocida: Syllidae
  //Acharax from Arctic methane seeps off Svalbard.
  "Alitta virens",
  "Alle alle",
  "Anarhichas minor",
  "Anoplopoma fimbria",
  "Anomalocardia flexuosa",
  "Apherusa glacialis",
  "Boreogadus saida",
  "Branta leucopsis",
  "Calanoides acutus",
  "Calanus finmarchicus",
  "Calanus glacialis",
  "Calanus helgolandicus",
  "Calanus hyperboreus",
  "Calanus pacificus",
  "Calanus propinquus",
  "Caligus elongatus",
  "Centropages typicus",
  "Chelonia mydas",
  "Chlamys islandicus",
  "Chlamys islandica", //typo?
  "Clinocardium ciliatum",
  "Crassostrea rhizophorae",
  "Ctenolabrus rupestris",
  "Cyclopterus lumpus",
  "Daphnia magna",
  "Delphinapterus leucas",
  "Erignathus barbatus",
  "Eualus gaimardii gibba",
  "Euphausia crystallorophias",
  "Eurythenes gryllus",
  "Fucus spiralis",
  "Gadus morhua",
  "Gammarus setosus",
  "Gammarus wilkitzkii",
  "Genypterus chilensis",
  "Hippoglossus hippoglossus",
  "Hyas araneus", //Arctic spider crab
  "Jaschnovia brevis",
  //"Jasmineira",
  "Laminaria hyperborea",
  "Larus hyperboreus",
  "Laonice bahusiensis",
  "Leuciscus cephalus",
  //"Lepeophterius salmonis", // https://doi.org/10.1016/j.aquaeng.2019.102025 typo, also another typo in article text: Lepoptherius salmonis // typo?
  "Lepeophtheirus salmonis",
  "Leptoclinus maculatus",
  // Leptoclinus maculates typo? https://doi.org/10.1134/S1062360420020071
  "Ligula intestinalis",
  "Littorina saxatilis",
  "Lophelia pertusa",
  "Lumpenus fabricii",
  "Macoma balthica",
  //"Marenzelleria",
  "Mallotus villosus",
  "Meganyctiphanes norvegica",
  "Mertensia ovum",
  "Myriophyllum spicatum",
  "Mytilus edulis",
  "Mytilus galloprovincialis",
  "Oncorhynchus gorbuscha",
  "Orcinus orca",
  "Pandalus borealis",
  "Paralithodes camtschaticus",
  "Paraonides nordica",
  "Perca fluviatilis",
  "Phoca hispida",
  "Phoca groenlandica",
  "Phoca vitulina",
  "Plectrophenax nivealis", //Snow buntings
  "Pseudocalanus moultoni",
  "Pseudocalanus newmani",
  "Pusa hispida",
  "Rissa tridactyla",
  "Haliotis rufescens", //red abalone
  "Rutilus rutilus",
  "Saccharina latissima",
  "Salmo salar",
  "Salmo trutta",
  "Salvelinus alpinus",
  //Scolelepis // 10.5324/fn.v35i0.1666
  "Scophthalmus maximus",
  "Selenastrum capricornutum",
  "Serripes groenlandicus",
  "Somniosus microcephalus",
  "Solea solea",
  "Solea senegalensis",
  "Streblospio", //  cf. gynobranchiata" ?,
  "Strongylocentrotus droebachiensis",
  "Temora stylifera",
  "Thalassiosira antarctica", //"var. borealis" ?,
  "Themisto abyssorum",
  "Themisto libellula",
  "Thysanoessa inermis",
  "Thysanoessa macrura", 
  "Thysanoessa raschi", // typo? 10.1007/bf00388175 10.1007/bf00397290
  "Thysanoessa raschii",
  "Ursus maritimus",
];

// $ cat slim/* | nd-map 'm=/(?<genus>\w+)(\ssp?p\.)/i.exec(d.title),m??undefined'
//   ["Anonyx sp.","Anonyx"," sp."]
//   ["Calanus spp.","Calanus"," spp."]
//   ["Mytilus sp.","Mytilus"," sp."]
//   ["Calanus spp.","Calanus"," spp."]
//   ["Mytilus spp.","Mytilus"," spp."]
//   ["Mytilus spp.","Mytilus"," spp."]
//   ["Mytilus spp.","Mytilus"," spp."]
//   ["Uria spp.","Uria"," spp."]

//const genusSpRE = (genus) => /(?<genus>Mytilus)(\ssp?p\.)/i;

const species = new Set(_species);

export const emphasizeSpecies = ({ text, set = species }) => {
  let repl = text.replace(/\s{2,}/g, " ");
  let found = 0;

  // const uppercasewords = text.match(/[A-Z]\w+/g);
  // const genera = new Set([..._species].map((sp) => sp.split(" ")[0]));
  // const candidates = [...set].filter((w) => genera.has(w));

  if (text.includes("sp.") || text.includes("spp.")) {
    let {
      groups: { genus },
    } = /(?<genus>\w+)(\ssp?p\.)/.exec(text) ?? {};
    if (genus) {
      found++;
      repl = repl.replace(genus, `<em>${genus}</em>`);
    }
  }

  for (const sp of set) {
    const m = new RegExp(`(?<species>${sp})`, "i").exec(text);

    if (m && m?.groups?.species && !text.includes(`<em>${sp}`)) {
      found++;
      repl = repl.replace(m[1], `<em>${sp}</em> `);
    } else if (text.includes(".")) {
      const genusInitialRE = new RegExp(
        `(${sp[0]}.) (${sp.split(" ")[1]})`,
        "i",
      );
      const matchDotSpecies = genusInitialRE.exec(text);

      if (matchDotSpecies && matchDotSpecies.length == 3) {
        found++;
        repl = repl
          .replace(matchDotSpecies[0], `<em>${matchDotSpecies[0]}</em> `)
          .replace(/\s{2,}/g, " ");
      }
    }
  }
  return found === 0 ? text : repl;
};
