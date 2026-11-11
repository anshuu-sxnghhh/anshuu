"use client";

import { useEffect, useSyncExternalStore } from "react";

const preferenceKey = "anshuu-portfolio-motion";
const motionChangeEvent = "anshuu-portfolio-motion-change";

function subscribeToMotion(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(motionChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(motionChangeEvent, callback);
  };
}

function getMotionPreference() {
  const savedPreference = window.localStorage.getItem(preferenceKey);
  if (savedPreference) return savedPreference === "on";
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionPreference() {
  return true;
}

export function MotionControl() {
  const motionEnabled = useSyncExternalStore(
    subscribeToMotion,
    getMotionPreference,
    getServerMotionPreference,
  );

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  }, [motionEnabled]);

  function toggleMotion() {
    const enabled = !motionEnabled;
    window.localStorage.setItem(preferenceKey, enabled ? "on" : "off");
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    window.dispatchEvent(new Event(motionChangeEvent));
  }

  return (
    <button
      aria-pressed={motionEnabled}
      className="motion-control"
      onClick={toggleMotion}
      type="button"
    >
      <span aria-hidden="true">{motionEnabled ? "Ⅱ" : "▷"}</span>
      Motion {motionEnabled ? "on" : "off"}
    </button>
  );
}
