const getUniqueValues = <T extends Record<string, any>>(
  data: T[],
  key: keyof T,
): any[] => {
  const unique = data.map((item) => item[key]);
  const uniqueSet = new Set(unique);
  return [...uniqueSet];
};

export default getUniqueValues;
