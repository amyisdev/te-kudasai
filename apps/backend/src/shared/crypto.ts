import * as crypto from 'node:crypto'

const ALGO = 'aes-256-cbc'
const key = process.env.BETTER_AUTH_SECRET || 'dont-use-this-in-production'
const keyHash = crypto.createHash('sha256').update(key).digest()

export function encrypt(str: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGO, keyHash, iv)

  const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(str: string) {
  const [ivHex = '', encryptedHex = ''] = str.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGO, keyHash, iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}

export function hash(str: string) {
  return crypto.hash('sha1', str)
}
