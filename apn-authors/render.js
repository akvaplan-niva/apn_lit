import { html } from "lit";

import { findApn, isApn, isApnNow } from "../employee/akvaplan-employee.js";

// const fire = (host, name, detail) =>
//   host.dispatchEvent(
//     new CustomEvent(name, { detail, bubbles: true, composed: true })
//   );

const cleanFamily = (family) => family?.replace(/\d{1,}$/, "");

const personHref = ({ family, given }) =>
  `/people/${family}/${given}`.replace(/\s/g, "+");

export const renderAuthor = (
  { family, given, name, affiliation },
  { host, onlyFamily = true, published } = {},
) => {
  family = family && family.length ? cleanFamily(family) : undefined;
  const alt = "";

  const akvaplan = findApn({ family, given, affiliation });
  const isAkvaplan = akvaplan !== undefined;
  const isAkvaplanNow = isAkvaplan && isApnNow({ family, given, affiliation });

  const titleSuffix = isAkvaplan
    ? ` – ${!isAkvaplanNow ? "Former " : ""}Akvaplan-niva employee`
    : "";
  const title = `${given} ${family}${titleSuffix}`;

  return isAkvaplan
    ? html`<a href="${
      personHref({ family, given })
    }" title="${title}" style="font-weight: bold; color: var(--accent)">${
      onlyFamily || !given ? null : given + " "
    }${family ?? name}&nbsp;<apn-symbol style="${
      isAkvaplanNow ? "" : `filter: grayscale(1)`
    }"></apn-symbol></a>`
    : html`<span title="${title}">${onlyFamily || !given ? null : given + " "}${
      family ?? name
    }</span>`;
};

export const renderAuthorNames = (
  { authors },
  { host, i = 0, published } = {},
) =>
  (authors ?? []).map(
    ({ family, given, name }) =>
      html`${renderAuthor({ family, given, name }, { host, published })}${
        i++ < authors.length - 1 ? `, ` : null
      }`,
  );
