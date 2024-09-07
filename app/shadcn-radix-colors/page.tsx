import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeGenerator } from "./theme-generator";

export const metadata: Metadata = {
  title: "ewgenius/ui - shadcn-radix-colors",
  description:
    "Generate custom themes for shadcn/ui using vibrant palettes from Radix Colors with ease.",
};

export default function ThemeGeneratorPage() {
  return (
    <Suspense>
      <ThemeGenerator />
    </Suspense>
  );
}
