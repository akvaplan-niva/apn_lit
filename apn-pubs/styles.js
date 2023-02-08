import cardstyle from "../style/card-style.js";
import { _typography } from "../style/typography.js";
import { shared } from "../style/shared.js";
import { headlines } from "../style/typography.js";
import { css } from "lit";

export const styles = [
  cardstyle({ css }),
  headlines({ css }),
  shared({ css }),
  css`
    .cards {
      display: grid;
      grid-gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
    }

    .red {
      --mdc-theme-primary: rgb(var(--apn-red));
    }
    .akvaplan-employee {
      font-weight: bold;
      color: rgb(var(--apn-black));
    }
    .secondary {
      color: var(--apn-secondary);
      --mdc-theme-primary: var(--apn-secondary);
    }
    @media (max-width: 1024px) {
      .hide-small {
        display: none;
      }
    }
    @media (min-width: 1025px) {
      .hide-large {
        display: none;
      }
    }
    mwc-textfield,
    mwc-circular-progress {
      --mdc-theme-primary: var(--apn-secondary);
    }
    apn-symbol::part(svg) {
      height: 12px;
    }
    apn-pubs-histogram rect:hover {
      fill: var(--apn-secondary);
    }
    apn-pubs-histogram rect.selected {
      fill: rgb(var(--apn-red));
    }
    .grid3 {
      display: grid;
      grid-template-columns: 48px, 1fr;
      grid-gap: 5px;
    }

    .grid3:first-child {
      grid-column: 1 / 3;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
    }
    dt {
    }
    cc-icons::part(icon) {
      height: 1.1em;
      fill: rgb(var(--apn-red));
    }
  `,
];
//   style="--mdc-typography-button-text-transform: none; white-space: nowrap;"
