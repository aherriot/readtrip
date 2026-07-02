"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { requireParent } from "@/lib/auth/session";
import {
  acceptReadingSuggestion,
  createChild,
  deleteChild,
  dismissReadingSuggestion,
  getChild,
  updateChild,
} from "@/lib/children/queries";
import { clearSelectedChild, setSelectedChild } from "@/lib/children/selection";
import { validateChildInput } from "@/lib/children/validation";

// A "use server" module may only export async functions, so the idle-state
// constant lives in the client component, not here.
export type ProfileFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string };

function readInput(formData: FormData) {
  return {
    displayName: formData.get("displayName"),
    avatarColor: formData.get("avatarColor"),
    // Only the edit form carries this; the create form omits it (calibration
    // sets a new child's starting level). Absent → validation leaves it alone.
    readingLevel: formData.get("readingLevel") ?? undefined,
  };
}

export async function createChildAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const parent = await requireParent();
  const result = validateChildInput(readInput(formData));
  if (!result.ok) return { status: "error", error: result.error };

  await createChild(parent.id, result.value);
  revalidatePath("/profiles");
  return { status: "success" };
}

export async function updateChildAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const parent = await requireParent();
  const childId = String(formData.get("childId") ?? "");
  if (!childId) return { status: "error", error: "Missing profile." };

  const result = validateChildInput(readInput(formData));
  if (!result.ok) return { status: "error", error: result.error };

  await updateChild(parent.id, childId, result.value);
  revalidatePath("/profiles");
  return { status: "success" };
}

/** Approve a pending reading-level suggestion, moving the child to that level. */
export async function acceptReadingSuggestionAction(
  formData: FormData
): Promise<void> {
  const parent = await requireParent();
  const childId = String(formData.get("childId") ?? "");
  if (!childId) return;

  await acceptReadingSuggestion(parent.id, childId);
  revalidatePath("/profiles");
}

/** Dismiss a pending reading-level suggestion ("not yet"). */
export async function dismissReadingSuggestionAction(
  formData: FormData
): Promise<void> {
  const parent = await requireParent();
  const childId = String(formData.get("childId") ?? "");
  if (!childId) return;

  await dismissReadingSuggestion(parent.id, childId);
  revalidatePath("/profiles");
}

export async function deleteChildAction(formData: FormData): Promise<void> {
  const parent = await requireParent();
  const childId = String(formData.get("childId") ?? "");
  if (!childId) return;

  await deleteChild(parent.id, childId);
  revalidatePath("/profiles");
}

/** Pick a child to play as: set the selection cookie, then enter the child app. */
export async function selectChildAction(formData: FormData): Promise<void> {
  const parent = await requireParent();
  const childId = String(formData.get("childId") ?? "");

  // Verify ownership before trusting the id from the form.
  const child = await getChild(parent.id, childId);
  if (!child) redirect("/profiles");

  await setSelectedChild(childId);
  redirect("/play");
}

export async function signOutAction(): Promise<void> {
  await clearSelectedChild();
  await signOut({ redirectTo: "/sign-in" });
}

/** Leave the child app and go back to pick a different profile. */
export async function switchProfileAction(): Promise<void> {
  await clearSelectedChild();
  redirect("/profiles");
}
