import { sans } from "./font.js";
export const shared = ({ css }) => css`
  * {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: var(--apn-primary);
  }

  :host[hidden] {
    display: none;
  }
  [slot] {
    font-family: Source Sans Pro, sans-serif !important !important;
  }
`;
