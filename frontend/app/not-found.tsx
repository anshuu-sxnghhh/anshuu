import Link from "next/link";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="hero">
      <div className="diary-content">
        <p className="hero-kicker">A small detour</p>
        <h1 className="diary-title" id="not-found-title">This page isn&apos;t here.</h1>
        <p className="hero-copy">The notebook is still taking shape. Let&apos;s head back to the homepage.</p>
        <Link className="button-pill" href="/">
          Back to the homepage <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
