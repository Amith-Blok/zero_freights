import type { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { sendCustomVerificationLink } from '@/lib/resend-auth-request'

export default {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      from: process.env.AUTH_RESEND_FROM_EMAIL,
      apiKey: process.env.AUTH_RESEND_KEY,
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from, apiKey },
      }) {
        sendCustomVerificationLink({
          email,
          url,
          provider: { server, from, apiKey },
        })
      },
    }),
  ],

  //   events: {
  //     createUser: async ({ user }) => {
  //       // console.log("===== Create User Event Started ======")
  //       if (!user.id) {
  //         return
  //       }
  //       console.log('createUser', user)
  //       const transactionId = uuidv4()
  //       await addCreditTransaction({
  //         transactionId: transactionId,
  //         userId: user.id,
  //         credit: 10,
  //         amount: 0,
  //         notes: 'Welcome bonus - 10 free credits',
  //       })
  //       // console.log(`===== Transaction (id: ${transactionId}) Added to user(${user.id})======`)
  //       // console.log("===== Create User Event Ended ======")
  //     },
  //   },
} satisfies NextAuthConfig
