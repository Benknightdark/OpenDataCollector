import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { getApiUrl } from '../../../helpers/common_helper';

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const url = `${getApiUrl('account-service')}/api/login`;

        const req = await fetch(url, {
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            userName: credentials.username,
            password: credentials.password,
          })
        })
        if (req.status === 200) {
          const dd = await req.text();
          return { name: dd }

        } else {
          throw new Error((await req.json())['detail'])
        }
      }
    })
  ],
  //  secret: process.env.SECRET,

  session: {
    jwt: true,
  },
  callbacks: {
    async signIn(user, account, profile) {
      return true
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session) {
      const displayName = JSON.parse(session.user.name).displayName
      const token = JSON.parse(session.user.name).token;
      const userId = JSON.parse(session.user.name).userId;
      session.user.name = displayName;
      session.user.token = token;
      session.user.id = userId;

      return (session)
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    }
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    //  error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null // If set, new users will be directed here on first sign in
  }
})