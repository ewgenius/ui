import * as radix from "@radix-ui/colors";
import * as d3 from "d3-color";

export interface RadixColor {
  [key: string]: string;
}

export interface ColorShade {
  key: string;
  label?: string;
  grayscale?: boolean;
  accent?: boolean;
  darkForeground?: boolean;
  paletteLight: RadixColor;
  paletteDark: RadixColor;
}

export const grayscaleColors = [
  "gray",
  "mauve",
  "slate",
  "sage",
  "olive",
  "sand",
];

const mauveAccents = [
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
];
const slateAccents = ["iris", "indigo", "blue", "sky", "cyan"];
const sageAccents = ["mint", "teal", "jade", "green"];
const oliveAccents = ["grass", "lime"];
const sandAccents = ["yellow", "amber", "orange", "brown"];

export const recommendedAccentColors: Record<string, string[]> = {
  mauve: mauveAccents,
  slate: slateAccents,
  sage: sageAccents,
  olive: oliveAccents,
  sand: sandAccents,
};

export const recommendedDestructiveColors = [
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
];

const radixColors: Record<string, ColorShade> = Object.entries(radix)
  .filter(
    ([key]) =>
      !(
        key.endsWith("Dark") ||
        key.endsWith("A") ||
        key.endsWith("P3") ||
        key.endsWith("P3A")
      )
  )
  .reduce<Record<string, ColorShade>>((acc, [key, lightColor]) => {
    const darkColor = radix[`${key}Dark` as keyof typeof radix];

    const darkForeground = ["sky", "mint", "lime", "yellow", "amber"].includes(
      key
    );

    const grayscale = grayscaleColors.includes(key);

    return {
      ...acc,
      [key]: {
        key,
        grayscale: grayscale,
        accent: !grayscale,
        darkForeground,
        paletteLight: {
          ...lightColor,
          [`${key}13`]: darkForeground
            ? (lightColor as RadixColor)[`${key}12`]
            : "#FFFFFF",
        },

        paletteDark: {
          ...darkColor,
          [`${key}13`]: darkForeground
            ? (lightColor as RadixColor)[`${key}12`]
            : "#FFFFFF",
        },
      },
    };
  }, {});

export const colorsMap: Record<string, ColorShade> = {
  black: {
    key: "black",
    label: "black / white",
    paletteLight: {
      black1: "#000000",
      black2: "#000000",
      black3: "#000000",
      black4: "#000000",
      black5: "#000000",
      black6: "#000000",
      black7: "#000000",
      black8: "#000000",
      black9: "#000000",
      black10: "#000000",
      black11: "#000000",
      black12: "#000000",
      black13: "#FFFFFF",
    },
    paletteDark: {
      black1: "#000000",
      black2: "#000000",
      black3: "#000000",
      black4: "#000000",
      black5: "#000000",
      black6: "#000000",
      black7: "#000000",
      black8: "#000000",
      black9: "#FFFFFF",
      black10: "#FFFFFF",
      black11: "#FFFFFF",
      black12: "#FFFFFF",
      black13: "#000000",
    },
  },

  ...radixColors,
};

export const allColors = Object.values(colorsMap);

export const grayColors = allColors.filter(({ grayscale }) => grayscale);

export const accentColors = allColors.filter(({ accent }) => accent);

export function getHSLValue(hex: string): string {
  return d3.color(hex)!.formatHsl().slice(4, -1).replaceAll(",", "");
}

export function expandColorSwatch(
  name: string,
  color: ColorShade,
  darkMode = false
): Record<string, string> {
  return Array.from({ length: 12 }, (_, i) => i + 1).reduce<
    Record<string, string>
  >(
    (acc, i) => ({
      ...acc,
      [`--${name}-${i}`]: getHSLValue(
        (darkMode ? color.paletteDark : color.paletteLight)[`${color.key}${i}`]
      ),
    }),
    {}
  );
}

export function getShadcnTheme(
  base: ColorShade,
  accent: ColorShade,
  primary: ColorShade,
  destructive: ColorShade,
  darkMode: boolean
) {
  const basePalette = darkMode ? base.paletteDark : base.paletteLight;
  const accentPalette = darkMode ? accent.paletteDark : accent.paletteLight;
  const primaryPalette = darkMode ? primary.paletteDark : primary.paletteLight;
  const destructivePalette = darkMode
    ? destructive.paletteDark
    : destructive.paletteLight;

  const theme = {
    ...expandColorSwatch("base", base, darkMode),

    ...expandColorSwatch("accent", accent, darkMode),

    "--background": getHSLValue(basePalette[`${base.key}1`]),
    "--foreground": getHSLValue(basePalette[`${base.key}12`]),

    "--card": getHSLValue(basePalette[`${base.key}2`]),
    "--card-foreground": getHSLValue(basePalette[`${base.key}12`]),

    "--popover": getHSLValue(basePalette[`${base.key}1`]),
    "--popover-foreground": getHSLValue(basePalette[`${base.key}12`]),

    "--primary": getHSLValue(primaryPalette[`${primary.key}10`]),
    "--primary-foreground": getHSLValue(primaryPalette[`${primary.key}13`]),

    "--secondary": getHSLValue(basePalette[`${base.key}2`]),
    "--secondary-foreground": getHSLValue(basePalette[`${base.key}11`]),

    "--muted": getHSLValue(basePalette[`${base.key}2`]),
    "--muted-foreground": getHSLValue(basePalette[`${base.key}11`]),

    "--accent": getHSLValue(accentPalette[`${accent.key}10`]),
    "--accent-foreground": getHSLValue(accentPalette[`${accent.key}13`]),

    "--destructive": getHSLValue(destructivePalette[`${destructive.key}10`]),
    "--destructive-foreground": getHSLValue(
      destructivePalette[`${destructive.key}12`]
    ),

    "--border": getHSLValue(basePalette[`${base.key}6`]),
    "--input": getHSLValue(basePalette[`${base.key}6`]),
    "--ring": getHSLValue(basePalette[`${base.key}6`]),

    "--radius": "0.5rem",
  };

  return theme;
}
