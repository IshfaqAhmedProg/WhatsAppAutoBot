export const uniqueKeys = (objects) => {
  const keys = objects.reduce((acc, obj) => {
    Object.keys(obj).forEach((key) => acc.add(key));
    return acc;
  }, new Set());
  return Array.from(keys);
};
