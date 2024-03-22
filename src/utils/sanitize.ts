/**
 * Converts complex or nested objects into plain objects for easy serialization.
 * Arrays and Date objects are preserved.
 *
 * @param obj Any input value to be converted to a plain object.
 * @returns A plain object representation of the input, with nested structures converted.
 */
export const toPlainObject = (obj: any): any => {
  if (obj !== Object(obj) || obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toPlainObject);

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, toPlainObject(v)])
  );
};

/**
 * Recursively removes specified properties from an object or an array of objects.
 * @param data The object or array of objects to filter.
 * @param propertiesToRemove An array of property names to remove.
 * @returns The filtered object or array of objects.
 */
export const filterData = (data: any, propertiesToRemove: string[]): any => {
  if (data instanceof Date) return data;

  if (Array.isArray(data)) {
    return data.map((item) => filterData(item, propertiesToRemove));
  } else if (data !== null && typeof data === "object") {
    const filteredData = { ...data };
    propertiesToRemove.forEach((property) => delete filteredData[property]);

    // Recursively filter nested objects
    Object.keys(filteredData).forEach((key) => {
      filteredData[key] = filterData(filteredData[key], propertiesToRemove);
    });
    return filteredData;
  }
  return data;
};
