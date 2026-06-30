import { cookies } from "next/headers";

// Which child profile the parent is currently playing as. httpOnly so it can't
// be tampered with client-side; the child app reads it server-side and the
// middleware checks for its presence before allowing /play.
const SELECTED_CHILD_COOKIE = "selectedChildId";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getSelectedChildId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SELECTED_CHILD_COOKIE)?.value ?? null;
}

export async function setSelectedChild(childId: string): Promise<void> {
  const store = await cookies();
  store.set(SELECTED_CHILD_COOKIE, childId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function clearSelectedChild(): Promise<void> {
  const store = await cookies();
  store.delete(SELECTED_CHILD_COOKIE);
}
