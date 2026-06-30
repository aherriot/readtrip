"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";

/**
 * Interactive Modal demo for the gallery. Lives in its own client component so
 * the gallery page itself can stay a server component. One instance per surface
 * so the dialog can be reviewed (and e2e-tested) on both night and paper.
 */
export function ModalDemo({ surface }: { surface: "night" | "paper" }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-surface={surface}
      data-testid={`modal-${surface}`}
      className="flex flex-col gap-2 rounded-lg bg-surface p-6 text-surface-ink"
    >
      <p className="mb-2 font-display text-sm text-surface-ink-soft">
        {surface} surface
      </p>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Ready to explore?"
        surface={surface}
      >
        <Text>
          You&apos;ve charted a new corner of the map. Want to keep going or
          take a break and come back later?
        </Text>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Not yet
          </Button>
          <Button onClick={() => setOpen(false)}>Let&apos;s go</Button>
        </div>
      </Modal>
    </div>
  );
}
