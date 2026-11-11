import type { Metadata } from "next";
import { CustomDiary } from "@/components/custom-diary";
import { DiaryScene } from "@/components/diary-scene";

export const metadata: Metadata = {
  title: "Create a Diary",
  description: "Create a notebook saved privately in this browser.",
};

export default function CreateDiaryPage() {
  return (
    <section className="hero diary-notebook-page diary-builder-page">
      <DiaryScene />
      <div className="diary-notebook-content">
        <CustomDiary initialView="create" />
      </div>
    </section>
  );
}
