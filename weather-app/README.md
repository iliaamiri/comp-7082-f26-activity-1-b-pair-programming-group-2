This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Where things stand (frontend done, backend + deployment left)

Frontend's built with shadcn/ui - search bar, current conditions card,
24h temp chart, 5-day forecast strip. All of it runs on fake data right
now so nobody's blocked. Run `bun dev` and check out `/demo` for a
pre-loaded view, or `/` to actually search (still fake data, any city
works).

**Backend - wiring up the real OpenWeatherMap calls:**

- Get a free key at https://openweathermap.org/api, drop it in
  `.env.local` as `OPENWEATHER_API_KEY` (see `.env.example`)
- Two routes to fill in, both already return the exact shape the real
  API sends back, so the frontend shouldn't need any changes:
  - `app/api/weather/route.ts` -> `GET /data/2.5/weather?q={city}&appid={key}&units=metric`
  - `app/api/forecast/route.ts` -> `GET /data/2.5/forecast?q={city}&appid={key}&units=metric`
- Both have a `TODO(backend)` comment at the top with the details.
  Should just be a `fetch` + return the JSON, maybe handle the
  city-not-found case (OWM returns `cod: "404"` for that)
- Both are free tier, no card needed

**Deployment:**

- Plain Next.js app, nothing unusual - `vercel deploy` should work
  as-is once it's linked to a project
- Just needs `OPENWEATHER_API_KEY` set as an env var on the Vercel
  project (Settings -> Environment Variables) once backend's done
- Probably worth doing a deploy now even with fake data, just to make
  sure the pipeline works before we're up against the deadline

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
