import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CameraController from './common/CameraController';
import { useWorldStore } from '../store/worldStore';
import { WORLD_IDS } from '../lib/constants';

function NebulaParticles() {
  const count = 1500;
  const meshRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    // Flattened disc — Y spread is small
    const yOffset = (Math.random() - 0.5) * 1.2;
    pos[i * 3] = radius * Math.cos(theta);
    pos[i * 3 + 1] = yOffset;
    pos[i * 3 + 2] = radius * Math.sin(theta);
    // Start with pink-ish
    col[i * 3] = 1;
    col[i * 3 + 1] = 0.43 + Math.random() * 0.3;
    col[i * 3 + 2] = 0.78 + Math.random() * 0.2;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Slowly rotate the entire nebula
    meshRef.current.rotation.y += delta * 0.03;

    // Animate colors between pink (#ff6ec7) and cyan (#00f5ff)
    const geo = meshRef.current.geometry;
    const colAttr = geo.attributes.color;
    if (!colAttr) return;
    const c = colAttr.array as Float32Array;
    const mix = Math.sin(t * 0.3) * 0.5 + 0.5; // 0..1
    // Pink: (1, 0.43, 0.78)  Cyan: (0, 0.96, 1)
    const pinkR = 1, pinkG = 0.43, pinkB = 0.78;
    const cyanR = 0, cyanG = 0.96, cyanB = 1;
    for (let i = 0; i < count; i++) {
      c[i * 3] = THREE.MathUtils.lerp(pinkR, cyanR, mix);
      c[i * 3 + 1] = THREE.MathUtils.lerp(pinkG, cyanG, mix);
      c[i * 3 + 2] = THREE.MathUtils.lerp(pinkB, cyanB, mix);
    }
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={col}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function NebulaHeart() {
  const setWorld = useWorldStore((s) => s.setWorld);

  useEffect(() => {
    setWorld(WORLD_IDS.NEBULA_HEART);
  }, [setWorld]);

  return (
    <>
      <color attach="background" args={['#0d0018']} />
      <CameraController />
      <NebulaParticles />

      {/* Ambient glow */}
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff6ec7" />
      <pointLight position={[0, 0, -3]} intensity={0.3} color="#00f5ff" />
    </>
  );
}
