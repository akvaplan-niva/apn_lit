const nb = { title: "publikasjoner" };
const en = {
  title: "publications",
  "sort.dir.asc": "↧ Sort increasing order (A-Z)",
  "sort.dir.desc": "↥ Sort reverse order (Z-A)",
  "sort.published[1]": "Most recent first",
  "sort.published[-1]": "Oldest first",
};

const { entries } = Object;
const langmap = new Map([
  ["nb", new Map(entries(nb))],
  ["no", new Map(entries(nb))],
  ["en", new Map(entries(en))],
]);

let _defaultLang = "en";
const defaultLang = () => _defaultLang;

export const t = (key, lang = defaultLang()) =>
  langmap.get(lang).get(key) ?? key;

export const helper = () => "";

export const sortDirTitle = ({ key, dir, lang }) =>
  t(`sort.dir.${dir === 1 ? "asc" : "desc"}`); // t(`sort.${key}[${dir}]`);
