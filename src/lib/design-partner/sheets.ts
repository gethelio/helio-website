import { JWT } from 'google-auth-library'
import type { DesignPartnerInput } from './schema.js'
import { HUMAN_APPROVAL_LABELS } from './schema.js'

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const HEADER_ROW = [
  'Timestamp',
  'Email',
  'What the agent does',
  'Tools',
  'Human approval',
  'Referrer',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'UTM term',
  'UTM content',
]

export interface DesignPartnerRow {
  timestamp: string
  submission: DesignPartnerInput
}

function getSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const tab = process.env.GOOGLE_SHEETS_TAB || 'Submissions'

  if (!spreadsheetId || !email || !privateKey) {
    return null
  }

  return { spreadsheetId, email, privateKey, tab }
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const client = new JWT({
    email,
    key: privateKey,
    scopes: [SHEETS_SCOPE],
  })
  const token = await client.authorize()
  if (!token.access_token) {
    throw new Error('Google Sheets auth returned no access token')
  }
  return token.access_token
}

async function sheetsFetch(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  return response
}

async function ensureHeaderRow(
  spreadsheetId: string,
  tab: string,
  accessToken: string
): Promise<void> {
  const encodedRange = encodeURIComponent(`${tab}!A1:K1`)
  const existing = await sheetsFetch(`${spreadsheetId}/values/${encodedRange}`, accessToken)
  if (!existing.ok) {
    const detail = await existing.text()
    throw new Error(`Failed to read sheet header: ${existing.status} ${detail}`)
  }

  const data = (await existing.json()) as { values?: string[][] }
  const firstCell = data.values?.[0]?.[0]
  if (firstCell) return

  const write = await sheetsFetch(
    `${spreadsheetId}/values/${encodedRange}?valueInputOption=RAW`,
    accessToken,
    {
      method: 'PUT',
      body: JSON.stringify({ values: [HEADER_ROW] }),
    }
  )
  if (!write.ok) {
    const detail = await write.text()
    throw new Error(`Failed to write sheet header: ${write.status} ${detail}`)
  }
}

export function isSheetsConfigured(): boolean {
  return getSheetsConfig() !== null
}

export async function appendDesignPartnerRow(row: DesignPartnerRow): Promise<void> {
  const config = getSheetsConfig()
  if (!config) {
    throw new Error('Google Sheets is not configured')
  }

  const accessToken = await getAccessToken(config.email, config.privateKey)
  await ensureHeaderRow(config.spreadsheetId, config.tab, accessToken)

  const { submission } = row
  const values = [
    [
      row.timestamp,
      submission.email,
      submission.agentDoes,
      submission.tools,
      HUMAN_APPROVAL_LABELS[submission.humanApproval],
      submission.referrer || '',
      submission.utmSource || '',
      submission.utmMedium || '',
      submission.utmCampaign || '',
      submission.utmTerm || '',
      submission.utmContent || '',
    ],
  ]

  const encodedRange = encodeURIComponent(`${config.tab}!A:K`)
  const append = await sheetsFetch(
    `${config.spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({ values }),
    }
  )

  if (!append.ok) {
    const detail = await append.text()
    throw new Error(`Failed to append sheet row: ${append.status} ${detail}`)
  }
}
