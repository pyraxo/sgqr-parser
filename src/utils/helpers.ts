type RangeObject<T> = Record<string, T>;

export const createRangeObject = <T>(
  start: number,
  end: number,
  value: T
): RangeObject<T> => {
  return Object.fromEntries(
    Array.from({ length: end - start + 1 }, (_, i) => [
      String(i + start).padStart(2, '0'),
      value,
    ])
  );
};
