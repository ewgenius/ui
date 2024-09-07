"use client";

import { useMemo, useState, type CSSProperties, type FC } from "react";
import { Dashboard } from "@/components/preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  accentColors,
  allColors,
  colorsMap,
  getShadcnTheme,
  grayColors,
  grayscaleColors,
  recommendedAccentColors,
  recommendedDestructiveColors,
  type ColorShade,
} from "@/lib/colors";
import { Icons } from "@/components/icons";
import { CircleHelp, CirclePlus, Moon, Sun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [baseColor, setBaseColor] = useState("gray");
  const [accentColor, setAccentColor] = useState("blue");
  const [primaryColor, setPrimaryColor] = useState("black");
  const [destructiveColor, setDestructiveColor] = useState("red");

  const onDarkModeChange = (value: string) => {
    setTheme(value);
    setDarkMode(value === "dark");
  };

  const { lightTheme, darkTheme } = useMemo(() => {
    const lightTheme = getShadcnTheme(
      colorsMap[baseColor],
      colorsMap[primaryColor],
      colorsMap[accentColor],
      colorsMap[destructiveColor],
      false
    );
    const darkTheme = getShadcnTheme(
      colorsMap[baseColor],
      colorsMap[primaryColor],
      colorsMap[accentColor],
      colorsMap[destructiveColor],
      true
    );

    return {
      lightTheme,
      darkTheme,
    };
  }, [baseColor, accentColor, destructiveColor, primaryColor]);

  return (
    <div
      className="bg-background text-foreground flex flex-col md:flex-row md:h-screen overflow-hidden divide-x"
      style={
        {
          ...(darkMode ? darkTheme : lightTheme),
        } as CSSProperties
      }
    >
      <div className="md:w-96 shrink-0 flex flex-col h-full gap-4 p-4 overflow-x-hidden overflow-y-auto">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 text-foreground" />
          <CirclePlus className="h-4 text-foreground/60" />
          <Icons.radix className="h-6 text-foreground" />

          <div className="grow" />
          <Button variant="ghost" size="icon">
            <CircleHelp className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Appearance</label>
          <Tabs
            defaultValue="account"
            className="w-full"
            value={darkMode ? "dark" : "light"}
            onValueChange={onDarkModeChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="light">
                <Sun className="size-4 mr-2" />
                Light
              </TabsTrigger>
              <TabsTrigger value="dark">
                <Moon className="size-4 mr-2" />
                Dark
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Base Color</label>

          <ColorToggle
            value={baseColor}
            onChange={setBaseColor}
            colors={grayColors}
          />

          <ColorSelect
            value={baseColor}
            onChange={setBaseColor}
            colors={allColors}
            recommended={grayscaleColors}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Accent Color</label>

          {recommendedAccentColors[baseColor] ? (
            <ColorToggle
              value={accentColor}
              onChange={setAccentColor}
              colors={accentColors.filter((c) =>
                recommendedAccentColors[baseColor]?.includes(c.key)
              )}
            />
          ) : null}

          <ColorSelect
            value={accentColor}
            onChange={setAccentColor}
            colors={allColors}
            recommended={recommendedAccentColors[baseColor]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Primary Color</label>
          <ColorSelect
            value={primaryColor}
            onChange={setPrimaryColor}
            colors={allColors}
            recommended={["black"]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Destructive Color</label>

          <ColorToggle
            value={destructiveColor}
            onChange={setDestructiveColor}
            colors={accentColors.filter((c) =>
              recommendedDestructiveColors.includes(c.key)
            )}
          />

          <ColorSelect
            value={destructiveColor}
            onChange={setDestructiveColor}
            colors={accentColors}
            recommended={recommendedDestructiveColors}
          />
        </div>

        <pre className="min-h-96 text-xs font-mono border p-2 rounded-md overflow-auto bg-secondary">
          {`@layer base {
  :root {
${Object.entries(lightTheme)
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
  }
  .dark {
${Object.entries(darkTheme)
  .map(([key, value]) => `    ${key}: ${value};`)
  .join("\n")}
  }
}`}
        </pre>
      </div>

      <div className="md:h-screen p-8 flex flex-col bg-base-3">
        <div className="overflow-hidden rounded-lg border grow">
          <div className="relative shadow size-full overflow-auto flex flex-col bg-background text-foreground">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
  colors: ColorShade[];
  recommended?: string[] | null;
}

const ColorSelect: FC<ColorSelectProps> = ({
  value,
  onChange,
  recommended,
  colors,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {recommended ? (
          <SelectGroup>
            <SelectLabel>Recommended</SelectLabel>

            {recommended.map((k) => {
              const color = colorsMap[k];
              return <ColorItem key={color.key} color={color} />;
            })}
          </SelectGroup>
        ) : null}

        <SelectGroup>
          <SelectLabel>All</SelectLabel>

          {colors
            .filter((c) => !recommended?.includes(c.key))
            .map((color) => (
              <ColorItem key={color.key} color={color} />
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const ColorItem: FC<{ color: ColorShade }> = ({ color }) => (
  <SelectItem key={color.key} value={color.key}>
    <div className="flex items-center gap-2">
      <div
        className="size-5 rounded-sm"
        style={{
          backgroundColor: color.paletteDark[`${color.key}10`],
          borderWidth: 1,
          borderColor: color.paletteDark[`${color.key}6`],
        }}
      />
      {color.label || color.key}
    </div>
  </SelectItem>
);

interface ColorToggleProps {
  value: string;
  onChange: (value: string) => void;
  colors: ColorShade[];
}

const ColorToggle: FC<ColorToggleProps> = ({ value, colors, onChange }) => {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      className="flex flex-wrap items-start justify-start gap-2 py-1"
    >
      {colors.map((color) => (
        <ToggleGroupItem
          key={color.key}
          value={color.key}
          className="p-0.5 rounded-full data-[state=on]:ring-2 ring-offset-0 ring-accent"
        >
          <div
            className="size-4 rounded-full"
            style={{
              backgroundColor: color.paletteDark[`${color.key}10`],
              borderWidth: 1,
              borderColor: color.paletteDark[`${color.key}6`],
            }}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
