import type { RichPart } from './types'

export function RichLine({ parts }: { parts: RichPart[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="font-medium text-gray-900">
            {part.strong}
          </span>
        )
      )}
    </>
  )
}
