import mongoClientPromise from "@/database/mongoClientPromise";
import { dbConnect } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) return null;

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isMatch) return null;

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            // mobile: user.mobile,
            userType: user.userType, // 'shop' or 'customer'
            avatar: user.avatar,
            // shopName: user.shopName,
            // shopProfile: user.shopProfile,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // Runs at sign-in
      if (user) {
        token.id = user.id; // ← Add this
        token.name = user.name;
        token.userType = user.userType;
        token.avatar = user.avatar || user.image;

        // Save Google avatar to DB if not already set
        if (account?.provider === "google" && user.image && !user.avatar) {
          await dbConnect();
          await User.findByIdAndUpdate(user.id, {
            $set: { avatar: user.image },
          });
          token.avatar = user.image;
        }
      }

      // Handle manual session updates
      if (trigger === "update" && session) {
        // If session data is passed, use it
        if (session.avatar) token.avatar = session.avatar;
        if (session.name) token.name = session.name;
      } else if (trigger === "update") {
        // Otherwise fetch from DB
        await dbConnect();
        const updatedUser = await User.findById(token.id).lean();
        if (updatedUser) {
          token.avatar = updatedUser.avatar;
          token.name = updatedUser.name;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Expose to client + server components
      session.user.id = token.id; // ← Add this
      session.user.userType = token.userType;
      session.user.avatar = token.avatar;
      // session.user.shopName = token.shopName;
      // session.user.shopProfile = token.shopProfile;
      // session.user.mobile = token.mobile;
      return session;
    },
  },
});
