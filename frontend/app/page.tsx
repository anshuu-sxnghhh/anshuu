import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/profile-original.png";
import { HeroEffects } from "@/components/hero-effects";

export default function HomePage() {
  return (
    <section aria-labelledby="name-title" className="hero home-hero">
      <HeroEffects />
      <div className="hero-side hero-side-left">
        <p className="eyebrow"><span />DEVELOPER · STUDENT · BUILDER</p>
      </div>
      <p className="hero-side hero-side-right">BASED IN INDIA · NEW THINGS TAKING SHAPE</p>
      <div className="hero-portrait">
        <Image
          alt="Portrait of Anshuu Singh"
          className="portrait-image"
          priority
          sizes="(max-width: 640px) 84vw, 560px"
          src={portrait}
        />
      </div>
      <div className="hero-content">
        <h1 className="hero-name" id="name-title">
          <span>Anshuu</span> <span>Singh</span>
        </h1>
        <h2 className="maintenance-title">Website under maintenance</h2>
        <p className="maintenance-return">Please come back in one week.</p>
        <Link className="button-pill" href="/personal-diary">
          My personal diary <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div aria-hidden="true" className="hero-foot">
        <span className="scroll-cue"><span />ANSHUU SINGH · PERSONAL NOTEBOOK</span>
        <span>PLEASE COME BACK IN ONE WEEK</span>
      </div>
    </section>
  );
}
