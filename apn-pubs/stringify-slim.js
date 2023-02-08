export const stringifySlim = ({
  doi,
  cites,
  container,
  title,
  authors,
  published,
  license,
  type,
  pdf,
}) =>
  `${title ?? ""}

  ${authors?.map(({ family, given, name }) => `${name} ${given} ${family}`)}

  ${cites === true ? "open" : ""}
  ${cites === false ? "closed" : ""}

  ${license ?? ""}

  ${published} ${published?.split("-").join(" ")}

  ${type ?? ""}

  ${container ?? ""}

  ${pdf ?? ""}

  ${doi ?? ""}

  ${doi ? `https://doi.org/${doi}`.split(/[:./]/g).join(" ") : ""}
`;
