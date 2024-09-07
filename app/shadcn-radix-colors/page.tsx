import { Suspense } from "react";
import { ThemeGenerator } from "./theme-generator";

export default function ThemeGeneratorPage() {
  return (
    <Suspense>
      <ThemeGenerator />
    </Suspense>
  );
}
