import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import connectToDatabase from "./mongodb";
import User from "../models/User";

type TokenWithMeta = JWT & {
  id?: string;
  provider?: string;
};

// Validate required environment variables
const getSecret = (): string => {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET or JWT_SECRET environment variable is not set");
  }
  return secret;
};

const getNextAuthUrl = (): string => {
  const url = process.env.NEXTAUTH_URL;
  if (!url) {
    throw new Error("NEXTAUTH_URL environment variable is not set");
  }
  return url;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectToDatabase();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isValidPassword = await user.comparePassword(
            credentials.password,
          );

          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          console.log("User authenticated successfully:", user.email);
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
          console.error("Authorization error:", errorMsg);
          throw new Error(errorMsg);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const typedToken = token as TokenWithMeta;
      if (user) {
        typedToken.id = user.id;
        console.log("JWT callback - User authenticated:", user.email);
      }
      if (account) {
        typedToken.provider = account.provider;
      }
      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as TokenWithMeta;
      if (session.user) {
        session.user.id = typedToken.id || "";
        console.log("Session callback - Session updated for:", session.user.email);
      }
      return session;
    },
    async signIn() {
      console.log("SignIn callback invoked");
      return true;
    },
    async redirect({ url, baseUrl }) {
      try {
        // Prefer NEXTAUTH_URL from environment, fallback to baseUrl
        const authUrl = process.env.NEXTAUTH_URL?.trim() || baseUrl;
        console.log("Redirect Debug:", { url, baseUrl, authUrl, NODE_ENV: process.env.NODE_ENV });
        
        // If the URL is already on the auth domain, return it as is
        if (url.startsWith(authUrl)) {
          console.log("URL matches authUrl, returning:", url);
          return url;
        }
        // If the URL starts with /, it's a relative URL, make it absolute
        if (url.startsWith("/")) {
          const redirectUrl = authUrl + url;
          console.log("Relative URL detected, redirecting to:", redirectUrl);
          return redirectUrl;
        }
        // Otherwise, return the auth URL with dashboard path
        const defaultUrl = authUrl + "/dashboard";
        console.log("Default redirect:", defaultUrl);
        return defaultUrl;
      } catch (err) {
        console.error("Redirect error:", err);
        return baseUrl + "/dashboard";
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: getSecret(),
};

export default authOptions;
