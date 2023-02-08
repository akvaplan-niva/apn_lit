import { prior } from "./prior.js";
import { other } from "./other.js";
import { current } from "./current.js";
import { empl } from "./empl.js";
export const akvaplanEmployee2021 = current;
export { empl as current };

const _all = [...akvaplanEmployee2021, ...other, ...prior];
export const all = [
  ...empl.map(({ name, ...p }) => p),
  ...akvaplanEmployee2021,
  ...other,
  ...prior,
];

export const norm = (str) =>
  str
    ? str
        ?.replace(/[-‐–‐‐]/, "–")
        .toUpperCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
    : "";

const excludeIfOnlyInitial = ({ family, given }) => {
  if ("Lorentzen" === family && given.length <= 2) {
    return true;
  }
  return false;
};

export const findByEmail = ({ email }) => all.find((p) => email === p?.email);

//const nameChanges Kathy Dunlop C Halsband

const sameFirstGiven = ({ given }, empl) => {
  const firstGiven = (name) => (name.includes(" ") ? name.split(" ")[0] : name);
  return norm(firstGiven(given)) === norm(firstGiven(empl?.given));
};

const sameGiven = ({ family, given }, empl) =>
  given?.replace(/\./g, "").length > 2 ||
  excludeIfOnlyInitial({ family, given })
    ? norm(given) === norm(empl?.given) ||
      sameFirstGiven({ given, family }, empl)
    : norm(given[0]) === norm(empl?.given[0]);

export const findApn = ({ family, given }, haystack = _all) =>
  haystack.find(
    (empl) =>
      (empl.family === family || norm(empl?.family) === norm(family)) &&
      given &&
      sameGiven({ family, given }, empl)
  );

const affilationContainsAkvaplan = (affiliationArray = []) =>
  affiliationArray.some(({ name }) => /akvaplan.niva/i.test(name));

export const isApn = ({ affiliation, ...author }) =>
  findApn(author) !== undefined ||
  affilationContainsAkvaplan(affiliation, author);

export const isApnNow = (author) => findApn(author, empl) !== undefined;

//FIXME Mis-affiliation when family name and initial is not unqiue, eg. K Isaksen, E Lorentzen
