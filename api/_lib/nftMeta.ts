/**
 * NFT metadata for the Demo collection.
 *
 * The OZ NFT base URI is capped at 200 chars, so we can't inline the metadata
 * in the contract. Instead the contract's base URI points here
 * (.../api/nft-meta/) and token_uri(id) → this endpoint, which returns standard
 * NFT metadata JSON ({ name, description, image }) with the artwork embedded as
 * an SVG data URI (no extra image hosting). Wallets like Freighter fetch it to
 * render the collectible.
 */
export function nftMetadata(id: number) {
  const h = (id * 53) % 360
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 90% 60%)"/><stop offset="1" stop-color="hsl(${(h + 90) % 360} 90% 55%)"/></linearGradient></defs><rect width="400" height="400" rx="40" fill="#0a0a0a"/><rect x="36" y="36" width="328" height="328" rx="28" fill="url(#g)"/><text x="200" y="218" font-family="system-ui,sans-serif" font-size="46" font-weight="700" fill="#0a0a0a" text-anchor="middle">#${id}</text><text x="200" y="256" font-family="system-ui,sans-serif" font-size="15" fill="#0a0a0a" text-anchor="middle" opacity="0.65">Stellable · testnet</text></svg>`
  const image =
    'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
  return {
    name: `Stellable Demo NFT #${id}`,
    description: 'A collectible minted on Stellar testnet via Stellable.',
    image,
  }
}
