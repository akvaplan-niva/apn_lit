//
// Analytical Laboratories and Infrastructure
// Aquaculture
// Aquaculture Innovation
// Aquaculture Inspections
// Aquaculture Production and Sustainability
// Aquaculture and Seafood
//
//
// Climate and Ecosystems
// Coasts and Industry
//
//
// Energy and Environments
// Env. Risks &amp; Contingency Analyses
// Environmental Assessments and Monitoring
//
// ["MILPÅ", "Environmental Impacts"],
// Environments">Environments</option><option value="
//
// Oceanography">Oceanography</option><option value="
// Research and Innovation Facility Kraknes"
//

//cat empl.json  | ndjson-split | nd-group d.unit | nd-map '[d[0],null]'
export const unit = new Map([
  ["INSPM", "Aquaculture Inspections"],
  ["STABS", "Staff and Support"],
  ["LEDELS", "Leadership"],
  ["ARCFR", null],
  ["INNOV", "Aquaculture Innovation"],
  ["PRODB", "Aquaculture Production and Sustainability"],
  ["FISK", "FISK Research and Innovation Facility"],
  ["SENSE", "Sensitive Environments Decision Support (SensE)"],
  ["OSEAN", "Oceanography"],
  ["BIOLT", "Biological Analyses and Taxonomy"],
  ["ØKOSY", "Ecosystems"],
  ["FISLOG", "Field Insfrastucture and Logistics"],
  ["MILPÅ", "Environmental Impacts"],
  ["UTRED", "Environmental Assessments and Monitoring"],
  ["KJEMI", "Chemistry Lab"],
  ["DIGIS", "Digital Solutions"],
]);
