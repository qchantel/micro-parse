const Color = require("color");

function enrichColor(color) {
  try {
    const newColor = Color(color).rgb();

    return {
      ...newColor,
      isLightColor: newColor.isLight(),
      luminosity: newColor.luminosity(),
      stringRgb: newColor.string(),
    };
  } catch (e) {
    console.error(e);
    return {};
  }
}

module.exports = {
  enrichColor,
};
