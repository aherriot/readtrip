"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/ui/cn";
import type { ChildProfile } from "@/lib/children/queries";
import { AVATAR_COLORS, type AvatarColor } from "@/lib/children/validation";
import {
  acceptReadingSuggestionAction,
  createChildAction,
  deleteChildAction,
  dismissReadingSuggestionAction,
  selectChildAction,
  updateChildAction,
  type ProfileFormState,
} from "./actions";
import {
  MAX_READING_LEVEL,
  MIN_READING_LEVEL,
} from "@/lib/llm/prompts/readingLevel";

const FORM_IDLE: ProfileFormState = { status: "idle" };

// Literal class map so Tailwind's scanner keeps these utilities (a dynamic
// `bg-${color}` would be purged).
const AVATAR_BG: Record<AvatarColor, string> = {
  sun: "bg-sun",
  coral: "bg-coral",
  aqua: "bg-aqua",
  leaf: "bg-leaf",
  violet: "bg-violet",
};

function Avatar({
  color,
  name,
  size = "lg",
}: {
  color: AvatarColor;
  name: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-[var(--ink)]",
        size === "lg" ? "h-16 w-16 text-2xl" : "h-9 w-9 text-base",
        AVATAR_BG[color]
      )}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

type Editing = { mode: "create" } | { mode: "edit"; child: ChildProfile };

export function ProfilesManager({ profiles }: { profiles: ChildProfile[] }) {
  const [editing, setEditing] = useState<Editing | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {profiles.map((child) => (
          <li key={child.id}>
            <ProfileCard
              child={child}
              onEdit={() => setEditing({ mode: "edit", child })}
            />
          </li>
        ))}
        <li>
          <Card
            elevated
            className="flex h-full min-h-[140px] items-center justify-center"
          >
            <Button
              variant="ghost"
              onClick={() => setEditing({ mode: "create" })}
              leadingIcon={<span aria-hidden="true">＋</span>}
            >
              Add an explorer
            </Button>
          </Card>
        </li>
      </ul>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === "edit" ? "Edit explorer" : "Add an explorer"}
      >
        {editing && (
          <ChildForm
            key={editing.mode === "edit" ? editing.child.id : "new"}
            editing={editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}

function ProfileCard({
  child,
  onEdit,
}: {
  child: ChildProfile;
  onEdit: () => void;
}) {
  return (
    <Card elevated className="flex h-full flex-col gap-3">
      <form action={selectChildAction}>
        <input type="hidden" name="childId" value={child.id} />
        <Button
          type="submit"
          variant="ghost"
          fullWidth
          className="h-auto flex-col gap-3 py-5 not-disabled:motion-safe:hover:-translate-y-0.5"
        >
          <Avatar color={child.avatarColor} name={child.displayName} />
          <span className="font-display text-lg">{child.displayName}</span>
          <span className="text-sm text-surface-ink-soft">
            Level {child.level} · Reading {child.readingLevel}
          </span>
        </Button>
      </form>
      {child.suggestedReadingLevel !== null &&
        child.suggestedReadingLevel !== child.readingLevel && (
          <ReadingSuggestion child={child} />
        )}
      <div className="flex justify-center">
        <Button variant="ghost" size="md" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </Card>
  );
}

// A pending, parent-approved reading-level change (docs/04). Quizzes only ever
// *suggest* — the level moves when the parent taps here, never on its own. An
// "up" is framed as a win; a "down" stays gentle (and is never shown to the
// child). Accept/dismiss are separate <form>s so neither nests in the other.
function ReadingSuggestion({ child }: { child: ChildProfile }) {
  const suggested = child.suggestedReadingLevel!;
  const goingUp = suggested > child.readingLevel;

  return (
    <div className="flex flex-col gap-2 rounded-md border-2 border-surface-rule bg-surface-panel p-3 text-center">
      <Text size="sm">
        {goingUp
          ? `${child.displayName} is acing Reading ${child.readingLevel}. Ready for Reading ${suggested}?`
          : `Reading ${child.readingLevel} looks tricky for ${child.displayName}. Ease to Reading ${suggested}?`}
      </Text>
      <div className="flex flex-wrap justify-center gap-2">
        <form action={acceptReadingSuggestionAction}>
          <input type="hidden" name="childId" value={child.id} />
          <Button type="submit" size="md">
            {goingUp ? "Move up" : "Ease down"}
          </Button>
        </form>
        <form action={dismissReadingSuggestionAction}>
          <input type="hidden" name="childId" value={child.id} />
          <Button type="submit" variant="ghost" size="md">
            Not yet
          </Button>
        </form>
      </div>
    </div>
  );
}

function ColorPicker({ defaultColor }: { defaultColor: AvatarColor }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-body text-sm font-medium text-surface-ink">
        Avatar color
      </legend>
      <div
        className="flex flex-wrap gap-3"
        role="radiogroup"
        aria-label="Avatar color"
      >
        {AVATAR_COLORS.map((color) => (
          <label key={color} className="relative cursor-pointer" title={color}>
            <input
              type="radio"
              name="avatarColor"
              value={color}
              defaultChecked={color === defaultColor}
              className="peer sr-only"
              required
            />
            <span
              className={cn(
                "block h-12 w-12 rounded-full border-2 border-transparent",
                "peer-checked:border-surface-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]",
                AVATAR_BG[color]
              )}
            />
            <span className="sr-only">{color}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ChildForm({
  editing,
  onDone,
}: {
  editing: Editing;
  onDone: () => void;
}) {
  const isEdit = editing.mode === "edit";
  const child = isEdit ? editing.child : null;
  const action = isEdit ? updateChildAction : createChildAction;

  const [state, formAction, pending] = useActionState<
    ProfileFormState,
    FormData
  >(action, FORM_IDLE);

  // The delete action lives in its own <form>, so it can't be nested inside the
  // edit form (nested <form> elements are invalid HTML and make React throw
  // "A React form was unexpectedly submitted"). The edit form and the footer are
  // siblings instead; the submit button reaches back to the edit form by id.
  const formId = useId();

  // Close the modal once the server confirms the write succeeded.
  useEffect(() => {
    if (state.status === "success") onDone();
  }, [state, onDone]);

  return (
    <div className="flex flex-col gap-5">
      <form id={formId} action={formAction} className="flex flex-col gap-5">
        {child && <input type="hidden" name="childId" value={child.id} />}
        <Input
          label="Name"
          name="displayName"
          defaultValue={child?.displayName ?? ""}
          autoComplete="off"
          required
          maxLength={40}
          placeholder="e.g. Ada"
          hint="The name your explorer will see."
        />
        <ColorPicker defaultColor={child?.avatarColor ?? "aqua"} />

        {isEdit && (
          <Input
            label="Reading level"
            name="readingLevel"
            type="number"
            inputMode="numeric"
            min={MIN_READING_LEVEL}
            max={MAX_READING_LEVEL}
            step={1}
            defaultValue={child?.readingLevel ?? ""}
            size="md"
            required
            hint={`${MIN_READING_LEVEL} (early reader) to ${MAX_READING_LEVEL} (advanced). Set this yourself anytime — it won't change on its own.`}
          />
        )}

        {state.status === "error" && (
          <Text role="alert" size="sm" className="text-surface-danger">
            {state.error}
          </Text>
        )}
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {isEdit && (
          <DeleteButton
            childId={child!.id}
            name={child!.displayName}
            onDone={onDone}
          />
        )}
        <Button type="submit" form={formId} loading={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create explorer"}
        </Button>
      </div>
    </div>
  );
}

function DeleteButton({
  childId,
  name,
  onDone,
}: {
  childId: string;
  name: string;
  onDone: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="sm:mr-auto"
      >
        Delete
      </Button>
    );
  }

  return (
    <form action={deleteChildAction} onSubmit={onDone} className="sm:mr-auto">
      <input type="hidden" name="childId" value={childId} />
      <Button type="submit" variant="secondary">
        Delete {name}?
      </Button>
    </form>
  );
}
