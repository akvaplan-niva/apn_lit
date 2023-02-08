const µplast = [
  "plastic",
  "plastics",
  "plast",
  "plastikk",
  "microplastic",
  "microplastics",
  "mikroplast",
  "mikroplastikk",
];
export const synonyms = new Map([
  ["microplastic", µplast],
  ["microplastics", µplast],
  ["plastic", µplast],
  ["plastics", µplast],
  ["plast", µplast],
  ["µplast", µplast],
]);

const plastexclude = µplast.map((term) => [term, ["plasticity", "plast"]]);

export const exclude = new Map(plastexclude);
