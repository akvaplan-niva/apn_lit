let _frozen;

export const frozenPubMap = async ({ limit = -1 } = {}) => {
  const local = await fetch("/api/pubs/frozen");
  if (local.ok) {
    _frozen = new Map(await local.json());
  }
  if (!_frozen) {
    const r = await fetch(
      `https://dois.deno.dev/doi?limit=${limit}&format=json`,
    );
    if (r.ok) {
      const { data } = await r.json();
      _frozen = new Map(
        data.map((
          { doi, ...slim },
        ) => [doi.toLowerCase(), { doi: doi.toLowerCase(), ...slim }]),
      );
    }
  }
  return _frozen;
};
