function removeEmptyPropertiesFromObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });
}

module.exports = {
  removeEmptyPropertiesFromObject,
};
