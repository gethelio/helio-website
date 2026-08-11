import { Fragment } from "react";
import type { Distribution } from "@/lib/incidents";

/**
 * The honest counter.
 *
 * Always computed from the data, never written down. The same figures appear in
 * the data repo's hand-maintained README, which is already out of step with its
 * own dataset — that is exactly the failure this component exists to avoid.
 *
 * Every verdict is shown, including any sitting at zero. A category that
 * disappears when empty makes the vocabulary look chosen after the fact, and
 * the whole point of publishing the breakdown is that it was not.
 */
export default function DistributionCounter({
  distribution,
}: {
  distribution: Distribution;
}) {
  return (
    <p className="text-lg text-gray-700 dark:text-gray-300">
      Of{" "}
      <span className="font-semibold text-gray-900 dark:text-gray-100">
        {distribution.total} {distribution.total === 1 ? "entry" : "entries"}
      </span>
      , action governance would{" "}
      {distribution.byVerdict.map((entry, index) => (
        <Fragment key={entry.verdict}>
          {index > 0 && ", "}
          {entry.verdict.replace(/_/g, " ")}
          {index === 0 ? " have prevented " : " "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.count}</span>
        </Fragment>
      ))}
      .
    </p>
  );
}
