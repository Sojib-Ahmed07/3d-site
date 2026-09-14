"use client";

/**
 * BathBottleScene.jsx
 * ---------------------------------------------------------------
 * React Three Fiber recreation of a two-bottle bath & body pump
 * bottle product shot: frosted rounded-rect bodies, light-blue
 * gel fill, white pump tops, a circular "100% bath&body" badge,
 * a reflective floor, and a soft studio backdrop.
 *
 * FIDELITY NOTE
 * A single photo has no depth data or material scan behind it,
 * so this is a close, hand-tuned stylistic recreation rather than
 * a measured, pixel-exact copy. Every shape/color below is a prop
 * or a constant you can nudge — see the bottom of the file.
 *
 * DEPENDENCIES
 *   npm install three @react-three/fiber @react-three/drei
 *
 * USAGE (Next.js App Router — must be dynamically imported with
 * ssr:false, since WebGL/canvas only exists in the browser):
 *
 *   // app/page.js
 *   "use client";
 *   import dynamic from "next/dynamic";
 *   const BathBottleScene = dynamic(
 *     () => import("../components/BathBottleScene"),
 *     { ssr: false }
 *   );
 *   export default function Page() {
 *     return <BathBottleScene />;
 *   }
 * ---------------------------------------------------------------
 */

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    RoundedBox,
    MeshTransmissionMaterial,
    MeshReflectorMaterial,
    ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------ */
/*  Label texture, drawn on a canvas so no external font/image   */
/*  file is required. One texture, reused by both bottles.       */
/* ------------------------------------------------------------ */
function useLabelTexture() {
    return useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 512, 512);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.strokeStyle = "rgba(255,255,255,0.85)";

        // outer ring
        ctx.beginPath();
        ctx.arc(256, 195, 148, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // small leaf mark
        ctx.save();
        ctx.translate(256, 95);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(34, -6, 50, 26, 0, 58);
        ctx.bezierCurveTo(-50, 26, -34, -6, 0, 0);
        ctx.fill();
        ctx.restore();

        // "100%"
        ctx.font = "700 56px Georgia, 'Times New Roman', serif";
        ctx.fillText("100%", 256, 205);

        // divider
        ctx.beginPath();
        ctx.moveTo(170, 228);
        ctx.lineTo(342, 228);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // "bath&body" script
        ctx.font = "italic 500 48px Georgia, 'Times New Roman', serif";
        ctx.fillText("bath&body", 256, 288);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        return texture;
    }, []);
}

/* ------------------------------------------------------------ */
/*  Pump top: collar + neck + press actuator + angled nozzle,    */
/*  built from primitives.                                       */
/* ------------------------------------------------------------ */
function Pump({ scale = 1 }) {
    return (
        <group scale={scale}>
            <mesh castShadow>
                <cylinderGeometry args={[0.115, 0.13, 0.07, 32]} />
                <meshStandardMaterial color="#f6f7f8" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.085, 0.1, 0.045, 32]} />
                <meshStandardMaterial color="#f6f7f8" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.32, 0]} castShadow>
                <cylinderGeometry args={[0.042, 0.048, 0.48, 20]} />
                <meshStandardMaterial color="#f6f7f8" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.6, 0.015]} rotation={[0.1, 0, 0]} castShadow>
                <sphereGeometry args={[0.095, 24, 24]} />
                <meshStandardMaterial color="#f6f7f8" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.59, 0.16]} rotation={[Math.PI / 2.3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.034, 0.22, 20]} />
                <meshStandardMaterial color="#f6f7f8" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.525, 0.265]} rotation={[Math.PI / 2.3, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.022, 0.02, 20]} />
                <meshStandardMaterial color="#d7d9da" roughness={0.5} />
            </mesh>
        </group>
    );
}

/* ------------------------------------------------------------ */
/*  Bottle: rounded-rect body, inset liquid volume, label, pump. */
/* ------------------------------------------------------------ */
function Bottle({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    width = 0.6,
    height = 1.3,
    depth = 0.4,
    fill = 0.7,
    liquidColor = "#5b9bb8",
    pumpScale = 1,
    labelTexture,
}) {
    const radius = Math.min(width, depth) * 0.17;
    const liquidH = height * fill;

    return (
        <group position={position} rotation={rotation}>
            {/* body */}
            <RoundedBox
                args={[width, height, depth]}
                radius={radius}
                smoothness={6}
                position={[0, height / 2, 0]}
                castShadow
                receiveShadow
            >
                <MeshTransmissionMaterial
                    transmission={1}
                    thickness={0.4}
                    roughness={0.08}
                    ior={1.45}
                    chromaticAberration={0.02}
                    distortion={0.04}
                    distortionScale={0.15}
                    temporalDistortion={0}
                    samples={6}
                    resolution={256}
                    color="#eef4f6"
                    clearcoat={0.15}
                />
            </RoundedBox>

            {/* liquid */}
            <RoundedBox
                args={[width - 0.055, liquidH, depth - 0.055]}
                radius={Math.max(radius - 0.02, 0.015)}
                smoothness={6}
                position={[0, liquidH / 2 + 0.028, 0]}
            >
                <meshPhysicalMaterial
                    color={liquidColor}
                    transmission={0.85}
                    roughness={0.18}
                    thickness={0.4}
                    ior={1.33}
                    transparent
                    opacity={0.92}
                />
            </RoundedBox>

            {/* label */}
            <mesh position={[0, height * 0.4, depth / 2 + 0.003]}>
                <planeGeometry args={[width * 0.62, width * 0.62]} />
                <meshBasicMaterial map={labelTexture} transparent toneMapped={false} />
            </mesh>

            {/* pump */}
            <group position={[0, height, 0]}>
                <Pump scale={pumpScale} />
            </group>
        </group>
    );
}

/* ------------------------------------------------------------ */
/*  Floor: soft reflective surface, like the studio-shot ground. */
/* ------------------------------------------------------------ */
function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[24, 24]} />
            <MeshReflectorMaterial
                blur={[350, 90]}
                resolution={1024}
                mixBlur={1}
                mixStrength={12}
                roughness={1}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#e8eaeb"
                metalness={0.05}
            />
        </mesh>
    );
}

/* ------------------------------------------------------------ */
/*  Backdrop: soft, low-detail stand-ins for the stacked towels  */
/*  and wire basket behind the bottles in the reference photo.   */
/* ------------------------------------------------------------ */
function Backdrop() {
    const towel = "#f4f4f3";
    return (
        <group>
            <group position={[-1.9, 0, -1.4]} rotation={[0, 0.35, 0]}>
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={i} position={[0, 0.075 + i * 0.15, 0]} receiveShadow>
                        <boxGeometry args={[1.05, 0.13, 0.75]} />
                        <meshStandardMaterial color={towel} roughness={0.95} />
                    </mesh>
                ))}
            </group>

            <mesh position={[1.5, 0.45, -1.7]} rotation={[0, -0.4, 0]} receiveShadow>
                <boxGeometry args={[0.85, 0.45, 0.65]} />
                <meshStandardMaterial color={towel} roughness={0.95} />
            </mesh>

            <mesh position={[1.95, 0.32, -1.15]} rotation={[0, -0.55, 0]}>
                <boxGeometry args={[0.55, 0.62, 0.55]} />
                <meshStandardMaterial color="#c7cacc" roughness={0.6} wireframe />
            </mesh>

            <mesh position={[0, 1.4, -2.4]}>
                <planeGeometry args={[8, 4]} />
                <meshStandardMaterial color="#eceeef" roughness={1} />
            </mesh>
        </group>
    );
}

/* ------------------------------------------------------------ */
/*  Scene                                                         */
/* ------------------------------------------------------------ */
export default function BathBottleScene() {
    const labelTexture = useLabelTexture();

    return (
        <div style={{ width: "100%", height: "100vh", background: "#e9ebec" }}>
            <Canvas shadows camera={{ position: [1.0, 1.15, 2.7], fov: 32 }} gl={{ antialias: true }}>
                <color attach="background" args={["#e9ebec"]} />
                <fog attach="fog" args={["#e9ebec", 4, 11]} />

                <ambientLight intensity={0.55} />
                <directionalLight
                    position={[2.2, 4, 2]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    shadow-bias={-0.0004}
                />
                <directionalLight position={[-3, 2.2, -1.5]} intensity={0.35} />
                <pointLight position={[0, 1.8, 2]} intensity={0.2} />

                <Environment preset="studio" />

                <Bottle
                    position={[0.32, 0, 0.22]}
                    rotation={[0, -0.32, 0]}
                    width={0.6}
                    height={1.32}
                    depth={0.4}
                    fill={0.58}
                    liquidColor="#5b9bb8"
                    pumpScale={1}
                    labelTexture={labelTexture}
                />

                <Bottle
                    position={[-0.55, 0, -0.35]}
                    rotation={[0, 0.25, 0]}
                    width={0.44}
                    height={0.98}
                    depth={0.3}
                    fill={0.68}
                    liquidColor="#6ba7c2"
                    pumpScale={0.8}
                    labelTexture={labelTexture}
                />

                <Floor />
                <Backdrop />
                <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={6} blur={2.2} far={2} />

                <OrbitControls
                    enablePan={false}
                    minDistance={1.6}
                    maxDistance={5}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                />
            </Canvas>
        </div>
    );
}

/**
 * QUICK TWEAKS
 * - Liquid tint:      liquidColor prop on <Bottle>
 * - Fill level:        fill prop (0–1) on <Bottle>
 * - Bottle size:        width / height / depth props
 * - Camera framing:     camera={{ position, fov }} on <Canvas>
 * - Spin the bottles:    add autoRotate autoRotateSpeed={0.6} to <OrbitControls>
 */