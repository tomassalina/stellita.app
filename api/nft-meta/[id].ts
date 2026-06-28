import type { VercelRequest, VercelResponse } from '@vercel/node'
import { nftMetadata } from '../_lib/nftMeta'

/** GET /api/nft-meta/:id — NFT metadata JSON (wallets fetch this for the art). */
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const id = Number(req.query.id)
  res.status(200).json(nftMetadata(Number.isFinite(id) ? id : 0))
}
