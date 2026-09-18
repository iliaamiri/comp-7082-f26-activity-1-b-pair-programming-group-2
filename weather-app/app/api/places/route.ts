import { NextRequest, NextResponse } from "next/server";
import type {CitySuggestion, PlacesResponse} from "@/lib/types";

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:autocomplete";

const FIELD_MASK = "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2 || query.length > 60) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error(`No GOOGLE_MAPS_API_KEY provided to fulfill the auto-complete city search feature`);
    return NextResponse.json({ suggestions: [] });
  }

  let res: Response;
  try {
    res = await fetch(PLACES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        input: query,
        includedPrimaryTypes: ["(cities)"],
      }),
    });
  } catch (e) {
    console.error(`Failed to fetch from Google Maps API (Places New) to get search suggestions`, e);
    return NextResponse.json({ suggestions: [] });
  }

  if (!res.ok) {
    console.error(`Places autocomplete failed: ${res.status} ${await res.text()}`);
    return NextResponse.json({ suggestions: [] });
  }

  const body: PlacesResponse = await res.json();

  const suggestions: CitySuggestion[] = (body.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p) => p?.placeId && p.structuredFormat?.mainText?.text)
    .map((p) => ({
      placeId: p!.placeId!,
      city: p!.structuredFormat!.mainText!.text!,
      region: p!.structuredFormat?.secondaryText?.text ?? "",
      fullLocation: `${p!.structuredFormat!.mainText!.text!}${p!.structuredFormat?.secondaryText?.text ? `, ${p!.structuredFormat!.secondaryText!.text!}` : ""}`,
    })) as CitySuggestion[];

  return NextResponse.json({ suggestions });
}
