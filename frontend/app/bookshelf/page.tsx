import type { Metadata } from "next";
import Link from "next/link";
import { CustomDiary } from "@/components/custom-diary";
import { DiaryScene } from "@/components/diary-scene";

export const metadata: Metadata = {
  title: "My Bookshelf",
  description: "Open and manage the diaries saved in this browser.",
};

export default function BookshelfPage() {
  return (
    <section className="hero diary-notebook-page diary-bookshelf-page">
      <DiaryScene />
      <div className="diary-notebook-content">
        <Link className="create-diary-small" href="/personal-diary">
          <span aria-hidden="true">←</span> Anshuu&apos;s diary
        </Link>
        <CustomDiary initialView="shelf" />
      </div>
    </section>
  );
}
