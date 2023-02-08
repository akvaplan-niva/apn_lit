import { renderPubCard } from "./render-pub-card.js";
import { renderSlimCard } from "../apn-slim-card/render.js";
import { renderAuthorNames } from "../apn-authors/render.js";

import { html, svg } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
//import { ifDefined } from "lit/directives/if-defined.js";

const cleanHTML = (s) =>
  s && s.replace ? s.replace(/\<\/?strong>/g, "").replaceAll("\n", "") : s;

const fire = (host, name, detail) =>
  host.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true })
  );

const parseDOI = (doi) => {
  doi = doi.startsWith("10.") ? `https://doi.org/${doi}` : doi;
  const url = new URL(doi);
  const [_, prefix, ...rest] = url.pathname.split("/");
  const suffix = rest.join("/");
  return { prefix, suffix };
};

const zeroCard = ({ q }) =>
  html`<mdc-card>
    <h1 class="headline4">Searching for "${q}" gave 0 results</h1>
    <div>
      <a href="/pubs"><mwc-button raised outlined>Start over</mwc-button></a>
    </div>
  </mdc-card> `;

export const renderCards = ({ pubs, host }) => {
  return html`<div class="cards">
    ${pubs?.length === 0 ? zeroCard({ q: host?.q ?? "" }) : null}
    ${pubs.map(({ doi, ...rest }, i) => {
      const { prefix, suffix } = parseDOI(doi);
      return renderPubCard({ doi, i, prefix, suffix, host, ...rest });
    })}
  </div>`;
};

// initials?
// ${authors?.map(({ name, family, given }, i) =>
//   name
//     ? html`${name}, `
//     : html`${family}
//       ${(given ?? "?").split(" ").map((s) => s.substring(0, 1))}${i <
//       authors.length - 1
//         ? ", "
//         : null}`
// )}

const renderListItem = ({
  title,
  published,
  authors,
  license,
  doi,
  type,
  container,
  ...rest
}) => {
  return html`<li>
    <pre>
${renderAuthorNames({ authors }, { published })}.
  <a href="/doi/${doi}">${unsafeHTML(cleanHTML(title))}</a>.
  <em>${container}</em> (${published}) [${type}].
  <a href="https://doi.org/${doi}">https://doi.org/${doi}</a>

</pre>
  </li>`;
};

export const renderGroupedList = ({ pubs, host }) => html`<ul
  class="mdc-typography--headline6"
  style="white-space: nowrap; line-height: 1.1em;"
>
  ${(pubs ?? []).map(renderListItem)}
</ul>`;

const variantMap = new Map([
  ["cards", renderCards],
  ["list", renderGroupedList],
]);

const get = (variant) => variantMap.get(variant) ?? renderCards;

export const renderResults = ({ host }) =>
  get(host.variant)({ host, pubs: host.pubs });
