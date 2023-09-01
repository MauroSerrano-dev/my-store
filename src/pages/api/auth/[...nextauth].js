import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { cert } from "firebase-admin/app";
import { removeEmailVerifiedField } from "../../../../backend/user";
/* import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe"; */

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          email_verified: profile.email_verified,
          cart: [],
          create_at: new Date(),
        }
      },
    }),
  ],
  callbacks: {
    session: async (props) => {
      const { session, user } = props

      if (user.emailVerified !== undefined)
        removeEmailVerifiedField(user.id)

      return Promise.resolve({
        ...props,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cart: user.cart
        }
      })
    },
    async signIn(props) {
      const { user, account, profile } = props
      /* if (user && user.email) {
        try {
          const existingCustomer = await getCustomerByEmail(user.email);
          if (existingCustomer)
            return true
          await createCustomer(user.email, user.name);
          return true
        } catch (error) {
          console.error("Error creating customer:", error);
          return false
        }
      } */

      return Promise.resolve(true)
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
  }),
});