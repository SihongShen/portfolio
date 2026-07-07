"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Generative "space clutter" behind the home terminal: a random arrangement of
// wireframe solids, rings, polylines and point clusters, re-rolled on every
// page load, drifting slowly with a touch of pointer parallax.

const PALETTE = [0x54efea, 0x51ccdc, 0xd8fffb];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

function makeMaterialColor(): THREE.Color {
  return new THREE.Color(pick(PALETTE));
}

function lineMaterial(opacity: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: makeMaterialColor(),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function makeWireSolid(): THREE.Object3D {
  const detail = Math.random() < 0.5 ? 0 : 1;
  const geometry = new THREE.IcosahedronGeometry(rand(0.6, 1.6), detail);
  const material = new THREE.MeshBasicMaterial({
    color: makeMaterialColor(),
    wireframe: true,
    transparent: true,
    opacity: rand(0.2, 0.5),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.Mesh(geometry, material);
}

function makeRing(): THREE.Object3D {
  const group = new THREE.Group();
  const ringCount = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < ringCount; i++) {
    const radius = rand(0.7, 2.2);
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let s = 0; s <= segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const ring = new THREE.Line(geometry, lineMaterial(rand(0.3, 0.65)));
    ring.rotation.set(rand(0, Math.PI), rand(0, Math.PI), 0);
    group.add(ring);
  }
  return group;
}

function makePolyline(): THREE.Object3D {
  const points: THREE.Vector3[] = [];
  const steps = Math.floor(rand(4, 9));
  const cursor = new THREE.Vector3();
  for (let i = 0; i < steps; i++) {
    points.push(cursor.clone());
    cursor.add(new THREE.Vector3(rand(-1.4, 1.4), rand(-1.4, 1.4), rand(-0.7, 0.7)));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, lineMaterial(rand(0.3, 0.6)));
}

function makeCluster(): THREE.Object3D {
  const count = Math.floor(rand(30, 110));
  const positions = new Float32Array(count * 3);
  const spread = rand(0.6, 1.8);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = rand(-spread, spread);
    positions[i * 3 + 1] = rand(-spread, spread);
    positions[i * 3 + 2] = rand(-spread, spread);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: makeMaterialColor(),
    size: rand(0.03, 0.08),
    transparent: true,
    opacity: rand(0.35, 0.7),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  return new THREE.Points(geometry, material);
}

const BUILDERS = [makeWireSolid, makeRing, makePolyline, makeCluster];

interface Drifter {
  object: THREE.Object3D;
  rotationSpeed: THREE.Vector3;
  baseY: number;
  floatPhase: number;
  floatAmplitude: number;
  floatSpeed: number;
}

export default function CosmicClutter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 26);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0, 15);

    // Fresh composition on every load: count, types, placement all random.
    // The terminal covers the center of the screen, so objects are placed on a
    // ring hugging the visible border at their own depth.
    const group = new THREE.Group();
    const drifters: Drifter[] = [];
    const objectCount = Math.floor(rand(1, 4)) + (isMobile ? 7 : 12);
    for (let i = 0; i < objectCount; i++) {
      const object = pick(BUILDERS)();

      const z = rand(-6, 8);
      const distanceToCamera = camera.position.z - z;
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distanceToCamera;
      const halfWidth = halfHeight * camera.aspect;
      const angle = rand(0, Math.PI * 2);
      const radiusFactor = rand(0.72, 1.08);
      object.position.set(
        Math.cos(angle) * halfWidth * radiusFactor,
        Math.sin(angle) * halfHeight * radiusFactor,
        z
      );
      object.rotation.set(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));
      object.scale.setScalar(rand(0.6, 1.8));

      group.add(object);
      drifters.push({
        object,
        rotationSpeed: new THREE.Vector3(rand(-0.25, 0.25), rand(-0.25, 0.25), rand(-0.15, 0.15)),
        baseY: object.position.y,
        floatPhase: rand(0, Math.PI * 2),
        floatAmplitude: rand(0.15, 0.7),
        floatSpeed: rand(0.15, 0.5)
      });
    }
    scene.add(group);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const clock = new THREE.Clock();
    let elapsed = 0;
    let frame = 0;
    let paused = false;

    const renderFrame = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;

      for (const drifter of drifters) {
        drifter.object.rotation.x += drifter.rotationSpeed.x * delta;
        drifter.object.rotation.y += drifter.rotationSpeed.y * delta;
        drifter.object.rotation.z += drifter.rotationSpeed.z * delta;
        drifter.object.position.y =
          drifter.baseY + Math.sin(elapsed * drifter.floatSpeed + drifter.floatPhase) * drifter.floatAmplitude;
      }

      group.rotation.y += 0.006 * delta;

      // Gentle pointer parallax.
      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.03;
      camera.position.y += (-pointer.y * 1.1 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      frame = window.requestAnimationFrame(loop);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        window.cancelAnimationFrame(frame);
      } else if (paused && !reducedMotion) {
        paused = false;
        clock.getDelta();
        frame = window.requestAnimationFrame(loop);
      }
    };

    window.addEventListener("resize", onResize);
    if (reducedMotion) {
      // Static composition: render once, no animation loop, no parallax.
      renderFrame();
    } else {
      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("visibilitychange", onVisibilityChange);
      frame = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
