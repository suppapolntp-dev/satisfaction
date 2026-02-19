import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: number | null;
    branchId?: number | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      role?: number | null;
      branchId?: number | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: number | null;
    branchId?: number | null;
  }
}