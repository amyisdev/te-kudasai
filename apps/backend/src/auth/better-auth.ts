import { db } from '@/db/client'
import { trustedOrigins } from '@/shared/env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { nanoid } from 'nanoid'
import * as schema from './auth.schema'
import encryptedAuth from './plugins/encrypted-auth'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),

  plugins: [admin(), encryptedAuth()],
  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    cookiePrefix: 'tk',
    database: {
      generateId() {
        return nanoid()
      },
    },
  },

  trustedOrigins,

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
})
