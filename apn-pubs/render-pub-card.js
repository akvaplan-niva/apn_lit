import { renderAuthorNames } from "../apn-authors/render.js";
import { pdfIcon } from "../svg/pdf-icon.js";
import { warning } from "../html/warning.js";

import { html, svg } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const cleanHTML = (s) =>
  s && s.replace ? s.replace(/\<\/?strong>/g, "").replaceAll("\n", "") : s;

export const renderPubCard = (
  {
    title,
    published,
    authors,
    doi,
    prefix,
    suffix,
    container,
    license,
    cites,
    type,
    pdf,
    i,
    open = /^cc/i.test(license),
    ...rest
  },
  { linkDOI = false, host } = {},
) =>
  html` <div class="mdc-card _mdc-card--outlined mdc-typography">
  <div class="mdc-typography--body1">
    <span style="--apn-secondary: rgb(var(--apn-red))"
      >${
    "preprint" === type
      ? warning({
        text: "Preprint (discussion paper)",
        icon: "android",
      })
      : null
  }</span
    >
    
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400" rel="stylesheet" />

    <h2 class="mdc-typography--headline5">
      <a href="/doi/${prefix && suffix ? `${prefix}/${suffix}` : doi}">
        ${unsafeHTML(cleanHTML(title))}
      </a>
    </h2>
    <div>
      ${renderAuthorNames({ authors }, { host, published })}
    </div>
    <p>
      <em>
        ${container}
      </em>
      (${published})
    </p>

    <p>
      ${
    type
      ? html`<p>
            <a href="/pubs/?q=${type}">${type.replace("-", " ")}</a>${
        cites > 0
          ? html`, with ${cites} citation${cites !== 1 ? "s" : null}`
          : null
      }
          </p>`
      : null
  }

      <cc-icons license="${license}" tech="svg"></cc-icons>
      ${
    pdf
      ? html` <a href="${pdf}" slot="icon" style="margin-right: 12px;">
            ${pdfIcon({ svg, width: 18, height: 18 })}
          </a>`
      : null
  }
    </p>

    ${
    doi && linkDOI
      ? html`<div class="headline6">
          <a
            href="https://doi.org/${doi}"
            target="_blank"
            style="display:grid; grid-gap: 0.25rem; grid-template-columns: auto 1fr; align-items: center;"
            ><mwc-icon>exit_to_app</mwc-icon>
            <span>https://doi.org/${doi}</span>
          </a>
        </div>`
      : null
  }
  </div>
</div>`;
