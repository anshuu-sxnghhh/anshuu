"use client";

import { usePathname } from "next/navigation";
import { MotionControl } from "@/components/motion-control";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDiaryEditor = pathname?.startsWith("/my-diary/") ?? false;

  return (
    <>
      {!isDiaryEditor && <a className="skip-link" href="#main">Skip to content</a>}
      {!isDiaryEditor && <SiteHeader />}
      <main className={isDiaryEditor ? "main-diary-editor" : undefined} id="main">{children}</main>
      {!isDiaryEditor && <SiteFooter />}
      {!isDiaryEditor && <MotionControl />}
    </>
  );
}
