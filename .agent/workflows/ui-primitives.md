---
description: UI primitives and design system for consistent component generation
---

# UI Primitives Workflow

This workflow defines the **design system and UI primitives** for the Domain Registrar Panel dashboard. Always reference this when creating new components or pages to ensure consistency.

---

## 1. Color Palette

### Base Colors (Zinc Scale)

- **Background**: `bg-white` (cards), `bg-zinc-50` (subtle sections, footers)
- **Text Primary**: `text-zinc-900` (headings, values)
- **Text Secondary**: `text-zinc-600` / `text-zinc-500` (descriptions, labels)
- **Text Muted**: `text-zinc-400` (metadata, timestamps)
- **Borders**: `border-zinc-200` (default), `border-zinc-300` (hover), `border-black/5` (subtle)

### Accent Colors

| Purpose   | Color  | Example Class                         |
| --------- | ------ | ------------------------------------- |
| Primary   | Purple | `text-purple-600`, `bg-purple-500/10` |
| Success   | Green  | `text-green-600`, `bg-green-500/10`   |
| Warning   | Amber  | `text-amber-600`, `bg-amber-500/10`   |
| Danger    | Red    | `text-red-600`, `bg-red-500/10`       |
| Info      | Blue   | `text-blue-600`, `bg-blue-500/10`     |
| Highlight | Orange | `text-orange-600`, `bg-orange-500/10` |

### Status Badge Colors

```tsx
// Running/Active
"bg-green-50 text-green-700 border-green-200";

// Warning
"bg-amber-50 text-amber-700 border-amber-200";

// Idle/Neutral
"bg-zinc-100 text-zinc-500 border-zinc-200";

// Error/Danger
"bg-red-50 text-red-700 border-red-200";
```

---

## 2. Typography

### Headings

- **Card Title**: `text-xl font-bold tracking-tight text-zinc-900`
- **Section Title**: `text-sm font-bold text-zinc-900`

### Labels

- **Uppercase Label**: `text-[10px] font-bold uppercase tracking-widest text-zinc-500`
- **Card Description**: `text-xs uppercase tracking-widest font-semibold text-purple-600/80`

### Data/Values

- **Large Number**: `text-4xl font-black tracking-tighter text-zinc-900`
- **Metric Value**: `font-mono text-xs font-medium text-zinc-600`
- **Monospace Data**: `font-mono text-sm font-black tracking-tighter`

### Micro Text

- **Footer/Meta**: `text-[9px] font-mono text-zinc-400 uppercase`
- **Tiny Label**: `text-[8px] font-bold uppercase tracking-widest`

---

## 3. Card Component Pattern

### Standard Dashboard Card

```tsx
<Card className="border-2 border-zinc-200 bg-white overflow-hidden relative group transition-all duration-500 hover:border-zinc-300">
  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-black/5 bg-white">
    <div>
      <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
        <Icon className="h-5 w-5 text-purple-600" />
        Title Here
      </CardTitle>
      <CardDescription className="text-xs uppercase tracking-widest font-semibold text-purple-600/80">
        Subtitle Here
      </CardDescription>
    </div>
    {/* Optional badge/action */}
  </CardHeader>

  <CardContent className="p-6">{/* Content */}</CardContent>

  {/* Optional Footer */}
  <div className="p-3 border-t border-black/5 bg-zinc-50 flex items-center justify-between text-[9px] font-mono text-zinc-400">
    <span>STATUS_TEXT</span>
    <span>META_INFO</span>
  </div>
</Card>
```

### Key Card Rules

- **Border**: Always `border-2 border-zinc-200`
- **Background**: `bg-white`
- **Hover**: `hover:border-zinc-300`
- **NO shadows**: Avoid `shadow-*` classes
- **Border radius**: Uses default `rounded-xl` from Card component

---

## 4. Grid System

### Dashboard Layout

```tsx
// Main spacing
<div className="space-y-6">

// Two-column layout
<div className="flex flex-col lg:flex-row gap-6 items-stretch">

// Four-column KPI grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
```

### Table Grid (14-Column System)

```tsx
// Header
<div className="hidden md:grid grid-cols-[repeat(14,minmax(0,1fr))] gap-4 px-6 py-3">

// Row
<div className="grid grid-cols-1 md:grid-cols-[repeat(14,minmax(0,1fr))] gap-4 px-6 py-4">

// Column spans must sum to 14
// Allocate based on content width needs
```

---

## 5. Icon Patterns

### Icon Container (Card Header)

```tsx
<div className="p-2.5 rounded-xl border bg-purple-500/10 text-purple-600 border-purple-500/20">
  <Icon className="h-5 w-5" />
</div>
```

### Icon in Row

```tsx
<div className="p-2 rounded-lg bg-white border border-zinc-100">
  <Icon className="h-4 w-4 text-zinc-600" />
</div>
```

---

## 6. Status Indicators

### Live Badge

```tsx
<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
  <span className="text-[10px] font-bold text-green-600">LIVE</span>
</div>
```

### Status Pill

```tsx
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-green-50 text-green-700 border-green-200">
  <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
  RUNNING
</div>
```

---

## 7. Animation Patterns

### Entry Animation

```tsx
className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
style={{ animationDelay: `${i * 100}ms` }}
```

### Hover Transitions

```tsx
className = "transition-all duration-300";
className = "transition-colors duration-200";
className = "transition-opacity";
```

### Opacity on Hover

```tsx
className = "opacity-50 group-hover/row:opacity-100 transition-opacity";
```

---

## 8. Spacing Standards

| Context             | Class              |
| ------------------- | ------------------ |
| Card padding        | `p-6`              |
| Card header padding | `pb-2` or `pb-4`   |
| Section gaps        | `space-y-6`        |
| Grid gaps           | `gap-4` or `gap-6` |
| Inline gaps         | `gap-2`, `gap-3`   |
| Table row padding   | `px-6 py-4`        |

---

## 9. Decorative Elements

### Grid Pattern Background

```tsx
<div
  className="absolute inset-0 opacity-[0.03] pointer-events-none"
  style={{
    backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
    backgroundSize: "24px 24px",
  }}
/>
```

### Progress Bar (Tech Style)

```tsx
<div className="flex gap-1 h-1 w-full opacity-60">
  {Array.from({ length: 12 }).map((_, idx) => (
    <div
      key={idx}
      className={cn(
        "flex-1 rounded-full transition-all duration-500",
        idx < activeCount
          ? "bg-orange-500/40 group-hover:bg-orange-500"
          : "bg-black/5",
      )}
      style={{ transitionDelay: `${idx * 50}ms` }}
    />
  ))}
</div>
```

---

## 10. Component Imports

Always import from these paths:

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
```

Icons from Lucide:

```tsx
import { Activity, Globe, Shield, Clock, AlertTriangle, ... } from "lucide-react";
```

---

## Checklist Before Creating New Components

- [ ] Use `border-2 border-zinc-200` for cards (no shadows)
- [ ] Use `text-zinc-900` for primary text
- [ ] Use `font-mono` for data values
- [ ] Use `uppercase tracking-widest` for labels
- [ ] Accent colors: purple (primary), orange (highlight), green/amber/red (status)
- [ ] Entry animations with staggered delays
- [ ] 14-column grid for tables
- [ ] Footer with `bg-zinc-50 border-t border-black/5`
