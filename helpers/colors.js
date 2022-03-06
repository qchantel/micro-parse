import Color from "color";

export function enrichColor(color, type = "string") {
  let newColor = null;

  try {
    if (type === "string") {
      newColor = Color(color).rgb();
    } else {
      newColor = Color.rgb(color);
    }

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
