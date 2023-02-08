import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { renderAuthorNames } from "../apn-authors/render.js";

const appDOIURL = ({ doi }) => `/doi/${doi}`;

export const renderSlimCard = ({
  title,
  doi,
  authors,
  container,
  published,
  license,
  urlfx = appDOIURL,
}) =>
  html`<mdc-card>
  <div>
    <h2 class="mdc-typography--headline5">
      <a href="${urlfx({ doi })}">
        ${unsafeHTML(title)}
      </a>
    </h2>
    <div>
      ${renderAuthorNames({ authors }, { published })}
    </div>
    <p>
      ${container} (${published})
    </p>
  </div>
</mdc-card>`;

// <!-- <p>${type.replace("-", " ")}</p>-->
// <!-- open access / license here -->
// <a href="/pubs/?q=${open === true ? "open" : null}">
//   ${[true, false].includes(open)
//     ? openAccessIcon({ license, open, height: 36 }, { host })
//     : null}
// </a>
