export function isValidYYYYMMDD(date: string): boolean {
  if (!/^\d{8}$/.test(date)) return false;
  const parsedDate = new Date(
    date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  );
  return !isNaN(parsedDate.getTime());
}

export function getDateFromYYYYMMDD(date: string): Date {
  return new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
}
