// types/next-auth.d.ts
import "next-auth";


import { User } from './user';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
    };
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

