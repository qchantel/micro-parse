const Color = require("color");

function findAndReplaceCssVar(cssVar, string) {
  const regex = new RegExp(`${cssVar.string}:(.*?)[;!><\"\!;\\}]`);
  const match = string.match(regex);
  return { color: match[1], ...cssVar };
}

function parseCssVar(cssVar) {
  const cssVarRegex = /var\((.*)\)/;
  const match = cssVar.match(cssVarRegex);
  return match[1];
}

function findColors(string) {
  colorRegex = /(color:|background-color:)(.*?)[\"\!;\\}]/gi;
  const matches = string.matchAll(colorRegex);
  const colorList = [];

  let i = 0;
  for (const match of matches) {
    i++;
    if (i > 300) break;
    colorList.push(match[2]);
  }
  const varList = [];
  const noVarList = colorList.filter((color) => {
    if (color.includes("var")) {
      const varCol = parseCssVar(color);
      varList.push({ string: varCol });
      return false;
    }
    return true;
  });

  const varListByFrequency = freqConvert(varList);

  const replacedVarList = varListByFrequency
    .map((varColor) => findAndReplaceCssVar(varColor, string))
    .map((convertedVar) => {
      try {
        const { color, frequency } = convertedVar;
        const newColor = Color(color).rgb();
        if (newColor.valpha !== 1) return null;
        return {
          ...newColor,
          luminosity: newColor.luminosity(),
          string: newColor.string(),
          frequency,
        };
      } catch (e) {
        return null;
      }
    });

  const converted = noVarList.map((color) => {
    try {
      const newColor = Color(color).rgb();
      if (newColor.valpha !== 1) return null;
      return {
        ...newColor,
        luminosity: newColor.luminosity(),
        string: newColor.string(),
      };
    } catch (e) {
      return null;
    }
  });

  const fullList = converted.concat(replacedVarList);
  return fullList.filter((c) => {
    if (!c) return false;
    if (c.luminosity === 1 || c.luminosity === 0) return false;
    return true;
  });
}

function freqConvert(colorList) {
  const hashMap = {};
  colorList.forEach((elem) => {
    if (!elem.frequency) elem.frequency = 1;
    if (hashMap[elem.string]) {
      hashMap[elem.string].frequency += elem.frequency;
    } else {
      hashMap[elem.string] = {
        ...elem,
        frequency: elem.frequency,
      };
    }
  });

  const convertedUniqByFrequency = Object.entries(hashMap)
    .map((elem) => elem[1])
    .sort(function (a, b) {
      return a.frequency - b.frequency;
    });

  return convertedUniqByFrequency;
}

function parseCss(html, css) {
  const colors = findColors(html);
  const cssColors = findColors(css);
  const allCssColors = colors.concat(cssColors);
  const colorsOrderedByFreqs = freqConvert(allCssColors);

  return colorsOrderedByFreqs;
}

module.exports = {
  parseCss,
};