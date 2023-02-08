import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export const warning = ({ text, icon = "feedback" } = {}) =>
  html`<span
  class="mdc-typography--headline6"
  style="display:grid; grid-gap: 0.25rem; grid-template-columns: 24px auto; align-items: center; color: var(--apn-secondary)"
>

  <span class="material-symbols-outlined">${icon}</span>
  <span>
    ${unsafeHTML(text)}
  </span>
</span>`;
