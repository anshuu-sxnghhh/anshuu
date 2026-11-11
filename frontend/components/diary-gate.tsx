"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { verifyDiaryAccess, type DiaryAccessState } from "@/app/personal-diary/actions";
import { DateWheel } from "@/components/date-wheel";

const startingValues = { day: 1, month: 1, year: 2000 };

type DatePart = keyof typeof startingValues;

const dateWheels: { key: DatePart; label: string; min: number; max: number }[] = [
  { key: "day", label: "Day", min: 1, max: 31 },
  { key: "month", label: "Month", min: 1, max: 12 },
  { key: "year", label: "Year", min: 1900, max: 2099 },
];

const initialState: DiaryAccessState = { status: "idle", message: "" };

function MaintenanceNote() {
  return (
    <section aria-labelledby="locked-diary-title" className="diary-unlocked diary-intro diary-book-cover">
      <p className="diary-kicker"><span aria-hidden="true">✦</span> A LITTLE NOTE FOR YOU</p>
      <h1 className="diary-unlocked-title" id="locked-diary-title">
        A page that&apos;s<br />still unfolding.
      </h1>
      <p className="diary-maintenance-copy">Anshuu&apos;s notebook is under maintenance. Come back in one week.</p>
      <div aria-hidden="true" className="diary-divider"><span>✦</span></div>
      <Link className="diary-back-link" href="/">Back to the beginning <span aria-hidden="true">↗</span></Link>
    </section>
  );
}

export function DiaryGate() {
  const [showLock, setShowLock] = useState(false);
  const [values, setValues] = useState(startingValues);
  const [state, formAction, isPending] = useActionState(verifyDiaryAccess, initialState);

  if (state.status === "unlocked") {
    return <MaintenanceNote />;
  }

  if (!showLock) {
    return (
      <section aria-labelledby="diary-intro-title" className="diary-gate diary-intro diary-book-cover">
        <p className="diary-kicker"><span aria-hidden="true">✦</span> ANSHUU&apos;S NOTEBOOK</p>
        <h1 className="diary-gate-title" id="diary-intro-title">
          Personal<br />Diary
        </h1>
        <button className="diary-enter-button" onClick={() => setShowLock(true)} type="button">
          <span aria-hidden="true">✦</span>
          Open Anshuu&apos;s diary
          <span aria-hidden="true">↗</span>
        </button>
      </section>
    );
  }

  const accessCode = [
    String(values.day).padStart(2, "0"),
    String(values.month).padStart(2, "0"),
    String(values.year),
  ].join("");

  return (
    <section aria-labelledby="diary-title" className="diary-gate">
      <p className="diary-kicker"><span aria-hidden="true">✦</span> A PRIVATE LITTLE CORNER</p>
      <h1 className="diary-gate-title" id="diary-title">
        Anshuu&apos;s<br />little notebook.
      </h1>
      <form action={formAction} className="lock-form">
        <input name="accessCode" type="hidden" value={accessCode} />
        <fieldset className="date-lock">
          <legend>Turn the little wheels to enter</legend>
          <div className="wheel-grid">
            {dateWheels.map((wheel) => (
              <DateWheel
                key={wheel.key}
                label={wheel.label}
                max={wheel.max}
                min={wheel.min}
                onChange={(value) => setValues((current) => ({ ...current, [wheel.key]: value }))}
                value={values[wheel.key]}
              />
            ))}
          </div>
          <p className="date-format">DAY <span>·</span> MONTH <span>·</span> YEAR</p>
        </fieldset>
        <button className="diary-enter-button" disabled={isPending} type="submit">
          <span aria-hidden="true">✦</span>
          {isPending ? "Turning the page..." : "Unlock the notebook"}
          <span aria-hidden="true">↗</span>
        </button>
        <p aria-live="polite" className={`gate-message gate-message-${state.status}`} role={state.status === "incorrect" || state.status === "unavailable" ? "alert" : undefined}>
          {state.message}
        </p>
      </form>
      <p className="diary-back-hint">Only the person this notebook belongs to can turn these pages.</p>
    </section>
  );
}
