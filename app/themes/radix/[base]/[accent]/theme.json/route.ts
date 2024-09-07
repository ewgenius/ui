import {
  accentColors,
  colorsMap,
  getShadcnTheme,
  grayscaleColors,
} from "@/lib/colors";
import { NextResponse } from "next/server";

export async function generateStaticParams() {
  const params = [];

  for (const base of grayscaleColors) {
    for (const accent of accentColors) {
      params.push({
        base: base,
        accent: accent,
      });
    }
  }

  console.log(params);

  return params;
}

export const GET = async (
  _: Request,
  params: { params: { base: string; accent: string } }
) => {
  const { base, accent } = params.params;

  const baseColor = colorsMap[base];
  const accentColor = colorsMap[accent];

  if (!baseColor || !accentColor) {
    return NextResponse.json(
      { error: "Invalid base or accent color" },
      { status: 400 }
    );
  }

  const primary = colorsMap["black"];
  const destructive = colorsMap["red"];

  const light = getShadcnTheme(
    baseColor,
    accentColor,
    primary,
    destructive,
    false,
    false
  );

  const dark = getShadcnTheme(
    baseColor,
    accentColor,
    primary,
    destructive,
    true,
    false
  );

  return NextResponse.json({
    name: `theme-radix-${base}-${accent}`,
    type: "registry:theme",
    cssVars: {
      light,
      dark,
    },
  });
};
