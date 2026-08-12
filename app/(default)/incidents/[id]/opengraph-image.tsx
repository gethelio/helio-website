import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getIncident, getIncidents } from "@/lib/incidents";

/**
 * Social card for an incident entry.
 *
 * Mirrors the hand-made blog cards in `public/blog/og/` — logo, blue eyebrow,
 * headline, rule, attribution — so a shared incident sits in the same visual
 * family as a shared post. The grid texture and glow of those PNGs are
 * approximated with gradients rather than reproduced: Satori has no repeating
 * gradients, and this is close enough that the two read as a set.
 *
 * Deliberately carries no `prevented_by_action_governance` value. In aggregate
 * that field is the log's most honest number, but a single card travels without
 * the other six entries, and "Likely" alone reads as a product claim rather than
 * a finding.
 *
 * Inherits `generateStaticParams` from the route, so every entry's card is
 * generated at build. One added between builds generates on demand, matching how
 * the pages themselves behave.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Agent Incident Log entry";

/**
 * Read from disk rather than `fetch(new URL(…, import.meta.url))`.
 *
 * That is the pattern the next/og docs give, and under Turbopack it rewrites to
 * a bare path — `/_next/static/media/Geist-Medium.<hash>.ttf` — which `fetch`
 * cannot parse as a URL. It fails at render, not at compile: the build still
 * exits 0 and every card ships broken.
 */
const FONT_DIR = join(process.cwd(), "app", "(default)", "incidents", "[id]");

const fonts = Promise.all([
  readFile(join(FONT_DIR, "Geist-Medium.ttf")),
  readFile(join(FONT_DIR, "Geist-Bold.ttf")),
]);

/**
 * Prerenders one card per entry at build time. Without this the route is `ƒ` and
 * every card is rendered on demand — which works, but means a crawler's first
 * request pays for Satori and a font parse.
 */
export async function generateStaticParams() {
  const incidents = await getIncidents();
  return incidents.map((incident) => ({ id: incident.id }));
}

/**
 * Titles in the log run from 68 to 92 characters and are not length-capped by
 * the schema, so the headline size is derived rather than fixed. Without this
 * the longest entries overflow the card instead of wrapping.
 */
function headlineSize(title: string): number {
  if (title.length <= 55) return 66;
  if (title.length <= 75) return 58;
  if (title.length <= 95) return 50;
  return 44;
}

const NAVY = "#0a1120";
const BLUE = "#60a5fa";

function HelioMark() {
  return (
    // Taken from components/ui/logo.tsx. The clipPath there is dropped: it
    // bounds a rect the paths already sit inside, and Satori's SVG support does
    // not extend to clip paths.
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#111929" />
      <g opacity="0.84">
        <path
          d="M19.1639 4.2114L16.7167 3.55566L14.6544 11.2523L12.7926 4.30373L10.3453 4.95946L12.3569 12.4669L7.34639 7.45637L5.55489 9.24787L11.0508 14.7438L4.20652 12.9099L3.55078 15.3571L11.029 17.3609C10.9434 16.9916 10.8981 16.6068 10.8981 16.2115C10.8981 13.413 13.1668 11.1443 15.9653 11.1443C18.7638 11.1443 21.0324 13.413 21.0324 16.2115C21.0324 16.6043 20.9877 16.9867 20.9031 17.3538L27.6995 19.1749L28.3552 16.7277L20.8472 14.7159L27.6919 12.8818L27.0362 10.4346L19.5285 12.4463L24.539 7.4358L22.7475 5.6443L17.3278 11.064L19.1639 4.2114Z"
          fill="white"
        />
        <path
          d="M20.896 17.3823C20.6861 18.2694 20.2432 19.0662 19.6354 19.7047L24.5591 24.6284L26.3506 22.8369L20.896 17.3823Z"
          fill="white"
        />
        <path
          d="M19.5857 19.7562C18.9706 20.3844 18.1932 20.8533 17.3215 21.0949L19.1131 27.7813L21.5603 27.1255L19.5857 19.7562Z"
          fill="white"
        />
        <path
          d="M17.2301 21.1194C16.8256 21.2233 16.4017 21.2786 15.9648 21.2786C15.4968 21.2786 15.0436 21.2151 14.6133 21.0963L12.8201 27.7889L15.2673 28.4446L17.2301 21.1194Z"
          fill="white"
        />
        <path
          d="M14.5268 21.0717C13.6684 20.8181 12.9048 20.3432 12.3023 19.7132L7.3665 24.649L9.158 26.4405L14.5268 21.0717Z"
          fill="white"
        />
        <path
          d="M12.2616 19.6695C11.6694 19.0355 11.238 18.2493 11.0326 17.3759L4.2141 19.2029L4.86983 21.6501L12.2616 19.6695Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await getIncident(id);

  // An unknown id still gets a card. The page 404s, but a crawler that reaches
  // this route should not receive a broken image.
  const title = incident?.title ?? "Agent Incident Log";
  const attribution = incident?.organization ?? "A public reference log";

  const [mediumData, boldData] = await fonts;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "68px 80px",
          backgroundColor: NAVY,
          backgroundImage: `radial-gradient(circle at 12% -10%, rgba(59,130,246,0.22), transparent 46%), radial-gradient(circle at 96% 108%, rgba(37,99,235,0.18), transparent 42%)`,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <HelioMark />
          <span
            style={{
              marginLeft: 16,
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Helio
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 30, height: 2, backgroundColor: BLUE }} />
            <span
              style={{
                marginLeft: 16,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: 3.4,
                color: BLUE,
              }}
            >
              AGENT INCIDENT LOG
            </span>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: headlineSize(title),
              fontWeight: 700,
              lineHeight: 1.14,
              color: "#ffffff",
              // Satori has no line clamping, so an unexpectedly long title
              // wraps rather than being cut. The sizes above keep the longest
              // entry in the log to four lines.
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.14)",
              marginBottom: 30,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: BLUE,
                }}
              />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 25,
                  fontWeight: 500,
                  color: "#e5e7eb",
                }}
              >
                {attribution}
              </span>
            </div>
            <span style={{ fontSize: 23, fontWeight: 500, color: "#6b7280" }}>
              helio.so/incidents
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: mediumData, weight: 500, style: "normal" },
        { name: "Geist", data: boldData, weight: 700, style: "normal" },
      ],
    },
  );
}
