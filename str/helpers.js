const collator = (lang) =>
  new Intl.Collator(lang, {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator
    /*usage: "search",*/
    /*sensitivity: "accent",*/
  });
export const { compare } = collator("no");

export const normalizeUppercase = (str) =>
  str
    ? str
        ?.toUpperCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
    : "";

export const normalizeLowercase = (str) =>
  str
    ? str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
    : "";
