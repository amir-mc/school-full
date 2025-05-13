// types/next-auth.d.ts
import "next-auth";


import { User } from './user';

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }


declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

