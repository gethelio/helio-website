import type { ReactNode } from "react";
import type { Incident } from "@/lib/incidents";
import {
  humanizeList,
  humanizeValue,
  safeExternalUrl,
} from "@/lib/incident-format";
import PostDate from "@/components/post-date";

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 py-3 sm:grid sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{term}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0">{children}</dd>
    </div>
  );
}

/**
 * The entry's front matter, as a definition list above the prose.
 *
 * Optional fields are omitted rather than rendered empty. `control` is not
 * shown here — it gets its own treatment further down the page.
 */
export default function IncidentMeta({ incident }: { incident: Incident }) {
  const stack = incident.agent_stack;
  const helioPack = safeExternalUrl(incident.helio_pack);
  // Both keys are optional even when agent_stack is present: 2 of the 3
  // populated stacks in the log today name a framework and no model.
  const stackParts = [stack?.framework, stack?.model].filter(Boolean);

  return (
    <dl className="border-b border-gray-200 dark:border-gray-800">
      <Row term="Organization">{incident.organization}</Row>
      <Row term="Date">
        <PostDate dateString={incident.date} />
      </Row>
      <Row term="Scale">{incident.scale}</Row>
      <Row term="Surface">{humanizeValue(incident.surface)}</Row>
      {stackParts.length > 0 && (
        <Row term="Agent stack">{stackParts.join(" · ")}</Row>
      )}
      <Row term="Tools involved">
        {incident.tools.length > 0
          ? humanizeList(incident.tools)
          : "None — no agent invoked a tool"}
      </Row>
      <Row term="Harm">{humanizeList(incident.harm)}</Row>
      <Row term="Who was harmed">{humanizeValue(incident.harm_bearer)}</Row>
      <Row term="Reversible">{humanizeValue(incident.reversible)}</Row>
      <Row term="Root cause">{humanizeList(incident.root_cause)}</Row>
      <Row term="Prevented by action governance">
        {humanizeValue(incident.prevented_by_action_governance)}
      </Row>
      {typeof incident.aiid_incident === "number" && (
        <Row term="AI Incident Database">
          <a
            className="font-medium text-blue-500 dark:text-blue-400 transition-colors hover:text-blue-600 dark:hover:text-blue-300 hover:underline"
            href={`https://incidentdatabase.ai/cite/${incident.aiid_incident}`}
          >
            Incident {incident.aiid_incident}
          </a>
        </Row>
      )}
      {helioPack && (
        /* Editorial rule 5: this is a field, not a pitch. A plain link — no
           button, no call to action. */
        <Row term="Helio control pack">
          <a
            className="font-medium text-blue-500 dark:text-blue-400 transition-colors hover:text-blue-600 dark:hover:text-blue-300 hover:underline"
            href={helioPack}
          >
            {helioPack.replace(/^https?:\/\//, "")}
          </a>
        </Row>
      )}
      <Row term="Last verified">
        <PostDate dateString={incident.last_verified} />
      </Row>
    </dl>
  );
}
