import { normalizeUppercase as up } from "../str/helpers.js";
import { all, current, findApn } from "./akvaplan-employee.js";
export const detectEmployee = ({
  text,
  onlyCurrent = false,
  candidates = onlyCurrent ? current : all,
} = {}) => {
  candidates = [
    ...new Set(
      candidates.map(({ family, given }) => `${family}/${given.split(" ")[0]}`)
    ),
  ]
    .map((n) => n.split("/"))
    .map(([family, given]) => ({ family, given }));

  const WORDS = new Set(
    text
      .replace(/[,.;"<>\/:=()]/g, " ")
      .split(" ")
      .filter((w) => w?.trim().length > 2)
      .map(up)
  );
  return candidates.filter(
    // A bit simplistic, since family and given is not detected together
    ({ family, given }) => WORDS.has(up(family)) && WORDS.has(up(given))
  );
};
