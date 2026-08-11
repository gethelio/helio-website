"use client";

import type { Facets } from "@/lib/incidents";
import {
  FILTER_DIMENSIONS,
  type ActiveFilters,
  type FilterOption,
} from "@/lib/incident-filters";
import { humanizeValue } from "@/lib/incident-format";

/**
 * Facet controls.
 *
 * Nine dimensions is too many for the chip row `blog-list.tsx` uses for its one
 * category axis, so these are native selects in a grid — compact, keyboard
 * accessible without any work, and honest that each dimension takes a single
 * value.
 */
export default function IncidentFilters({
  facets,
  active,
  onChange,
  onClear,
}: {
  facets: Facets;
  active: ActiveFilters;
  onChange: (param: string, value: string) => void;
  onClear: () => void;
}) {
  const activeCount = Object.keys(active).length;

  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Filter entries</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-sm font-medium text-blue-500 transition-colors hover:text-blue-600"
          >
            Clear {activeCount === 1 ? "filter" : "all filters"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FILTER_DIMENSIONS.map((dimension) => {
          const value = active[dimension.param] ?? "";
          const options = withCurrentValue(dimension.options(facets), value);

          return (
            <label key={dimension.param} className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                {dimension.label}
              </span>
              <select
                value={value}
                onChange={(event) =>
                  onChange(dimension.param, event.target.value)
                }
                className="w-full cursor-pointer rounded border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Any</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Keeps a value that arrived in the URL selectable even when the data no longer
 * contains it. Shared links outlive the dataset: an entry gets re-classified,
 * and a link filtering on the old value would otherwise render a select that
 * looks blank while the results below sit empty with no explanation.
 */
function withCurrentValue(
  options: FilterOption[],
  value: string,
): FilterOption[] {
  if (!value || options.some((option) => option.value === value)) return options;
  return options.concat({
    value,
    label: `${humanizeValue(value)} (not in current data)`,
  });
}
