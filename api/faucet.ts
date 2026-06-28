import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mintDemoTokens } from './_lib/faucet'

/** POST /api/faucet { address, amount? } — mint Demo tokens to a wallet (testnet). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  try {
    const { address, amount } = req.body as { address: string; amount?: number }
    if (!address) return res.status(400).json({ error: 'address required' })
    const hash = await mintDemoTokens(address, amount ?? 1000)
    res.status(200).json({ hash })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
