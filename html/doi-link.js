import { html } from "lit";

const forceNakedDOI = ({ doi }) => {
  return "10." + doi.split("10.")[1];
};

export const doiLink = ({ doi, icon = "exit_to_app" }) =>
  doi
    ? html`<a
        class="headline6"
        href="https://doi.org/${forceNakedDOI({ doi })}"
        target="_blank"
        style="display:grid; grid-gap: 0.25rem; grid-template-columns: auto 1fr; align-items: center;"
        ><mwc-icon>${icon}</mwc-icon>
        <span>https://doi.org/${doi}</span>
      </a>`
    : null;
