import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-wordmark" href="/">Anshuu Singh</Link>
      <p>Thank you for your patience while something personal takes shape.</p>
      <div className="footer-meta">
        <span>Please check back in one week</span>
        <span>© {new Date().getFullYear()} Anshuu Singh</span>
      </div>
    </footer>
  );
}
