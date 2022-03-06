const Vibrant = require("node-vibrant");
const { enrichColor } = require("../../helpers/colors");

const banListRegex = /ico|svg/;

async function findImageColor(metaData) {
  const { logo, image } = metaData;
  let targetImage = logo;
  if (banListRegex.test(logo)) targetImage = image;
  const vib = await Vibrant.from(targetImage);
  const vibrantPalette = await vib.getPalette();
  palette = {
    primaryColor: {
      rgb: vibrantPalette.Vibrant._rgb,
      hsl: vibrantPalette.Vibrant._hsl,
      ...enrichColor(vibrantPalette.Vibrant._rgb),
    },
  };

  return palette;
}

module.exports = {
  findImageColor,
};
