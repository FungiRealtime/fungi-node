export const unique = <T>(duplicates: T[]) =>
  duplicates.filter((item, i, ar) => ar.indexOf(item) === i);
