"use client";

import { useMemo, type CSSProperties, type FC } from "react";
import { useQueryState } from "nuqs";
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
import { CirclePlus, Copy, Moon, Sun, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Charts } from "@/components/preview/charts";
import { Dashboard } from "@/components/preview/dashboard";
import { useCopy } from "@/hooks/useCopy";

export function ThemeGenerator() {
  const { setTheme } = useTheme();
  const [mode, setMode] = useQueryState("mode", {
    defaultValue: "light",
  });
  const [baseColor, setBaseColor] = useQueryState("base", {
    defaultValue: "gray",
  });
  const [accentColor, setAccentColor] = useQueryState("accent", {
    defaultValue: "blue",
  });
  const [primaryColor, setPrimaryColor] = useQueryState("primary", {
    defaultValue: "black",
  });
  const [destructiveColor, setDestructiveColor] = useQueryState("destructive", {
    defaultValue: "red",
  });

  const onDarkModeChange = (value: string) => {
    setTheme(value);
    setMode(value === "dark" ? "dark" : "light");
  };

  const { lightTheme, darkTheme } = useMemo(() => {
    const lightTheme = getShadcnTheme(
      colorsMap[baseColor],
      colorsMap[accentColor],
      colorsMap[primaryColor],
      colorsMap[destructiveColor],
      false
    );
    const darkTheme = getShadcnTheme(
      colorsMap[baseColor],
      colorsMap[accentColor],
      colorsMap[primaryColor],
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
          ...(mode === "dark" ? darkTheme : lightTheme),
        } as CSSProperties
      }
    >
      <div className="md:w-[320px] shrink-0 flex flex-col h-full gap-4 p-4 overflow-x-hidden overflow-y-auto">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 text-foreground" />
          <CirclePlus className="h-4 text-foreground/60" />
          <Icons.radix className="h-6 text-foreground" />

          <div className="grow" />

          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/ewgenius/ui" target="_blank">
              <Icons.github className="size-4" />
            </a>
          </Button>
        </div>

        <div className="text-sm">
          Generate custom themes for{" "}
          <a href="https://ui.shadcn.com" className="underline" target="_blank">
            shadcn/ui
          </a>{" "}
          using vibrant palettes from{" "}
          <a
            href="https://www.radix-ui.com/colors"
            className="underline"
            target="_blank"
          >
            Radix Colors
          </a>{" "}
          with ease.
        </div>

        <hr className="border-t" />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Appearance</label>
          <Tabs
            defaultValue="account"
            className="w-full"
            value={mode === "dark" ? "dark" : "light"}
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
          <label className="text-sm text-muted-foreground">Base Color</label>

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
          <label className="text-sm text-muted-foreground">Accent Color</label>

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
          <label className="text-sm text-muted-foreground">Primary Color</label>
          <ColorSelect
            value={primaryColor}
            onChange={setPrimaryColor}
            colors={allColors}
            recommended={["black"]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">
            Destructive Color
          </label>

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

        <div className="grow" />

        <Dialog>
          <DialogTrigger asChild>
            <Button>Install</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl outline-none">
            <DialogHeader>
              <DialogTitle>Theme</DialogTitle>
              <DialogDescription>Use generated theme</DialogDescription>
            </DialogHeader>
            Copy and paste the following code into your CSS file.
            <ThemeCodePreview lightTheme={lightTheme} darkTheme={darkTheme} />
            Or install directly using shadcn cli:
            <ThemeInstallSnippet
              base={baseColor}
              accent={accentColor}
              primary={primaryColor}
              destructive={destructiveColor}
            />
          </DialogContent>
        </Dialog>

        <hr className="border-t" />

        <div className="text-xs text-muted-foreground">
          Built by{" "}
          <a
            href="https://github.com/ewgenius"
            target="_blank"
            className="underline"
          >
            @ewgenius
          </a>
          .
        </div>
      </div>

      <div className="md:h-screen p-8 flex flex-col gap-4 bg-base-2">
        <h2 className="text-xl font-semibold">Theme preview</h2>
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <div className="overflow-hidden rounded-lg border grow mt-2">
            <div className="relative shadow size-full overflow-auto flex flex-col bg-background text-foreground">
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>
              <TabsContent value="charts">
                <Charts />
              </TabsContent>
            </div>
          </div>
        </Tabs>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="size-4 rounded-full"
                style={{
                  backgroundColor: color.paletteDark[`${color.key}10`],
                  borderWidth: 1,
                  borderColor: color.paletteDark[`${color.key}6`],
                }}
              />
            </TooltipTrigger>
            <TooltipContent>{color.label || color.key}</TooltipContent>
          </Tooltip>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

const ThemeCodePreview: FC<{
  lightTheme: Record<string, string>;
  darkTheme: Record<string, string>;
}> = ({ lightTheme, darkTheme }) => {
  const { copied, copy } = useCopy();

  const code = `@layer base {
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
}`;

  return (
    <div className="relative w-full flex flex-col border rounded-md overflow-hidden group">
      <pre className="h-48 w-full text-sm font-mono p-2 overflow-auto bg-base-3">
        {code}
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 opacity-50 group-hover:opacity-100"
        onClick={() => copy(code)}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
};

interface ThemeInstallSnippetProps {
  base: string;
  accent: string;
  primary: string;
  destructive: string;
}

const ThemeInstallSnippet: FC<ThemeInstallSnippetProps> = ({
  base,
  accent,
  primary,
  destructive,
}) => {
  const { copied, copy } = useCopy();

  const code = `npx shadcn add https://ui.ewgenius.me/themes/radix/${base}-${accent}-${primary}-${destructive}`;

  return (
    <div className="relative w-full flex items-center overflow-hidden border bg-base-3 rounded-md group h-12">
      <pre className="w-full text-sm font-mono p-2 overflow-auto">{code}</pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 opacity-50 group-hover:opacity-100"
        onClick={() => copy(code)}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
};
