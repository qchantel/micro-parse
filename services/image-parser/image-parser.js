const Vibrant = require("node-vibrant");
const { enrichColor } = require("../../helpers/colors");

const banListRegex = /ico|svg/;

async function findImageColor(metaData) {
  const { logo, image } = metaData;
  let targetImage = logo;
  if (banListRegex.test(logo)) targetImage = image;
  const vib = await Vibrant.from(targetImage);
  const vibrantPalette = await vib.getPalette();

  console.log(targetImage);
  const enrichedVibrantPalette = Object.entries(vibrantPalette).map((v) => ({
    ...v[1],
    ...enrichColor(v._rgb),
  }));

  //   console.log(enrichedVibrantPalette);
  palette = {
    primaryColor: {
      rgb: vibrantPalette.Vibrant._rgb,
      hsl: vibrantPalette.Vibrant._hsl,
      ...enrichColor(vibrantPalette.Vibrant._rgb),
    },
  };
  //   console.log(vibrantPalette, metaData.title, targetImage);

  return palette;
}

module.exports = {
  findImageColor,
};
