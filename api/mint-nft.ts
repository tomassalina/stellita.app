import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mintNft } from './_lib/nft'

/** POST /api/mint-nft { address } — mint one Demo NFT to a wallet (testnet). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  try {
    const { address } = req.body as { address: string }
    if (!address) return res.status(400).json({ error: 'address required' })
    res.status(200).json(await mintNft(address))
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
