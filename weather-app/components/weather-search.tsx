"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { CitySuggestion } from "@/lib/types";
import { cn } from "cn";

export function WeatherSearch({
  onSearch,
  isLoading,
}: {
  onSearch: (city: string) => void;
  isLoading: boolean;
}) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const debouncedCity = useDebouncedValue(city);
  const listboxId = useId();

  const visible = city.trim().length >= 2 ? suggestions : [];
  const showList = isOpen && visible.length > 0;

  const justSelected = useRef<string | null>(null);

  useEffect(() => {
    const query = debouncedCity.trim();

    if (query === justSelected.current) return;
    justSelected.current = null;

    if (query.length < 2) return;

    const controller = new AbortController();

    fetch(`/api/places?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : { suggestions: [] }))
      .then((body: { suggestions: CitySuggestion[] }) => {
        setSuggestions(body.suggestions);
        setIsOpen(body.suggestions.length > 0);
        setHighlighted(-1);
      })
      .catch(() => {
        // Aborted or offline - leave whatever is on screen alone.
      });

    return () => controller.abort();
  }, [debouncedCity]);

  function select(suggestion: CitySuggestion) {
    justSelected.current = suggestion.city;
    setCity(suggestion.city);
    setSuggestions([]);
    setIsOpen(false);
    setHighlighted(-1);
    onSearch(suggestion.city);
  }

  function submit() {
    const trimmed = city.trim();
    if (trimmed) {
      setIsOpen(false);
      onSearch(trimmed);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % visible.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? visible.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      select(visible[highlighted]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlighted(-1);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex w-full gap-2"
    >
      <div className="relative flex-1">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder="Try Vancouver, Tokyo, Berlin..."
          aria-label="City name"
          className="h-11"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlighted >= 0 ? `${listboxId}-${highlighted}` : undefined
          }
          autoComplete="off"
        />

        {showList && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-lg border border-input bg-popover shadow-md"
          >
            {visible.map((suggestion, i) => (
              <li
                key={suggestion.placeId}
                id={`${listboxId}-${i}`}
                role="option"
                aria-selected={i === highlighted}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => select(suggestion)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                  i === highlighted && "bg-accent"
                )}
              >
                <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {suggestion.city}
                  {suggestion.region && (
                    <span className="text-muted-foreground">
                      {" "}
                      {suggestion.region}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="h-11 px-5">
        <Search className="size-4" />
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
