"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WeatherSearch({
  onSearch,
  isLoading,
}: {
  onSearch: (city: string) => void;
  isLoading: boolean;
}) {
  const [city, setCity] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = city.trim();
        if (trimmed) onSearch(trimmed);
      }}
      className="flex w-full gap-2"
    >
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Try Vancouver, Tokyo, Berlin..."
        aria-label="City name"
        className="h-11"
      />
      <Button type="submit" disabled={isLoading} className="h-11 px-5">
        <Search className="size-4" />
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
