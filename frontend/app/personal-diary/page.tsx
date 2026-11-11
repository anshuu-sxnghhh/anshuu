import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/hero-portrait-cinematic.png";
import { CustomDiary } from "@/components/custom-diary";
import { DiaryGate } from "@/components/diary-gate";
import { DiaryScene } from "@/components/diary-scene";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anshuu’s Personal Notebook",
  description: "Open Anshuu's notebook or create a diary saved on this device.",
};

export default function PersonalDiaryPage() {
  return (
    <section className="hero diary-notebook-page">
      <DiaryScene />
      <div className="hero-portrait diary-portrait diary-notebook-portrait">
        <Image
          alt="Cinematic portrait of Anshuu Singh"
          className="portrait-image"
          priority
          sizes="(max-width: 640px) 84vw, 560px"
          src={portrait}
        />
      </div>
      <div className="diary-notebook-content">
        <DiaryGate />
        <Link className="create-diary-small" href="/create-diary">
          Create your own diary <span aria-hidden="true">↗</span>
        </Link>
        <CustomDiary initialView="shelf" />
      </div>
      <div aria-hidden="true" className="hero-foot">
        <span className="scroll-cue"><span />A NOTEBOOK KEPT CLOSE TO THE HEART</span>
        <span>MADE WITH CARE</span>
      </div>
    </section>
  );
}
