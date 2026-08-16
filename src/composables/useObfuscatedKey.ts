const OBFS_SEED = 'squirrel-obfs-2026'

const cache = new Map<string, string>()

function hexDecode(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

function decode(obfuscated: string): string {
  const cached = cache.get(obfuscated)
  if (cached) return cached

  const hexBytes = hexDecode(obfuscated)
  const seedBytes = new TextEncoder().encode(OBFS_SEED)
  const decoded = new Uint8Array(hexBytes.length)
  for (let i = 0; i < hexBytes.length; i++) {
    decoded[i] = hexBytes[i] ^ seedBytes[i % seedBytes.length]
  }

  const result = new TextDecoder().decode(decoded)
  cache.set(obfuscated, result)
  return result
}

export function useObfuscatedKey(obfuscatedKey: string): string {
  if (!obfuscatedKey) return ''
  return decode(obfuscatedKey)
}
