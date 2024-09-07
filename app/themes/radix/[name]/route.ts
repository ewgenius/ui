import {
  accentColors,
  colorsMap,
  getShadcnTheme,
  grayscaleColors,
} from "@/lib/colors";
import { NextResponse } from "next/server";

export const dynamicParams = true;

export async function generateStaticParams() {
  const params = [];

  for (const base of grayscaleColors) {
    for (const accent of accentColors) {
      params.push({
        name: `${base}-${accent.key}`,
      });
    }
  }

  return params;
}

export const GET = async (_: Request, params: { params: { name: string } }) => {
  const { name } = params.params;

  const [base, accent, primary, destructive] = name.split("-");

  if (!base || !accent) {
    return NextResponse.json({ error: "Invalid theme name" }, { status: 400 });
  }

  const baseColor = colorsMap[base];
  const accentColor = colorsMap[accent];

  if (!baseColor || !accentColor) {
    return NextResponse.json(
      { error: "Invalid base or accent color" },
      { status: 400 }
    );
  }

  const primaryColor = colorsMap[primary || "black"];
  const destructiveColor = colorsMap[destructive || "red"];

  if (!primaryColor || !destructiveColor) {
    return NextResponse.json(
      { error: "Invalid primary or destructive color" },
      { status: 400 }
    );
  }

  const light = getShadcnTheme(
    baseColor,
    accentColor,
    primaryColor,
    destructiveColor,
    false,
    false
  );

  const dark = getShadcnTheme(
    baseColor,
    accentColor,
    primaryColor,
    destructiveColor,
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
