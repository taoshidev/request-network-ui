/**
 * Sorts an array of objects based on a specified string property.
 * Entries without the property (null/undefined) are sorted to the end.
 *
 * @param {Array} array The array of objects to sort.
 * @param {string} property The property of the objects to sort by.
 * @param {boolean} ascending If true, sort ascending. If false, sort descending.
 * @returns {Array} The sorted array.
 */
export function sortObjectsByString(array, property, ascending = true) {
  return array.slice().sort((a, b) => {
    const propA = a[property] || "";
    const propB = b[property] || "";

    if (propA === "" && propB === "") return 0;
    if (propA === "") return 1;
    if (propB === "") return -1;

    // Locale compare for case insensitive sorting
    const comparison = propA.localeCompare(propB, undefined, {
      sensitivity: "accent",
    });

    // Return based on ascending or descending order
    return ascending ? comparison : -comparison;
  });
}
