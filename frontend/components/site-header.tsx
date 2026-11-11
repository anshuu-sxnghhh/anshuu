import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link aria-label="Anshuu Singh, home" className="wordmark" href="/">
        Anshuu Singh
      </Link>
      <Link className="nav-contact" href="/personal-diary">
        Personal Diary <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
