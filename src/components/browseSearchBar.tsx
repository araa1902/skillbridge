// MarketplaceSearchBar.tsx
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    Check,
    CaretUpDown,
    MagnifyingGlassIcon,
    XIcon,
    SlidersHorizontalIcon,
    BriefcaseIcon,
    ClockIcon,
    CurrencyGbpIcon,
    TagIcon,
} from "@phosphor-icons/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";

interface MarketplaceSearchBarProps {
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    skillFilter: string;
    setSkillFilter: (v: string) => void;
    durationFilter: string;
    setDurationFilter: (v: string) => void;
    budgetFilter: string;
    setBudgetFilter: (v: string) => void;
    categoryFilter: string;
    setCategoryFilter: (v: string) => void;
    allSkills: string[];
    hasActiveFilters: boolean;
    clearFilters: () => void;
    activeFilterCount?: number;
}

const DURATION_OPTIONS = [
    { value: "all", label: "Any duration" },
    { value: "short", label: "Sprint (≤10 hrs)" },
    { value: "medium", label: "Standard (11–20 hrs)" },
    { value: "long", label: "Extended (>20 hrs)" },
];

const BUDGET_OPTIONS = [
    { value: "all", label: "Any budget" },
    { value: "0-500", label: "Up to £500" },
    { value: "500-1000", label: "£500 – £1,000" },
    { value: "1000+", label: "£1,000+" },
];

const CATEGORY_OPTIONS = [
    { value: "all", label: "Any category" },
    { value: "Engineering & Dev", label: "Engineering & Dev" },
    { value: "Creative & Design", label: "Creative & Design" },
    { value: "Marketing & Sales", label: "Marketing & Sales" },
    { value: "Business & Strategy", label: "Business & Strategy" },
    { value: "Content & Copy", label: "Content & Copy" },
    { value: "Data & AI", label: "Data & AI" },
];

// ── Filter Pill ──────────────────────────────────────────────────────────────
// Fixed: min-w so label never clips; sentence case; no focus rectangle
function FilterPill({
    icon: Icon,
    label,
    value,
    options,
    onChange,
    active,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    active: boolean;
}) {
    const selected = options.find((o) => o.value === value);

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                // KEY FIXES:
                // 1. min-w-[140px] prevents label clipping
                // 2. focus:ring-0 focus:outline-none removes the focus rectangle
                // 3. [&>span]:flex [&>span]:items-center [&>span]:gap-2 fixes inner layout
                className={cn(
                    "h-11 px-4 rounded-full border text-sm font-medium transition-all duration-200",
                    "bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer",
                    "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
                    "[&>span]:flex [&>span]:items-center [&>span]:gap-2 min-w-[140px]",
                    active
                        ? "border-gray-900 text-gray-900 shadow-sm"
                        : "border-gray-300 text-gray-600"
                )}
            >
                <Icon className="w-4 h-4 shrink-0 text-gray-500" weight="regular" />
                <span className="text-gray-500 font-normal">{label}</span>
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-gray-200 p-1 min-w-[180px]">
                {options.map((o) => (
                    <SelectItem
                        key={o.value}
                        value={o.value}
                        className="rounded-xl text-sm py-2.5 px-3 cursor-pointer"
                    >
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

// ── Searchable Filter Pill (for Skills) ──────────────────────────────────────
function SearchableFilterPill({
    icon: Icon,
    label,
    value,
    options,
    onChange,
    active,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    active: boolean;
}) {
    const [open, setOpen] = useState(false);
    const displayLabel = value === "all" ? label : options.find((o) => o.value === value)?.label || label;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className={cn(
                    "h-11 px-4 rounded-full border text-sm font-medium transition-all duration-200",
                    "bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer flex items-center gap-2",
                    "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none min-w-[140px]",
                    active
                        ? "border-gray-900 text-gray-900 shadow-sm"
                        : "border-gray-300 text-gray-600"
                )}
            >
                <Icon className="w-4 h-4 shrink-0 text-gray-500" weight="regular" />
                <span className="text-gray-500 font-normal flex-1 text-left line-clamp-1">{displayLabel}</span>
                <CaretUpDown className="w-4 h-4 shrink-0 text-gray-400 opacity-50" />
            </PopoverTrigger>
            <PopoverContent side="bottom" className="w-[220px] p-0 rounded-2xl shadow-xl border-gray-200" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${label.toLowerCase()}s...`} className="h-10 text-sm" />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((o) => (
                                <CommandItem
                                    key={o.value}
                                    value={o.label}
                                    onSelect={() => {
                                        onChange(o.value);
                                        setOpen(false);
                                    }}
                                    className="rounded-xl text-sm py-2 px-3 cursor-pointer flex items-center justify-between"
                                >
                                    {o.label}
                                    <Check className={cn("ml-2 h-4 w-4", value === o.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function MarketplaceSearchBar({
    searchQuery,
    setSearchQuery,
    skillFilter,
    setSkillFilter,
    durationFilter,
    setDurationFilter,
    budgetFilter,
    setBudgetFilter,
    categoryFilter,
    setCategoryFilter,
    allSkills,
    hasActiveFilters,
    clearFilters,
    activeFilterCount = 0,
}: MarketplaceSearchBarProps) {
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const skillOptions = [
        { value: "all", label: "All skills" },
        ...allSkills.map((s) => ({ value: s, label: s })),
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* ── Desktop: fully centred row ───────────────────────────────── */}
                <div className="hidden lg:flex items-center justify-center gap-3 py-4">

                    {/* Search pill */}
                    <div
                        className={cn(
                            "flex items-center gap-2.5 w-full max-w-md h-11 px-4 rounded-full border",
                            "bg-white cursor-text transition-all duration-200",
                            inputFocused
                                ? "border-gray-900 shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                                : "border-gray-300 hover:border-gray-400 shadow-sm"
                        )}
                        onClick={() => inputRef.current?.focus()}
                    >
                        <MagnifyingGlassIcon
                            className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                inputFocused ? "text-gray-700" : "text-gray-400"
                            )}
                            weight="bold"
                        />
                        <Input
                            ref={inputRef}
                            placeholder="Search projects, companies, or skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            className={cn(
                                "border-0 shadow-none px-0 py-1.5 h-10 text-sm bg-transparent w-full",
                                "placeholder:text-gray-400/70",
                                "focus-visible:ring-0 focus-visible:outline-none focus:outline-none"
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery("");
                                    inputRef.current?.focus();
                                }}
                                className="shrink-0 rounded-full p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                aria-label="Clear search"
                            >
                                <XIcon className="w-3.5 h-3.5" weight="bold" />
                            </button>
                        )}
                    </div>

                    {/* Soft divider */}
                    <div className="h-6 w-px bg-gray-200 shrink-0" />

                    {/* Filter pills */}
                    <div className="flex items-center gap-2">
                        <SearchableFilterPill
                            icon={BriefcaseIcon}
                            label="Skill"
                            value={skillFilter}
                            options={skillOptions}
                            onChange={setSkillFilter}
                            active={skillFilter !== "all"}
                        />
                        {/* <FilterPill
                            icon={TagIcon}
                            label="Category"
                            value={categoryFilter}
                            options={CATEGORY_OPTIONS}
                            onChange={setCategoryFilter}
                            active={categoryFilter !== "all"}
                        /> */}
                        <FilterPill
                            icon={ClockIcon}
                            label="Duration"
                            value={durationFilter}
                            options={DURATION_OPTIONS}
                            onChange={setDurationFilter}
                            active={durationFilter !== "all"}
                        />
                        <FilterPill
                            icon={CurrencyGbpIcon}
                            label="Budget"
                            value={budgetFilter}
                            options={BUDGET_OPTIONS}
                            onChange={setBudgetFilter}
                            active={budgetFilter !== "all"}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium whitespace-nowrap p-2 flex items-center justify-center rounded-full hover:bg-gray-100"
                            aria-label="Clear all filters"
                        >
                            <XIcon className="w-4 h-4" weight="bold" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Active Filter Badges ── */}
            {hasActiveFilters && (
                <div className="hidden lg:flex items-center justify-center gap-2 pb-4 flex-wrap">
                    {skillFilter !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                            onClick={() => setSkillFilter("all")}
                        >
                            Skill: {skillFilter}
                            <XIcon className="w-3 h-3" weight="bold" />
                        </Badge>
                    )}
                    {durationFilter !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                            onClick={() => setDurationFilter("all")}
                        >
                            Duration: {DURATION_OPTIONS.find(o => o.value === durationFilter)?.label}
                            <XIcon className="w-3 h-3" weight="bold" />
                        </Badge>
                    )}
                    {budgetFilter !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                            onClick={() => setBudgetFilter("all")}
                        >
                            Budget: {BUDGET_OPTIONS.find(o => o.value === budgetFilter)?.label}
                            <XIcon className="w-3 h-3" weight="bold" />
                        </Badge>
                    )}
                    {categoryFilter !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
                            onClick={() => setCategoryFilter("all")}
                        >
                            Category: {categoryFilter}
                            <XIcon className="w-3 h-3" weight="bold" />
                        </Badge>
                    )}
                </div>
            )}

            {/* ── Mobile: search + filter icon ────────────────────────────── */}
            <div className="flex lg:hidden items-center gap-2 py-3">
                <div
                    className={cn(
                        "flex items-center gap-2.5 flex-1 h-11 px-3.5 rounded-full border bg-white transition-all",
                        inputFocused
                            ? "border-gray-900 shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                            : "border-gray-300 shadow-sm"
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" weight="bold" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        className="border-0 shadow-none p-0 h-auto text-sm bg-transparent focus-visible:ring-0 focus-visible:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                            className="shrink-0 text-gray-400 hover:text-gray-700"
                        >
                            <XIcon className="w-3.5 h-3.5" weight="bold" />
                        </button>
                    )}
                </div>

                {/* Filter sheet button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                                "h-11 w-11 rounded-full border shrink-0 relative transition-colors",
                                "focus-visible:ring-0 focus-visible:outline-none",
                                hasActiveFilters
                                    ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                            )}
                            aria-label="Open filters"
                        >
                            <SlidersHorizontalIcon className="w-4 h-4" weight="bold" />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8">
                        <SheetHeader className="mb-6 text-left">
                            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
                        </SheetHeader>

                        <div className="space-y-5">
                            {/* Skill */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                                    Skill
                                </label>
                                <Popover>
                                    <PopoverTrigger
                                        className="w-full flex items-center justify-between h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none"
                                    >
                                        <span className={skillFilter === "all" ? "text-gray-500" : "text-gray-900"}>
                                            {skillFilter === "all" ? "All skills" : skillFilter}
                                        </span>
                                        <CaretUpDown className="w-4 h-4 text-gray-400 opacity-50" />
                                    </PopoverTrigger>
                                    <PopoverContent side="bottom" className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-xl border-gray-200" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search skills..." className="h-10 text-sm" />
                                            <CommandList className="max-h-[250px]">
                                                <CommandEmpty>No skill found.</CommandEmpty>
                                                <CommandGroup>
                                                    {skillOptions.map((o) => (
                                                        <CommandItem
                                                            key={o.value}
                                                            value={o.label}
                                                            onSelect={() => { setSkillFilter(o.value); document.body.click(); }}
                                                            className="rounded-xl text-sm py-2 px-3 cursor-pointer flex items-center justify-between"
                                                        >
                                                            {o.label}
                                                            <Check className={cn("ml-2 h-4 w-4", skillFilter === o.value ? "opacity-100" : "opacity-0")} />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Category */}
                            <div className="hidden">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                                    Category
                                </label>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-0 focus:outline-none focus-visible:ring-0">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {CATEGORY_OPTIONS.map((o) => (
                                            <SelectItem key={o.value} value={o.value} className="py-2.5">
                                                {o.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                                    Duration
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DURATION_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                                        <button
                                            key={o.value}
                                            onClick={() =>
                                                setDurationFilter(durationFilter === o.value ? "all" : o.value)
                                            }
                                            className={cn(
                                                "h-11 rounded-xl border text-sm font-medium transition-colors px-3",
                                                durationFilter === o.value
                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                                    Budget
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {BUDGET_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                                        <button
                                            key={o.value}
                                            onClick={() =>
                                                setBudgetFilter(budgetFilter === o.value ? "all" : o.value)
                                            }
                                            className={cn(
                                                "h-11 rounded-xl border text-sm font-medium transition-colors px-3",
                                                budgetFilter === o.value
                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="mt-8 flex-row gap-3">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-semibold"
                                    onClick={clearFilters}
                                >
                                    Clear all
                                </Button>
                            )}
                            <SheetTrigger asChild>
                                <Button className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold">
                                    Show results
                                </Button>
                            </SheetTrigger>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

        </div>
    );
}
