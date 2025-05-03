import type { BetterAuthPlugin, User } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { decrypt, encrypt, hash } from '@/shared/crypto'
import { getEndpointResponse } from './_utils'

export interface EncryptedUser {
  userId: string
  name: string
  email: string
}

const encryptedAuth = () => {
  return {
    id: 'encrypted-auth',
    schema: {
      encryptedUser: {
        fields: {
          userId: {
            type: 'string',
            required: true,
            returned: false,
            references: {
              model: 'user',
              field: 'id',
            },
          },

          name: {
            type: 'string',
            required: true,
          },

          email: {
            type: 'string',
            required: true,
          },
        },
      },
    },

    hooks: {
      before: [
        {
          matcher: (ctx) => {
            return ctx.path === '/sign-in/email'
          },
          handler: createAuthMiddleware(async (ctx) => {
            if (ctx?.body?.email) {
              return {
                context: {
                  ...ctx,
                  body: {
                    ...ctx.body,
                    email: `${hash(ctx.body.email.toLowerCase())}@tk.local`,
                  },
                },
              }
            }
          }),
        },
      ],

      after: [
        {
          matcher: (ctx) => {
            return ctx.path === '/get-session'
          },
          handler: createAuthMiddleware(async (ctx) => {
            if (!ctx.context.session?.user?.id) {
              return
            }

            const response = await getEndpointResponse<{ user: User }>(ctx)
            const encryptedUser = await ctx.context.adapter.findOne<EncryptedUser>({
              model: 'encryptedUser',
              where: [{ field: 'userId', operator: 'eq', value: ctx.context.session.user.id }],
            })

            if (!response || !encryptedUser) {
              return
            }

            response.user.name = decrypt(encryptedUser.name)
            response.user.email = decrypt(encryptedUser.email)

            return ctx.json(response)
          }),
        },
      ],
    },

    init(_) {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                async after(user, ctx) {
                  if (ctx) {
                    ctx.context.adapter.create({
                      model: 'encryptedUser',
                      data: {
                        userId: user.id,
                        name: encrypt(user.name),
                        email: encrypt(user.email),
                      },
                    })

                    ctx.context.internalAdapter.updateUser(user.id, {
                      name: hash(user.name.toLowerCase()),
                      email: `${hash(user.email.toLowerCase())}@tk.local`,
                    })
                  }
                },
              },
            },
          },
        },
      }
    },
  } as BetterAuthPlugin
}

export default encryptedAuth
