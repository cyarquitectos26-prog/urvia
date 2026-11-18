"use client";
import { assetPath } from "@/lib/paths";
/* Three.js scene objects are deliberately mutated by the render loop and texture loader. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { calculateBillboardViewability, recordCityEvent } from "@/lib/city/analytics";
import type { CityQuality, CityScreen, CityStory } from "@/lib/city/model";

export interface CityDrive { forward: number; side: number }
export interface CityPosition { x: number; z: number; yaw: number }
interface SceneProps {
  screens: CityScreen[];
  quality: Exclude<CityQuality, "auto">;
  autoTour: boolean;
  focusScreenId: string | null;
  selectedScreenId: string | null;
  drive: React.RefObject<CityDrive>;
  onPosition: (position: CityPosition) => void;
  onSelect: (screenId: string) => void;
  onLookAt: (screenId: string | null) => void;
  onLowFps: () => void;
  onReady: () => void;
}

function fillImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement | HTMLVideoElement, width: number, height: number, phase: number) {
  const sourceWidth = image instanceof HTMLVideoElement ? image.videoWidth : image.naturalWidth;
  const sourceHeight = image instanceof HTMLVideoElement ? image.videoHeight : image.naturalHeight;
  const scale = Math.max(width / sourceWidth, height / sourceHeight) * (1.025 + Math.sin(phase * 0.4) * 0.022);
  const iw = sourceWidth * scale, ih = sourceHeight * scale;
  const drift = Math.sin(phase * 0.23) * Math.max(0, iw - width) * 0.2;
  ctx.drawImage(image, (width - iw) / 2 + drift, (height - ih) / 2, iw, ih);
}
function wrapTitle(ctx: CanvasRenderingContext2D, title: string, maxWidth: number, maxLines: number) {
  const words = title.split(" "); const lines: string[] = []; let line = "";
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; let last = lines[maxLines - 1]; while (ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1); lines[maxLines - 1] = `${last}…`; }
  return lines;
}
function drawCreative(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, story: CityStory, photo: HTMLImageElement | HTMLVideoElement | null, phase = 0) {
  const { width: w, height: h } = canvas;
  const grad = ctx.createLinearGradient(0, 0, w, h); grad.addColorStop(0, "#1e3347"); grad.addColorStop(0.62, "#112234"); grad.addColorStop(1, "#080d18");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  if (photo && (photo instanceof HTMLVideoElement ? photo.readyState >= 2 : photo.complete && photo.naturalWidth > 0)) fillImage(ctx, photo, w, h, story.type === "video" ? phase : 0);
  const shade = ctx.createLinearGradient(0, h * 0.25, 0, h); shade.addColorStop(0, "#06101900"); shade.addColorStop(0.55, "#07111aa6"); shade.addColorStop(1, "#040812f5");
  ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = story.classification === "sponsored" ? "#D4B286" : "#D4B286";
  ctx.fillRect(0, 0, 13, h);
  ctx.font = `700 ${Math.round(h * 0.04)}px Arial`; ctx.letterSpacing = "2px";
  ctx.fillText(story.kicker, w * 0.06, h * 0.105);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#ffffff";
  const titleSize = story.type === "district" ? h * 0.135 : h * 0.095;
  ctx.font = `500 ${Math.round(titleSize)}px Arial`;
  const lines = wrapTitle(ctx, story.title, w * 0.86, 2);
  const titleY = h * (story.price ? 0.69 : 0.75) - (lines.length - 1) * titleSize * 1.04;
  lines.forEach((line, i) => ctx.fillText(line, w * 0.06, titleY + i * titleSize * 1.04));
  ctx.fillStyle = "#d2e0e8"; ctx.font = `500 ${Math.round(h * 0.043)}px Arial`;
  ctx.fillText(story.subtitle.slice(0, 64), w * 0.06, h * 0.86);
  if (story.price) { ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(h * 0.067)}px Arial`; ctx.fillText(story.price, w * 0.06, h * 0.955); }
  if (story.type === "video") { ctx.fillStyle = "#ffffffcf"; ctx.beginPath(); ctx.arc(w * 0.84, h * 0.27, h * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#14212c"; ctx.beginPath(); ctx.moveTo(w * 0.82, h * 0.22); ctx.lineTo(w * 0.82, h * 0.32); ctx.lineTo(w * 0.88, h * 0.27); ctx.fill(); }
}

function CityBillboard({ screen, selected, lookedAt, cameraZ, quality, onSelect }: { screen: CityScreen; selected: boolean; lookedAt: boolean; cameraZ: number; quality: Exclude<CityQuality, "auto">; onSelect: (id: string) => void }) {
  const { placement, story } = screen; const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const animation = useRef<{ ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement; photo: HTMLImageElement | null; video: HTMLVideoElement | null; elapsed: number } | null>(null);
  useEffect(() => {
    let mounted = true;
    const canvas = document.createElement("canvas");
    const resolution = quality === "high" ? 1024 : quality === "medium" ? 768 : 512;
    canvas.width = resolution; canvas.height = Math.round(resolution * placement.dimensions[1] / placement.dimensions[0]);
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const next = new THREE.CanvasTexture(canvas); next.colorSpace = THREE.SRGBColorSpace; next.anisotropy = quality === "high" ? 4 : 2;
    drawCreative(ctx, canvas, story, null); next.needsUpdate = true;
    const video = story.videoSrc ? document.createElement("video") : null;
    if (video && story.videoSrc) { video.src = assetPath(story.videoSrc); video.preload = "none"; video.muted = true; video.loop = true; video.playsInline = true; }
    animation.current = { ctx, canvas, photo: null, video, elapsed: 0 };
    queueMicrotask(() => { if (mounted) setTexture(next); });
    const photo = new Image(); photo.crossOrigin = "anonymous";
    photo.onload = () => { if (!mounted) return; drawCreative(ctx, canvas, story, photo); next.needsUpdate = true; if (animation.current) animation.current.photo = photo; };
    photo.src = assetPath(story.image);
    return () => { mounted = false; video?.pause(); video?.removeAttribute("src"); next.dispose(); animation.current = null; };
  }, [placement.dimensions, quality, story]);
  useFrame((_, delta) => {
    const item = animation.current;
    if (story.type !== "video" || !item || !texture) return;
    const near = Math.abs(cameraZ - placement.position[2]) <= 38 && quality !== "low";
    if (item.video) { if (near && item.video.paused) void item.video.play().catch(() => {}); if (!near && !item.video.paused) item.video.pause(); }
    if (!near) return;
    item.elapsed += delta;
    if (item.elapsed > 0.11) { drawCreative(item.ctx, item.canvas, story, item.video?.readyState && item.video.readyState >= 2 ? item.video : item.photo, performance.now() / 1000); texture.needsUpdate = true; item.elapsed = 0; }
  });
  const [w, h] = placement.dimensions; const [x, y, z] = placement.position;
  const glow = selected || lookedAt; const accent = story.classification === "sponsored" ? "#D4B286" : story.type === "video" ? "#D4B286" : "#D4B286";
  return <group position={[x, y, z]} rotation={placement.rotation}>
    <mesh position={[0, 0, -0.05]}><boxGeometry args={[w + 0.31, h + 0.31, 0.27]} /><meshStandardMaterial color="#111b28" emissive={accent} emissiveIntensity={glow ? 0.6 : 0.18} metalness={0.6} roughness={0.28} /></mesh>
    <mesh position={[0, 0, 0.12]} onClick={e => { e.stopPropagation(); onSelect(placement.screenId); }} onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
      <planeGeometry args={[w, h]} /><meshBasicMaterial key={texture?.uuid || "empty"} map={texture} color={texture ? "#ffffff" : "#1e3141"} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
    {glow && <mesh position={[0, 0, -0.2]}><planeGeometry args={[w + 0.75, h + 0.75]} /><meshBasicMaterial color={accent} transparent opacity={0.1} depthWrite={false} /></mesh>}
    <mesh position={[0, -h / 2 - 0.3, 0.12]}><boxGeometry args={[w * 0.7, 0.07, 0.1]} /><meshBasicMaterial color={accent} /></mesh>
    {quality === "high" && placement.visibilityScore >= 90 && Math.abs(cameraZ - z) < 35 && <pointLight position={[0, 0, 1.2]} color={accent} intensity={1.3} distance={12} />}
  </group>;
}

function CityBuilding({ index, side, quality }: { index: number; side: -1 | 1; quality: Exclude<CityQuality, "auto"> }) {
  const x = side * 13.2, z = -index * 28 - 10, front = -index * 28;
  const height = 30 + ((index * 7 + (side > 0 ? 4 : 0)) % 12);
  const windowRef = useRef<THREE.InstancedMesh>(null);
  const sideWindowRef = useRef<THREE.InstancedMesh>(null);
  const rows = quality === "low" ? 5 : Math.floor((height - 5) / 3.6);
  const columns = quality === "low" ? 3 : 5;
  const count = rows * columns;
  useEffect(() => {
    if (!windowRef.current) return;
    const dummy = new THREE.Object3D(); const bright = new THREE.Color("#f0c68d"), dim = new THREE.Color("#32506b");
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const i = row * columns + col;
      dummy.position.set(x - 4.1 + col * (8.2 / Math.max(columns - 1, 1)), 5.7 + row * 3.55, front + 0.055);
      dummy.scale.set(1, 1, 1); dummy.updateMatrix(); windowRef.current.setMatrixAt(i, dummy.matrix);
      windowRef.current.setColorAt(i, (row * 11 + col * 7 + index * 3) % 5 < 2 ? bright : dim);
    }
    windowRef.current.instanceMatrix.needsUpdate = true;
    if (windowRef.current.instanceColor) windowRef.current.instanceColor.needsUpdate = true;
  }, [x, front, rows, columns, index]);
  useEffect(() => {
    if (!sideWindowRef.current) return;
    const dummy = new THREE.Object3D(); const warm = new THREE.Color("#eab57a"), blue = new THREE.Color("#60889a");
    for (let row = 0; row < rows; row++) for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      dummy.position.set(side * 7.65, 5.7 + row * 3.55, front - 3.4 - col * 5.8);
      dummy.rotation.set(0, side * Math.PI / 2, 0); dummy.updateMatrix(); sideWindowRef.current.setMatrixAt(i, dummy.matrix);
      sideWindowRef.current.setColorAt(i, (row + col * 3 + index) % 4 ? blue : warm);
    }
    sideWindowRef.current.instanceMatrix.needsUpdate = true;
    if (sideWindowRef.current.instanceColor) sideWindowRef.current.instanceColor.needsUpdate = true;
  }, [side, front, rows, index]);
  const accent = index % 3 === 0 ? "#D4B286" : index % 3 === 1 ? "#D4B286" : "#677f9d";
  return <group>
    <mesh position={[x, height / 2, z]}><boxGeometry args={[11, height, 20]} /><meshStandardMaterial color={index % 2 ? "#213345" : "#253c4c"} metalness={0.18} roughness={0.7} /></mesh>
    <mesh position={[x, 2.1, front + 0.08]}><boxGeometry args={[10.4, 3.9, 0.12]} /><meshStandardMaterial color="#1e3b4a" emissive="#0d3a44" emissiveIntensity={0.34} metalness={0.7} roughness={0.2} /></mesh>
    <mesh position={[x - 5.35, height / 2, front + 0.1]}><boxGeometry args={[0.12, height, 0.15]} /><meshBasicMaterial color={accent} /></mesh>
    <mesh position={[x + 5.35, height / 2, front + 0.1]}><boxGeometry args={[0.12, height, 0.15]} /><meshBasicMaterial color={accent} /></mesh>
    <mesh position={[x, height + 0.25, z]}><boxGeometry args={[11.3, 0.5, 20.3]} /><meshStandardMaterial color="#273b4f" metalness={0.65} roughness={0.3} /></mesh>
    <instancedMesh ref={windowRef} args={[undefined, undefined, count]}><boxGeometry args={[1.28, 1.6, 0.06]} /><meshStandardMaterial color="#ffffff" vertexColors emissive="#7d664c" emissiveIntensity={0.45} metalness={0.15} roughness={0.25} /></instancedMesh>
    <instancedMesh ref={sideWindowRef} args={[undefined, undefined, rows * 3]}><boxGeometry args={[1.65, 1.55, 0.08]} /><meshStandardMaterial color="#ffffff" vertexColors emissive="#7197ab" emissiveIntensity={0.55} metalness={0.17} roughness={0.3} side={THREE.DoubleSide} /></instancedMesh>
    {quality !== "low" && <mesh position={[x, height / 2, z - 10.05]}><boxGeometry args={[10, height - 2, 0.07]} /><meshStandardMaterial color="#1b3141" metalness={0.68} roughness={0.18} transparent opacity={0.48} /></mesh>}
  </group>;
}

function StreetLights({ quality }: { quality: Exclude<CityQuality, "auto"> }) {
  const stations = quality === "low" ? [8, -48, -104, -160] : [8, -20, -48, -76, -104, -132, -160];
  return <>{stations.flatMap((z, i) => ([-1, 1] as const).map(side => <group key={`${side}-${z}`} position={[side * 7.85, 0, z]}>
    <mesh position={[0, 3.65, 0]}><cylinderGeometry args={[0.045, 0.075, 7.3, 6]} /><meshStandardMaterial color="#374b59" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[-side * 0.55, 7.25, 0]}><boxGeometry args={[1.15, 0.07, 0.08]} /><meshStandardMaterial color="#526777" /></mesh>
    <mesh position={[-side * 1.1, 7.13, 0]}><sphereGeometry args={[0.22, 8, 6]} /><meshBasicMaterial color="#ffe1aa" /></mesh>
    {i < 2 && <pointLight position={[-side * 1.1, 6.9, 0]} color="#ffc583" intensity={quality === "high" ? 1.6 : 0.9} distance={18} />}
  </group>))}</>;
}

function CityTraffic({ quality }: { quality: Exclude<CityQuality, "auto"> }) {
  const cars = useRef<Array<THREE.Group | null>>([]); const count = quality === "low" ? 3 : quality === "medium" ? 5 : 7;
  useFrame(({ clock }) => { cars.current.forEach((car, i) => { if (!car) return; const speed = 3.7 + i % 3; const t = (clock.elapsedTime * speed + i * 31) % 205; car.position.z = i % 2 ? 16 - t : -188 + t; }); });
  return <>{Array.from({ length: count }, (_, i) => <group ref={node => { cars.current[i] = node; }} key={i} position={[i % 2 ? 3.1 : -3.2, 0.34, -i * 28]} rotation={[0, i % 2 ? Math.PI : 0, 0]}>
    <mesh><boxGeometry args={[1.7, 0.55, 3.4]} /><meshStandardMaterial color={i % 3 === 0 ? "#e6d6a8" : i % 3 === 1 ? "#263c4b" : "#111a27"} metalness={0.55} roughness={0.3} /></mesh>
    <mesh position={[0, 0.47, -0.2]}><boxGeometry args={[1.35, 0.55, 1.7]} /><meshStandardMaterial color="#162938" metalness={0.75} roughness={0.2} /></mesh>
    {[-0.57, 0.57].map(x => <group key={x}><mesh position={[x, 0, -1.73]}><boxGeometry args={[0.27, 0.14, 0.05]} /><meshBasicMaterial color="#fff3d0" /></mesh><mesh position={[x, 0, 1.73]}><boxGeometry args={[0.3, 0.14, 0.05]} /><meshBasicMaterial color="#ff503a" /></mesh></group>)}
  </group>)}</>;
}

function CitySkyline() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true; let current: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(assetPath("/images/city-skyline.webp"), loaded => { if (!live) { loaded.dispose(); return; } loaded.colorSpace = THREE.SRGBColorSpace; current = loaded; setTexture(loaded); });
    return () => { live = false; current?.dispose(); };
  }, []);
  if (!texture) return null;
  return <mesh position={[0, 24, -207]}><planeGeometry args={[138, 77.8]} /><meshBasicMaterial map={texture} transparent opacity={0.64} depthWrite={false} fog={false} toneMapped={false} /></mesh>;
}

function CityEnvironment({ quality }: { quality: Exclude<CityQuality, "auto"> }) {
  return <>
    <color attach="background" args={["#060b14"]} /><fog attach="fog" args={["#08121e", 75, quality === "low" ? 145 : 235]} />
    <ambientLight intensity={1.15} color="#91abc8" /><hemisphereLight args={["#94acc4", "#132130", 1.4]} /><directionalLight position={[12, 28, 30]} intensity={0.72} color="#ffc58f" /><directionalLight position={[-12, 22, -65]} intensity={0.42} color="#a4b7c8" />
    <mesh position={[0, -0.22, -86]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#07101b" metalness={0.34} roughness={0.42} /></mesh>
    <mesh position={[0, -0.045, -82]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[13.2, 224]} /><meshStandardMaterial color="#1e2b35" metalness={0.46} roughness={0.34} /></mesh>
    {[0, -84, -168].map(z => <mesh key={`cross-street-${z}`} position={[0, -0.042, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[60, 8]} /><meshBasicMaterial color="#152531" /></mesh>)}
    {[-1, 1].flatMap(side => [[4, 30], [-80, -4], [-164, -88], [-194, -172]].map(([start, end]) => <group key={`${side}-${start}`}><mesh position={[side * 8.55, 0.16, (start + end) / 2]}><boxGeometry args={[4.1, 0.28, end - start]} /><meshStandardMaterial color="#303943" metalness={0.12} roughness={0.72} /></mesh><mesh position={[side * 6.55, 0.08, (start + end) / 2]}><boxGeometry args={[0.1, 0.12, end - start]} /><meshBasicMaterial color="#e5a578" /></mesh><mesh position={[side * 7.4, 0.31, (start + end) / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.25, end - start]} /><meshBasicMaterial color="#ff9d57" transparent opacity={0.18} /></mesh></group>))}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[i % 2 ? 0.25 : -0.25, -0.034, 22 - i * 10]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.1, 3.5]} /><meshBasicMaterial color="#d2bf92" transparent opacity={0.62} /></mesh>)}
    {[0, -84, -168].map(z => <group key={z}>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, -0.025, z + i * 1.1 - 3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[13, 0.54]} /><meshBasicMaterial color="#d5d6c8" transparent opacity={0.63} /></mesh>)}</group>)}
    {Array.from({ length: 7 }, (_, i) => ([-1, 1] as const).map(side => <group key={`reflection-${side}-${i}`}><mesh position={[side * 5.2, -0.029, -i * 28 + 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.9, 8]} /><meshBasicMaterial color={i % 2 ? "#b7c5ce" : "#D4B286"} transparent opacity={0.115} depthWrite={false} /></mesh><mesh position={[side * 4.4, -0.028, -i * 28 - 3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.45, 4.2]} /><meshBasicMaterial color="#d2dcde" transparent opacity={0.11} depthWrite={false} /></mesh></group>))}
    {Array.from({ length: 7 }, (_, i) => <group key={i}><CityBuilding index={i} side={-1} quality={quality} /><CityBuilding index={i} side={1} quality={quality} /></group>)}
    <group position={[0, 0, -13]}><mesh position={[-7.1, 6.3, 0]}><boxGeometry args={[0.14, 12.6, 0.28]} /><meshStandardMaterial color="#4c6975" metalness={0.72} roughness={0.25} /></mesh><mesh position={[7.1, 6.3, 0]}><boxGeometry args={[0.14, 12.6, 0.28]} /><meshStandardMaterial color="#4c6975" metalness={0.72} roughness={0.25} /></mesh><mesh position={[0, 12.6, 0]}><boxGeometry args={[14.2, 0.15, 0.28]} /><meshBasicMaterial color="#D4B286" /></mesh></group>
    <CitySkyline />
    <StreetLights quality={quality} /><CityTraffic quality={quality} />
  </>;
}

function CityCamera({ screens, autoTour, focusScreenId, drive, onPosition, onLookAt, onLowFps }: Pick<SceneProps, "screens" | "autoTour" | "focusScreenId" | "drive" | "onPosition" | "onLookAt" | "onLowFps">) {
  const { camera, gl } = useThree();
  const target = useRef({ x: 0, z: 28, yaw: 0, pitch: 0.12 });
  const orientation = useRef({ yaw: 0, pitch: 0.12 });
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const keys = useRef(new Set<string>());
  const lastReport = useRef(0); const sampled = useRef(0); const totalFrames = useRef(0); const slowWindows = useRef(0); const lowFpsReported = useRef(false);
  const dwell = useRef(new Map<string, number>()); const impressed = useRef(new Set<string>());
  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e: PointerEvent) => { dragging.current = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging.current) return; const dx = e.clientX - dragging.current.x, dy = e.clientY - dragging.current.y; target.current.yaw = THREE.MathUtils.clamp(target.current.yaw - dx * 0.0035, -0.68, 0.68); target.current.pitch = THREE.MathUtils.clamp(target.current.pitch - dy * 0.0023, -0.14, 0.6); dragging.current = { x: e.clientX, y: e.clientY }; };
    const up = () => { dragging.current = null; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); target.current.z = THREE.MathUtils.clamp(target.current.z + Math.sign(e.deltaY) * -3.7, -174, 29); };
    const keydown = (e: KeyboardEvent) => { if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.altKey || e.ctrlKey || e.metaKey) return; const k = e.key.toLowerCase(); if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { e.preventDefault(); keys.current.add(k); } };
    const keyup = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => { keys.current.clear(); dragging.current = null; drive.current.forward = 0; drive.current.side = 0; };
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup); window.addEventListener("blur", blur);
    return () => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("wheel", wheel); window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); window.removeEventListener("blur", blur); };
  }, [gl, drive]);
  useEffect(() => {
    const durations = dwell.current;
    return () => { for (const { placement, story } of screens) { const duration = durations.get(placement.screenId) || 0; if (duration >= 1.2) recordCityEvent({ name: "billboardViewTime", screenId: placement.screenId, promotionId: story.promotionId, value: Math.round(duration * 10) / 10 }); } durations.clear(); };
  }, [screens]);
  useEffect(() => { if (!focusScreenId) return; const requested = focusScreenId.split(":")[0]; if (requested === "START") { target.current.z = 28; target.current.x = 0; target.current.yaw = 0; target.current.pitch = 0.12; return; } const screen = screens.find(s => s.placement.screenId === requested); if (screen) { const distance = screen.placement.position[1] > 17 ? 31 : 24; target.current.z = THREE.MathUtils.clamp(screen.placement.position[2] + distance, -174, 29); target.current.x = 0; target.current.yaw = -Math.atan2(screen.placement.position[0], distance); target.current.pitch = Math.atan2(screen.placement.position[1] - 2.7, Math.hypot(screen.placement.position[0], distance)); } }, [focusScreenId, screens]);
  useFrame((state, delta) => {
    const t = target.current; const k = keys.current; const step = Math.min(delta, 0.05);
    const forward = Number(k.has("w") || k.has("arrowup")) - Number(k.has("s") || k.has("arrowdown")) + drive.current.forward;
    const side = Number(k.has("d") || k.has("arrowright")) - Number(k.has("a") || k.has("arrowleft")) + drive.current.side;
    t.z = THREE.MathUtils.clamp(t.z - (forward * 10 + (autoTour ? 2.7 : 0)) * step, -174, 29);
    t.x = THREE.MathUtils.clamp(t.x + side * 4.4 * step, -3.3, 3.3);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, t.x, 4.5, step);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, t.z, 3.8, step);
    camera.position.y = 2.7 + Math.sin(state.clock.elapsedTime * 7) * (Math.abs(forward) > 0 ? 0.028 : 0);
    orientation.current.yaw = THREE.MathUtils.damp(orientation.current.yaw, t.yaw, 4, step);
    orientation.current.pitch = THREE.MathUtils.damp(orientation.current.pitch, t.pitch, 4, step);
    camera.lookAt(camera.position.x - Math.sin(orientation.current.yaw) * 20, camera.position.y + Math.tan(orientation.current.pitch) * 20, camera.position.z - Math.cos(orientation.current.yaw) * 20);
    // Ignore suspended/background frames and asset warm-up; require two slow windows.
    if (!document.hidden && delta < 0.5 && state.clock.elapsedTime > 3) { sampled.current += delta; totalFrames.current++; }
    if (sampled.current > 5 && !lowFpsReported.current) { const fps = totalFrames.current / sampled.current; slowWindows.current = fps < 22 ? slowWindows.current + 1 : 0; if (slowWindows.current >= 2) { lowFpsReported.current = true; onLowFps(); } sampled.current = 0; totalFrames.current = 0; }
    lastReport.current += !document.hidden && delta < 0.5 ? delta : 0;
    if (lastReport.current < 0.25) return;
    const elapsed = lastReport.current; lastReport.current = 0;
    onPosition({ x: camera.position.x, z: camera.position.z, yaw: t.yaw });
    const forwardVector = new THREE.Vector3(); camera.getWorldDirection(forwardVector);
    let nearest: { id: string; distance: number } | null = null;
    for (const { placement, story } of screens) {
      const center = new THREE.Vector3(...placement.position);
      const distance = center.distanceTo(camera.position);
      const direction = center.clone().sub(camera.position).normalize();
      const angle = THREE.MathUtils.radToDeg(forwardVector.angleTo(direction));
      const projected = center.clone().project(camera);
      const visibility = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.86 && Math.abs(projected.y) < 0.83 ? 1 : 0;
      const prior = dwell.current.get(placement.screenId) || 0;
      const duration = visibility && distance < 65 && angle < 38 ? prior + elapsed : 0;
      if (duration === 0 && prior >= 1.2) recordCityEvent({ name: "billboardViewTime", screenId: placement.screenId, promotionId: story.promotionId, value: Math.round(prior * 10) / 10 });
      dwell.current.set(placement.screenId, duration);
      const result = calculateBillboardViewability({ cameraAngle: angle, distance, screenVisibility: visibility, duration });
      if (result.viewable && !impressed.current.has(placement.screenId)) { impressed.current.add(placement.screenId); recordCityEvent({ name: "billboardImpression", screenId: placement.screenId, promotionId: story.promotionId }); }
      if (visibility && angle < 14 && distance < 36 && (!nearest || distance < nearest.distance)) nearest = { id: placement.screenId, distance };
    }
    onLookAt(nearest?.id || null);
  });
  return null;
}

export function CityScene({ screens, quality, autoTour, focusScreenId, selectedScreenId, drive, onPosition, onSelect, onLookAt, onLowFps, onReady }: SceneProps) {
  const [cameraZ, setCameraZ] = useState(28); const [lookedAt, setLookedAt] = useState<string | null>(null);
  const visible = useMemo(() => screens.filter(s => Math.abs(cameraZ - s.placement.position[2]) < (quality === "low" ? 82 : 110)), [screens, cameraZ, quality]);
  return <Canvas camera={{ position: [0, 2.7, 28], fov: 68, near: 0.1, far: quality === "low" ? 160 : 260 }} dpr={quality === "low" ? 1 : quality === "medium" ? [1, 1.5] : [1, 2]} gl={{ antialias: quality !== "low", powerPreference: "high-performance" }} onCreated={onReady}>
    <CityEnvironment quality={quality} />
    {visible.map(screen => <CityBillboard key={screen.placement.id} screen={screen} quality={quality} cameraZ={cameraZ} selected={selectedScreenId === screen.placement.screenId} lookedAt={lookedAt === screen.placement.screenId} onSelect={onSelect} />)}
    <CityCamera screens={screens} autoTour={autoTour} focusScreenId={focusScreenId} drive={drive} onPosition={position => { setCameraZ(position.z); onPosition(position); }} onLookAt={id => { setLookedAt(id); onLookAt(id); }} onLowFps={onLowFps} />
  </Canvas>;
}
