"use client";

import { useState } from "react";

type CellValue =
  | string
  | { text: string; sub?: string; check?: boolean; x?: boolean }
  | true
  | false;

interface Feature {
  name: string;
  values: CellValue[];
}

interface Category {
  name: string;
  id: string;
  features: Feature[];
}

const plans = [
  {
    name: "Helio",
    accent: true,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 text-blue-500"
      >
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
  {
    name: "Obot",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 text-gray-400"
      >
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
  {
    name: "Built-in (Anthropic / OpenAI)",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 text-gray-400"
      >
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
  {
    name: "Framework (LangChain / CrewAI)",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-4 w-4 text-gray-400"
      >
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
  },
];

const categories: Category[] = [
  {
    name: "Features",
    id: "features",
    features: [
      {
        name: "What it governs",
        values: [
          "Per-call actions, stateful across calls",
          "Which tools are reachable",
          "Agent permissions inside one platform",
          "Agent behavior inside one framework",
        ],
      },
      {
        name: "Governs agents you didn't build",
        values: [
          { text: "Any MCP agent", check: true },
          { text: "Any MCP agent", check: true },
          { text: "One platform only", x: true },
          { text: "One framework only", x: true },
        ],
      },
      {
        name: "No agent code changes",
        values: [
          { text: "Proxy in the path", check: true },
          { text: "Gateway in the path", check: true },
          { text: "Within platform", check: true },
          { text: "Integration required", x: true },
        ],
      },
      {
        name: "Evidence grounding",
        values: [{ text: "Cumulative", check: true }, false, false, "Limited"],
      },
      {
        name: "Open source",
        values: [
          { text: "Apache 2.0", check: true },
          { text: "Apache 2.0", check: true },
          false,
          "Varies",
        ],
      },
    ],
  },
];

const GRID_COLS = "grid-cols-[1fr_repeat(4,1fr)]";

function Check() {
  return (
    <svg
      className="h-4 w-4 text-emerald-500"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
}

function XMark() {
  return (
    <svg
      className="h-4 w-4 text-gray-300 dark:text-gray-600"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4L4 12M4 4l8 8" />
    </svg>
  );
}

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <Check />;
  if (value === false) return <XMark />;
  if (typeof value === "string")
    return (
      <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
    );
  return (
    <div className="flex items-center gap-1.5">
      {value.check && <Check />}
      {value.x && <XMark />}
      <div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value.text}
        </span>
        {value.sub && (
          <span className="block text-xs text-gray-400 dark:text-gray-500">
            {value.sub}
          </span>
        )}
      </div>
    </div>
  );
}

function CrossMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute z-10 flex h-[9px] w-[9px] items-center justify-center ${className}`}
    >
      <div className="absolute h-px w-[9px] bg-gray-400 dark:bg-gray-600" />
      <div className="absolute h-[9px] w-px bg-gray-400 dark:bg-gray-600" />
    </div>
  );
}

export default function ComparisonTable() {
  const [activePlan, setActivePlan] = useState(0);

  return (
    <section id="comparison">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How Helio compares
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Most governance is locked to one platform, one framework, or only
              controls which tools an agent can reach. Helio governs every tool
              call across any MCP agent without any code changes.
            </p>
          </div>

          {/* =========== DESKTOP TABLE =========== */}
          <div className="hidden lg:block">
            {/* Plan header cards */}
            <div className={`grid ${GRID_COLS}`}>
              <div />
              {plans.map((plan, i) => (
                <div key={plan.name} className="relative">
                  <CrossMark className="-left-[4.5px] -top-[4.5px]" />
                  {i === plans.length - 1 && (
                    <CrossMark className="-right-[4.5px] -top-[4.5px]" />
                  )}
                  <CrossMark className="-bottom-[4.5px] -left-[4.5px]" />
                  {i === plans.length - 1 && (
                    <CrossMark className="-bottom-[4.5px] -right-[4.5px]" />
                  )}

                  <div
                    className={`flex h-full flex-col border border-gray-300 bg-white px-5 py-5 dark:border-gray-700 dark:bg-gray-800 ${
                      plan.accent
                        ? "border-t-[2px] border-t-blue-500"
                        : "border-t border-t-gray-300 dark:border-t-gray-700"
                    } ${i === 0 ? "rounded-tl-lg" : ""} ${i === plans.length - 1 ? "rounded-tr-lg" : ""}`}
                  >
                    <div className="mb-3">{plan.icon}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {plan.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category sections */}
            {categories.map((category) => (
              <div key={category.id} id={`cat-${category.id}`}>
                {/* Category header with crossmarks */}
                <div className={`relative grid ${GRID_COLS}`}>
                  <div className="py-5 pr-4">
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                      {category.name}
                    </span>
                  </div>
                  {plans.map((plan, i) => (
                    <div
                      key={plan.name}
                      className="relative border-l border-gray-300 py-5 dark:border-gray-700"
                    >
                      <CrossMark className="-left-[4.5px] -top-[4.5px]" />
                      {i === plans.length - 1 && (
                        <CrossMark className="-right-[4.5px] -top-[4.5px]" />
                      )}
                      <CrossMark className="-bottom-[4.5px] -left-[4.5px]" />
                      {i === plans.length - 1 && (
                        <CrossMark className="-bottom-[4.5px] -right-[4.5px]" />
                      )}
                      {i === plans.length - 1 && (
                        <div className="absolute right-0 top-0 h-full w-px bg-gray-300 dark:bg-gray-700" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Feature rows */}
                {category.features.map((feature) => (
                  <div
                    key={feature.name}
                    className={`relative grid ${GRID_COLS} border-t border-gray-200 dark:border-gray-700`}
                  >
                    <div className="flex items-center py-3.5 pr-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.name}
                      </span>
                    </div>
                    {feature.values.map((val, i) => (
                      <div
                        key={i}
                        className="flex items-center border-l border-gray-300 py-3.5 pl-5 dark:border-gray-700"
                      >
                        <CellDisplay value={val} />
                        {i === plans.length - 1 && (
                          <div className="absolute right-0 top-0 h-full w-px bg-gray-300 dark:bg-gray-700" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Bottom crossmarks row */}
            <div className={`relative grid ${GRID_COLS}`}>
              <div />
              {plans.map((plan, i) => (
                <div key={plan.name} className="relative h-0">
                  <CrossMark className="-left-[4.5px] -top-[4.5px]" />
                  {i === plans.length - 1 && (
                    <CrossMark className="-right-[4.5px] -top-[4.5px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* =========== MOBILE / TABLET LAYOUT =========== */}
          <div className="lg:hidden">
            {/* Plan selector tabs */}
            <div className="relative mb-8 flex overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
              {plans.map((plan, index) => (
                <button
                  key={plan.name}
                  onClick={() => setActivePlan(index)}
                  className={`min-w-0 flex-1 px-2 py-3 text-center transition-colors ${
                    activePlan === index
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "bg-white text-gray-400 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
                  } ${index > 0 ? "border-l border-gray-300 dark:border-gray-700" : ""}`}
                >
                  <span className="block truncate text-xs font-semibold">
                    {plan.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Active plan card */}
            <div
              className={`mb-8 rounded-lg border border-gray-300 px-5 py-5 dark:border-gray-700 dark:bg-gray-800 ${
                plans[activePlan].accent
                  ? "border-t-[2px] border-t-blue-500"
                  : ""
              }`}
            >
              <div className="mb-3">{plans[activePlan].icon}</div>
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {plans[activePlan].name}
              </div>
            </div>

            {/* Feature sections for active plan */}
            {categories.map((category) => (
              <div key={category.id} className="mb-6">
                <div className="mb-3 border-b border-gray-300 pb-2 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 dark:text-gray-500">
                    {category.name}
                  </h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.features.map((feature) => {
                    const val = feature.values[activePlan];
                    return (
                      <div
                        key={feature.name}
                        className="flex items-center justify-between py-3"
                      >
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {feature.name}
                        </span>
                        <div className="ml-4 flex items-center justify-end gap-1.5">
                          {val === true && <Check />}
                          {val === false && <XMark />}
                          {typeof val === "string" && (
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {val}
                            </span>
                          )}
                          {typeof val === "object" && val !== null && (
                            <>
                              {val.check && <Check />}
                              {val.x && <XMark />}
                              <div className="text-right">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {val.text}
                                </span>
                                {val.sub && (
                                  <span className="block text-xs text-gray-400 dark:text-gray-500">
                                    {val.sub}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
