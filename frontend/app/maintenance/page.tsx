import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website Under Maintenance",
  description: "The notebook is under maintenance. Please come back in one week.",
};

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const isSaveNotice = from === "save";
  const isAnshuuNotebook = from === "anshuu";

  return (
    <section aria-labelledby="maintenance-title" className="maintenance-page">
      <div aria-hidden="true" className="maintenance-mark">✦</div>
      <p className="maintenance-kicker">
        {isSaveNotice ? "A NOTE ABOUT YOUR NOTEBOOK" : "ANSHUU’S PERSONAL NOTEBOOK"}
      </p>
      <h1 id="maintenance-title">
        {isSaveNotice ? "Online saving is under maintenance." : "This page is still unfolding."}
      </h1>
      {isSaveNotice ? (
        <p className="maintenance-message">
          We can&apos;t save or share your diary to our server right now. Your writing stays saved only in this browser on this device.
          Please don&apos;t clear this browser&apos;s data if you want to keep it. We&apos;re sorry for the inconvenience.
        </p>
      ) : (
        <p className="maintenance-message">
          {isAnshuuNotebook ? "Anshuu’s notebook is " : "The website is "}
          under maintenance. Please come back in one week.
        </p>
      )}
      <div aria-hidden="true" className="maintenance-divider"><span>✦</span></div>
      <Link className="maintenance-home-link" href={isSaveNotice ? "/personal-diary" : "/"}>
        {isSaveNotice ? "Back to the bookshelf" : "Back to the beginning"}
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
