// Since error response from drizzle is not a plain object, we need to convert
// it to a plain object so that it could be returned from server to client
export const toPlainObject = (obj: any): any => {
  if (obj !== Object(obj) || obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toPlainObject);

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, toPlainObject(v)])
  );
};
