import { redirect } from "next/navigation";
import { auth } from "./index";

export interface ParentUser {
  id: string;
  email: string | null;
  name: string | null;
}

/**
 * Server-side guard for parent-only areas. Returns the authenticated parent or
 * redirects to sign-in. The middleware already blocks unauthenticated requests
 * to protected routes; this is the in-component guarantee that gives us a typed,
 * non-null user id for queries.
 */
export async function requireParent(): Promise<ParentUser> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}
