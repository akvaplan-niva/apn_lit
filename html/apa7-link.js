import { html } from "lit";

const titleWithFile = ({ title, file, type, filetype }) =>
  file && file.startsWith("https")
    ? html`<a href="${file}">${title}</a> [${type}, ${filetype}]. `
    : html`<b>${title}</b>. `;

export const apa7Link = ({
  url,
  type,
  file,
  filetype,
  title,
  hreflang,
  author,
  published,
  container,
  details,
  version,
}) =>
  html`<span
    >${author && published ? html`${author} (${published}). ` : null}${title &&
    title.length > 0
      ? titleWithFile({ title, file, type, filetype })
      : null}${container && container != author ? html`${container}. ` : null}<a
      href="${url}"
      >${url}</a
    >
    ${version ? html` (${version})` : null}</span
  >`;
