"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Material } from "three";

export function DiaryScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    let disposeScene: (() => void) | undefined;

    async function initializeScene() {
      try {
        const THREE = await import("three");
        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent) return;
        const host: HTMLElement = parent;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        scene.add(new THREE.AmbientLight(0xffead5, 2));
        const amberLight = new THREE.PointLight(0xd07a4d, 25, 16);
        amberLight.position.set(-3, 3, 4);
        scene.add(amberLight);
        const paperLight = new THREE.PointLight(0xd8c6a9, 18, 14);
        paperLight.position.set(3, -2, 3);
        scene.add(paperLight);

        const book = new THREE.Group();
        scene.add(book);
        const geometries: BufferGeometry[] = [];
        const materials: Material[] = [];
        const coverMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x7d4329,
          metalness: 0.24,
          roughness: 0.36,
          clearcoat: 0.48,
        });
        const pageMaterial = new THREE.MeshStandardMaterial({
          color: 0xe9dfcf,
          roughness: 0.8,
          side: THREE.DoubleSide,
        });
        const pageEdgeMaterial = new THREE.MeshStandardMaterial({
          color: 0xb9a68c,
          roughness: 0.72,
        });
        const inkMaterial = new THREE.MeshBasicMaterial({
          color: 0x987e61,
          transparent: true,
          opacity: 0.44,
        });
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xd07a4d,
          transparent: true,
          opacity: 0.28,
        });
        materials.push(coverMaterial, pageMaterial, pageEdgeMaterial, inkMaterial, orbitMaterial);

        const coverGeometry = new THREE.BoxGeometry(1.03, 0.065, 1.42);
        const stackGeometry = new THREE.BoxGeometry(1.94, 0.07, 1.34);
        const pageGeometry = new THREE.PlaneGeometry(0.94, 1.3);
        const lineGeometry = new THREE.BoxGeometry(0.7, 0.006, 0.002);
        const spineGeometry = new THREE.BoxGeometry(0.1, 0.09, 1.42);
        geometries.push(coverGeometry, stackGeometry, pageGeometry, lineGeometry, spineGeometry);

        const leftCover = new THREE.Mesh(coverGeometry, coverMaterial);
        leftCover.position.set(-0.52, -0.035, 0);
        book.add(leftCover);
        const rightCover = new THREE.Mesh(coverGeometry, coverMaterial);
        rightCover.position.set(0.52, -0.035, 0);
        book.add(rightCover);
        const pageStack = new THREE.Mesh(stackGeometry, pageEdgeMaterial);
        pageStack.position.set(0, 0.012, 0.015);
        book.add(pageStack);
        const leftPage = new THREE.Mesh(pageGeometry, pageMaterial);
        leftPage.position.set(-0.5, 0.055, 0.06);
        book.add(leftPage);
        const rightPage = new THREE.Mesh(pageGeometry, pageMaterial);
        rightPage.position.set(0.5, 0.055, 0.06);
        book.add(rightPage);
        const spine = new THREE.Mesh(spineGeometry, coverMaterial);
        spine.position.set(0, -0.005, -0.01);
        book.add(spine);

        for (let index = 0; index < 5; index += 1) {
          const line = new THREE.Mesh(lineGeometry, inkMaterial);
          line.position.set(-0.48, 0.42 - index * 0.16, 0.065);
          book.add(line);
          const rightLine = new THREE.Mesh(lineGeometry, inkMaterial);
          rightLine.position.set(0.48, 0.42 - index * 0.16, 0.065);
          book.add(rightLine);
        }

        const turningPage = new THREE.Group();
        turningPage.position.set(0, 0.06, 0.075);
        const turningSheet = new THREE.Mesh(pageGeometry, pageMaterial);
        turningSheet.position.x = 0.47;
        turningPage.add(turningSheet);
        book.add(turningPage);

        const orbitGeometry = new THREE.TorusGeometry(2.2, 0.005, 6, 160);
        geometries.push(orbitGeometry);
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.set(0.88, 0.2, 0.14);
        scene.add(orbit);

        const positions = new Float32Array(170 * 3);
        for (let index = 0; index < 170; index += 1) {
          const seed = index + 1;
          positions[index * 3] = (Math.sin(seed * 127.1) * 0.5 + 0.5) * 9 - 4.5;
          positions[index * 3 + 1] = (Math.sin(seed * 311.7) * 0.5 + 0.5) * 6 - 3;
          positions[index * 3 + 2] = -2 + (Math.sin(seed * 74.7) * 0.5 + 0.5) * 3;
        }
        const moteGeometry = new THREE.BufferGeometry();
        moteGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometries.push(moteGeometry);
        const moteMaterial = new THREE.PointsMaterial({
          color: 0xd9b48c,
          size: 0.022,
          transparent: true,
          opacity: 0.48,
        });
        materials.push(moteMaterial);
        scene.add(new THREE.Points(moteGeometry, moteMaterial));

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let motionEnabled =
          document.documentElement.dataset.motion !== "off" &&
          !reducedMotion.matches;
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;

        function render(time: number) {
          if (motionEnabled) {
            book.rotation.y += (pointerX - book.rotation.y) * 0.03;
            book.rotation.x += (pointerY - book.rotation.x) * 0.03;
            book.position.y = Math.sin(time * 0.001) * 0.08;
            turningPage.rotation.y = -Math.max(0, Math.sin(time * 0.00017)) * Math.PI;
            orbit.rotation.z += 0.00045;
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

        function syncMotion() {
          motionEnabled =
            document.documentElement.dataset.motion !== "off" &&
            !reducedMotion.matches;
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
          pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.2;
          pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.14;
        }

        function resize() {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          camera.aspect = width / height;
          camera.position.z = width < 600 ? 10 : width < 900 ? 9 : 8;
          book.scale.setScalar(width < 600 ? 0.64 : width < 900 ? 0.82 : 1);
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          if (!motionEnabled) render(0);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        host.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("anshuu-portfolio-motion-change", syncMotion);
        reducedMotion.addEventListener("change", syncMotion);
        resize();
        render(0);
        startAnimation();

        disposeScene = () => {
          resizeObserver.disconnect();
          host.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("anshuu-portfolio-motion-change", syncMotion);
          reducedMotion.removeEventListener("change", syncMotion);
          window.cancelAnimationFrame(frame);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer.dispose();
        };
      } catch (error) {
        console.error("Unable to initialize the notebook's 3D scene.", error);
      }
    }

    void initializeScene();
    return () => {
      active = false;
      disposeScene?.();
    };
  }, []);

  return <canvas aria-hidden="true" className="diary-scene" ref={canvasRef} />;
}
