import Vibrant from "node-vibrant";
import { enrichColor } from "../../helpers/colors.js";

const banListRegex = /ico|svg/;

export async function findImageColor(metaData) {
  const { logo, image } = metaData;

  let palette = {};
  let targetImage = logo;
  if (banListRegex.test(logo)) targetImage = image;
  if (!targetImage) return {};

  const vib = await Vibrant.from(targetImage);
  const vibrantPalette = await vib.getPalette();

  const enrichedVibrantPalette = Object.entries(vibrantPalette).map((v) => {
    const vibrantColor = v[1];
    return {
      ...vibrantColor,
      ...enrichColor(vibrantColor._rgb),
      colorType: v[0],
    };
  });
  // palette = {
  //   primaryColor: {
  //     rgb: vibrantPalette.Vibrant._rgb,
  //     hsl: vibrantPalette.Vibrant._hsl,
  //     ...enrichColor(vibrantPalette.Vibrant._rgb),
  //   },
  // };
  //   console.log(vibrantPalette, metaData.title, targetImage);

  return enrichedVibrantPalette;
}
