import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireParent } from "@/lib/auth/session";
import {
  CALIBRATION_MAX_ROUNDS,
  CALIBRATION_START_LEVEL,
} from "@/lib/calibration/engine";
import {
  CALIBRATION_PASSAGES,
  toPassageView,
} from "@/lib/calibration/passages";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { CalibrationGame } from "./CalibrationGame";

export const metadata: Metadata = {
  title: "Find your reading superpower — ReadTrip",
};

export default async function CalibratePage() {
  const parent = await requireParent();
  const childId = await getSelectedChildId();
  if (!childId) redirect("/profiles");

  const child = await getChild(parent.id, childId);
  if (!child) redirect("/profiles");

  // Already calibrated — don't make them do it twice.
  if (child.calibratedAt) redirect("/play");

  // The first passage is deterministic (always the starting level), so we can
  // render it server-side; subsequent passages come from /api/calibrate.
  const firstPassage = toPassageView(
    CALIBRATION_PASSAGES[CALIBRATION_START_LEVEL]
  );

  return (
    <CalibrationGame
      childName={child.displayName}
      firstPassage={firstPassage}
      totalRounds={CALIBRATION_MAX_ROUNDS}
    />
  );
}
