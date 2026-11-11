"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Material } from "three";

export function HeroEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    let stop: (() => void) | undefined;

    async function initializeScene() {
      try {
        const THREE = await import("three");
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent) return;
        const host: HTMLElement = parent;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
        camera.position.z = 9;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        const installation = new THREE.Group();
        scene.add(installation);
        const materials: Material[] = [];
        const geometries: BufferGeometry[] = [];

        const amber = new THREE.MeshBasicMaterial({
          color: 0xd07a4d,
          opacity: 0.82,
          transparent: true,
          wireframe: true,
        });
        const ivory = new THREE.MeshBasicMaterial({
          color: 0xeeeae2,
          opacity: 0.46,
          transparent: true,
          wireframe: true,
        });
        materials.push(amber, ivory);

        for (const [index, side] of [-1, 1].entries()) {
          const ringGeometry = new THREE.TorusGeometry(
            index === 0 ? 1.05 : 0.72,
            0.007,
            5,
            112,
          );
          geometries.push(ringGeometry);
          const ring = new THREE.Mesh(ringGeometry, index === 0 ? amber : ivory);
          ring.position.set(side * 2.15, index === 0 ? 0.45 : -0.42, -0.5);
          ring.rotation.set(index === 0 ? 0.9 : 0.42, side * 0.5, side * 0.32);
          ring.userData.motionSpeed = side;
          installation.add(ring);

          const crystalGeometry = new THREE.IcosahedronGeometry(
            index === 0 ? 0.34 : 0.25,
            1,
          );
          geometries.push(crystalGeometry);
          const crystal = new THREE.Mesh(
            crystalGeometry,
            index === 0 ? ivory : amber,
          );
          crystal.position.set(side * 2.15, index === 0 ? 0.45 : -0.42, 0);
          crystal.userData.motionSpeed = -side;
          installation.add(crystal);
        }

        const motePositions = new Float32Array(180 * 3);
        for (let index = 0; index < 180; index += 1) {
          const seed = index + 1;
          motePositions[index * 3] = (Math.sin(seed * 127.1) * 0.5 + 0.5) * 10 - 5;
          motePositions[index * 3 + 1] = (Math.sin(seed * 311.7) * 0.5 + 0.5) * 6 - 3;
          motePositions[index * 3 + 2] = -1.5 + (Math.sin(seed * 74.7) * 0.5 + 0.5) * 2;
        }
        const motesGeometry = new THREE.BufferGeometry();
        motesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(motePositions, 3),
        );
        geometries.push(motesGeometry);
        const motesMaterial = new THREE.PointsMaterial({
          color: 0xc3a58f,
          opacity: 0.55,
          size: 0.026,
          transparent: true,
          sizeAttenuation: true,
        });
        materials.push(motesMaterial);
        scene.add(new THREE.Points(motesGeometry, motesMaterial));

        let frame = 0;
        let motionEnabled =
          document.documentElement.dataset.motion !== "off" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let targetX = 0;
        let targetY = 0;

        function render(time: number) {
          installation.rotation.y += (targetX - installation.rotation.y) * 0.025;
          installation.rotation.x += (targetY - installation.rotation.x) * 0.025;
          if (motionEnabled) {
            installation.children.forEach((object, index) => {
              const speed = Number(object.userData.motionSpeed ?? 1);
              object.rotation.x += speed * 0.006;
              object.rotation.y += speed * (index % 2 === 0 ? 0.012 : -0.009);
              object.rotation.z += speed * (index % 2 === 0 ? 0.003 : -0.002);
            });
            installation.position.y = Math.sin(time * 0.0012) * 0.09;
          }
          renderer.render(scene, camera);
        }

        function animate(time: number) {
          if (!active || !motionEnabled) return;
          render(time);
          frame = window.requestAnimationFrame(animate);
        }

        function startAnimation() {
          if (!motionEnabled || frame) return;
          frame = window.requestAnimationFrame(animate);
        }

        function handleMotionChange() {
          motionEnabled =
            document.documentElement.dataset.motion !== "off" &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (motionEnabled) {
            startAnimation();
          } else {
            window.cancelAnimationFrame(frame);
            frame = 0;
            render(0);
          }
        }

        function handlePointerMove(event: PointerEvent) {
          const bounds = host.getBoundingClientRect();
          targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.12;
          targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.08;
        }

        function resize() {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          camera.aspect = width / height;
          camera.position.z = width < 600 ? 11 : width < 900 ? 10 : 9;
          installation.scale.setScalar(width < 600 ? 0.62 : width < 900 ? 0.82 : 1);
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          if (!motionEnabled) render(0);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        host.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("anshuu-portfolio-motion-change", handleMotionChange);
        window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
          "change",
          handleMotionChange,
        );
        resize();
        render(0);
        startAnimation();

        stop = () => {
          resizeObserver.disconnect();
          host.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener(
            "anshuu-portfolio-motion-change",
            handleMotionChange,
          );
          window.matchMedia("(prefers-reduced-motion: reduce)").removeEventListener(
            "change",
            handleMotionChange,
          );
          window.cancelAnimationFrame(frame);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer.dispose();
        };
      } catch (error) {
        console.error("Unable to initialize the portfolio's 3D scene.", error);
      }
    }

    void initializeScene();

    return () => {
      active = false;
      stop?.();
    };
  }, []);

  return <canvas aria-hidden="true" className="hero-effects" ref={canvasRef} />;
}
