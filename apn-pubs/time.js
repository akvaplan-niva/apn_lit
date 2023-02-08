const currentYear = () => new Date().getFullYear();

export const yearsInPeriod = ({
  first,
  length = 10,
  includeFuture = false,
  last = first + length,
} = {}) => {
  const current = currentYear();
  const _last = last > current && includeFuture === false ? current : last;
  return Array.from({ length: _last - first + 1 }, (_, i) => i + first);
};

export const allDecades = ({ start = 197 } = {}) => {
  const decades = new Set();
  const currentDecade = Number(String(currentYear()).substring(0, 3));
  for (let i = currentDecade; i >= start; --i) {
    decades.add(i);
  }
  return decades;
};

export const decadeLabel = ({ decade }) => {
  const last = (decade + 1) * 10 - 1;
  const current = currentYear();
  const lastLabel = current < last ? "" : last;
  return `${10 * decade}–${lastLabel}`;
};

export const periodLabel = ({ period, length }) => {
  const last = (period + 1) * length - 1;
  const current = currentYear();
  const lastLabel = current < last ? "" : last;
  return `${length * period}–${lastLabel}`;
};

export const yearsSet = () =>
  new Set(
    yearsInPeriod({
      first: 1978,
      last: new Date().getFullYear() + 1,
      includeFuture: true,
    })
  );
