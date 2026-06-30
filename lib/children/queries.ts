import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { children } from "@/lib/db/schema";
import type { AvatarColor, ChildInput } from "./validation";
import { AVATAR_COLORS } from "./validation";

// View model handed to the UI — the raw row's jsonb avatarConfig flattened to a
// known color.
export interface ChildProfile {
  id: string;
  displayName: string;
  avatarColor: AvatarColor;
  readingLevel: number;
  level: number;
  xp: number;
}

type ChildRow = typeof children.$inferSelect;

function avatarColorOf(row: ChildRow): AvatarColor {
  const color = (row.avatarConfig as { color?: unknown } | null)?.color;
  return typeof color === "string" &&
    (AVATAR_COLORS as readonly string[]).includes(color)
    ? (color as AvatarColor)
    : "aqua";
}

function toProfile(row: ChildRow): ChildProfile {
  return {
    id: row.id,
    displayName: row.displayName,
    avatarColor: avatarColorOf(row),
    readingLevel: row.readingLevel,
    level: row.level,
    xp: row.xp,
  };
}

export async function listChildren(parentId: string): Promise<ChildProfile[]> {
  const rows = await db
    .select()
    .from(children)
    .where(eq(children.parentId, parentId))
    .orderBy(asc(children.createdAt));
  return rows.map(toProfile);
}

/** Fetch one child, scoped to its parent so a parent can't read another's. */
export async function getChild(
  parentId: string,
  childId: string
): Promise<ChildProfile | null> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  return row ? toProfile(row) : null;
}

export async function createChild(
  parentId: string,
  input: ChildInput
): Promise<ChildProfile> {
  const [row] = await db
    .insert(children)
    .values({
      parentId,
      displayName: input.displayName,
      avatarConfig: { color: input.avatarColor },
      recentQuizScores: [],
    })
    .returning();
  return toProfile(row);
}

/** Update is scoped by parentId so a parent can only edit their own children. */
export async function updateChild(
  parentId: string,
  childId: string,
  input: ChildInput
): Promise<void> {
  await db
    .update(children)
    .set({
      displayName: input.displayName,
      avatarConfig: { color: input.avatarColor },
    })
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}

export async function deleteChild(
  parentId: string,
  childId: string
): Promise<void> {
  await db
    .delete(children)
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}
