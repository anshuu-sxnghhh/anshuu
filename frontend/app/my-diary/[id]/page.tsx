import type { Metadata } from "next";
import { CustomDiary } from "@/components/custom-diary";

export const metadata: Metadata = {
  title: "Your Diary",
  description: "A private notebook saved in this browser.",
};

export default async function MyDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <section className="diary-editor-route">
      <CustomDiary diaryId={id} initialView="book" key={id} />
    </section>
  );
}
