import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
/* import { createCustomer, getCustomerByEmail } from "../../../backend-data/utils/stripe"; */

import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { cert } from "firebase-admin/app";

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
          createAt: new Date(),
        }
      },
    }),
  ],
  callbacks: {
    session: async (session) => {
      return Promise.resolve({
        ...session,
        user: {
          name: session.user.name,
          email: session.user.email,
        }
      });
    },
    async signIn(props) {
      const { user, account, profile } = props;
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
      return true
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