/**
 * Gets an item from the local storage by the key, parses JSON
 * @param {String} key
 * @return {null|any}
 */
export const getItemAndParse = (key) => {
  const json = localStorage.getItem(key);

  if (!json) { return null; }

  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

/**
 * Stringifies an object or an array or a number or a string to JSON
 * and stores it to the local storage
 * @param {String} key
 * @param {Object|Array|Number|String} data
 */
export const stringifyAndSetItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

/**
 * Removes an item from the local storage by the key.
 * @param {String} key
 */
export const removeItem = (key) => localStorage.removeItem(key);
