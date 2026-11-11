"use client";

function wheelValue(value: number, min: number, max: number, offset: number) {
  const range = max - min + 1;
  return ((value - min + offset + range * 2) % range) + min;
}

export function DateWheel({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const update = (offset: number) => {
    onChange(wheelValue(value, min, max, offset));
  };
  const format = (number: number) =>
    label === "year" ? String(number) : String(number).padStart(2, "0");

  return (
    <div
      aria-label={`${label} wheel`}
      className={`date-wheel wheel-${label.toLowerCase()}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          update(1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          update(-1);
        }
      }}
      role="group"
      tabIndex={0}
    >
      <span className="wheel-label">{label}</span>
      <button
        aria-label={`Decrease ${label}`}
        className="wheel-step"
        onClick={() => update(-1)}
        type="button"
      >
        <span aria-hidden="true">⌃</span>
      </button>
      <div aria-live="polite" className="wheel-window">
        <span aria-hidden="true" className="wheel-neighbor">{format(wheelValue(value, min, max, -1))}</span>
        <output aria-label={`${label}: ${value}`} className="wheel-selected">
          {format(value)}
        </output>
        <span aria-hidden="true" className="wheel-neighbor">{format(wheelValue(value, min, max, 1))}</span>
      </div>
      <button
        aria-label={`Increase ${label}`}
        className="wheel-step"
        onClick={() => update(1)}
        type="button"
      >
        <span aria-hidden="true">⌄</span>
      </button>
    </div>
  );
}
