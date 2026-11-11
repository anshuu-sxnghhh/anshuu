import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anshuu’s Diary — Under Maintenance",
  description: "Anshuu’s diary is under maintenance. Please come back in one week.",
};

export default function AnshuuDiaryMaintenancePage() {
  return (
    <section aria-labelledby="maintenance-title" className="maintenance-page">
      <div aria-hidden="true" className="maintenance-mark">✦</div>
      <p className="maintenance-kicker">ANSHUU’S PERSONAL NOTEBOOK</p>
      <h1 id="maintenance-title">This page is still unfolding.</h1>
      <p className="maintenance-message">
        Anshuu&apos;s diary is currently under maintenance. Please come back in one week.
      </p>
      <div aria-hidden="true" className="maintenance-divider"><span>✦</span></div>
      <Link className="maintenance-home-link" href="/personal-diary">
        Back to the personal diary <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
