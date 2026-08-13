import { Fragment } from "react";
import type { Distribution } from "@/lib/incidents";

/**
 * The honest counter.
 *
 * Always computed from the data, never written down.
 *
 * The same sentence is generated into the data repo's README by its
 * `scripts/build.mjs`, which was hand-maintained until August 2026 and drifted
 * from its own dataset more than once before it was automated.
 *
 * Those are two independent implementations of one format, in two languages,
 * in two repositories, with no shared code path — the README is static
 * markdown upstream, so there is nowhere to put a common formatter. They agree
 * because both were checked against each other, not because anything enforces
 * it. **Change the wording or the verdict ordering here and you have silently
 * desynchronised the log's front page**, and no test on either side will say
 * so. If you do, change `distributionSentence` and `VERDICT_ORDER` in
 * `gethelio/agent-incident-log` in the same breath.
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
