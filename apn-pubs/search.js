// https://github.com/nextapps-de/flexsearch

// import Index from "../flexsearch/src/index.js";
// import advanced from "../flexsearch/src/lang/latin/advanced.js";
import Index from "flexsearch";
import advanced from "flexsearch/lang/latin/advanced.js";
//import simple from "../flexsearch/src/lang/latin/simple.js";

import { frozenPubMap } from "./frozen.js";

import { stringifySlim } from "./stringify-slim.js";
import { exclude, synonyms } from "./synonyms.js";
import {
  normalizeLowercase as down,
  normalizeUppercase as up,
} from "../str/helpers.js";

const { encode } = advanced; // simple|advanced https://github.com/nextapps-de/flexsearch#encoders;
const tokenize = "forward";
const indexOptions = { encode, tokenize };
const indexFactory = () => new Index(indexOptions);

export const memMap = () => _map;

export const size = () => _map.size;

export const setMap = (map) => (_map = map);

export const get = (key) => _map.get(key.toLowerCase());

export const has = (key) => _map.has(key.toLowerCase());

export const set = (d) => {
  _map.set(d.doi, d);
  _index.add(d.doi, JSON.stringify(d));
};
export const getKeys = (keys) => keys.map((k) => _map.get(k));

export const all = () => [..._map.values()];

export const createSearchIndex = (slimdocs) => {
  _index = indexFactory();
  slimdocs.map(set);
};

// @todo BAD NAME
export const searchKeys = ({ params }) => {
  const { q, limit } = params;
  const index = _index;
  return index?.search(q ?? "", { limit });
};

export const filterFactory = ({ selected }) => (d) => {
  let include = true;
  const year = new Date(d.published).getFullYear();

  for (const [k, set] of selected) {
    if (set.size > 0) {
      if (/^years?/.test(k)) {
        include = set.has(year);
      } else if (/^author/.test(k)) {
        const selectedFam = [...set].map((n) => n.split(",")[0].trim());
        const fams = new Set(d?.authors.map(({ family }) => family));

        include = selectedFam.some((family) => fams.has(family));
      } else {
        if (!set.has(d[k])) {
          include = false;
          continue;
        }
      }
    }
  }
  return include;
};

const isFiltered = ({ params }) => {
  for (const [k, set] of params?.selected ?? new Set()) {
    if (set.size > 0) {
      return true;
    }
  }
  return false;
};

export const sortFactory = ({ dir, key, type }) => {
  return type === "numeric"
    ? (a, b) => dir * Number(a[key] - b[key])
    : (a, b) =>
      Number(a?.[key]) === a?.[key]
        ? dir * Number(a[key] - b[key])
        : dir * a?.[key]?.localeCompare(b?.[key]);
};

export const search = ({ params }) => {
  let all;
  let total = size();
  const { q, selected, limit, filter, sort, sortdir, sorttype } = params;
  //const [, minus] = q.match(/[-]([\w]+)/) ?? [];
  if (q && q.length > 0) {
    // Ineffective warning:
    // search is first performed with max limit, to get numbers found, and then sliced down to limit
    const maxlimit = _map.size;
    params.limit = maxlimit;

    // if (minus) {
    //   params.q = params.q.replace(`-${minus}`, "");
    // }
    const keys = searchKeys({ params });
    all = getKeys(keys.slice(0, limit));
  } else {
    all = [..._map.values()];
  }
  let filtered = "function" === typeof filter ? all.filter(filter) : all;

  if (exclude.has(down(q))) {
    // filtered = filtered.filter(
    //   (slim) =>
    //     false === down(JSON.stringify(slim)).includes(down(exclude.get(q)))
    // );
  }

  if (sort === "_authors") {
    filtered = filtered.map((p) => {
      p._authors = p.authors
        ?.map(({ name, family, given }) => (name ? name : family))
        .join(" ");
      return p;
    });
  }

  const sorter = sort && sortdir
    ? sortFactory({ dir: sortdir, key: sort, type: sorttype })
    : () => 1;

  let sorted = "function" === typeof sorter ? filtered.sort(sorter) : filtered;

  const found = filtered.length;

  const docs = isFiltered({ params })
    ? filtered
    : filtered.slice(0, params?.limit ?? 100);

  const showing = docs.length;

  return { docs, params, found, total, showing };
};

export const fetchLatestPublications = async ({ limit = 20 } = {}) =>
  [..._map.values()].slice(0, limit ?? 20); // assumes mem map is already sorted fresh first!

let _index = indexFactory();
let _map = await frozenPubMap({ limit: -1 });
[..._map.values()].map((d) => {
  const { title } = d;
  const syn = new Set();
  for (const [trigger, list] of synonyms) {
    const re = new RegExp(trigger, "i");
    if (title.match(re)) {
      list.map((word) => syn.add(word));
    }
  }
  if (syn.size > 0) {
    d._syn = [...syn];
  }
  const text = JSON.stringify(d);
  _index.add(d.doi.toLowerCase(), text);
});

export const fnlt5 = [
  "aune",
  "bahr",
  "bye",
  "dhar",
  "dunn",
  "enok",
  "foss",
  "leu",
  "nes",
  "nøst",
  "zhou",
];

export const types = [
  "journal-article",
  "book-chapter",
  "proceedings-article",
  "book",
  "posted-content",
  "preprint",
  "other",
  "report",
];

export const licenses = ["cc-by", "cc-by-nc", "cc-by-nc-nd", "cc-zero"];

export const pubsForAuthor = ({ family, given }) =>
  [..._map.values()].filter(({ authors }) =>
    authors.some(
      (a) => up(family) === up(a?.family) && up(a?.given?.[0]) === up(given[0]),
    )
  );

export const authors = (n = 20) =>
  JSON.parse(
    `["Falk-Petersen, S","Renaud, P E","Carroll, J","Camus, L","Imsland, A K","Hop, H","Foss, A","Carroll, M L","Varpe, Ø","Berge, J","Ambrose, W G","Evenset, A","Leu, E","Dahle, S","Gunnarsson, S","Halsband, C","Stefansson, S O","Daase, M","Frantzen, M","Hattermann, T","Nahrgang, J","Reynolds, P","Christensen, G","Augustine, S","Imsland, A  K","Herzke, D","Randelhoff, A","Wold, A","Gabrielsen, G W","Elvegård, T A","Geraudie, P","Sagerup, K","Søreide, J E","Cottier, F","Hangstad, T A","Gulliksen, B","Halsband-Lenk, C","Merkel, B","Morata, N","Pedersen, K B","Reigstad, M","Sundfjord, A","Thorarensen, H","Vikingstad, E","Andrade, H"]
`,
  ).slice(0, n);
//cat slim/* | bin/count-authors | head -n51| nd-map '`${d.family}, ${d.given?.split(/[.\s]/).map(s=>s.substring(0,1)).join(" ").trim()}`' | nd-group '1' | nd-uniq '[...new Set(d[1])]'
