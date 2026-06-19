import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';
import { WORLD_IDS } from '../lib/constants';

const WARM_COLORS: [number, number, number][] = [
  [1, 0.55, 0.1],
  [1, 0.42, 0.1],
  [1, 0.7, 0.15],
  [1, 0.85, 0.3],
  [1, 0.5, 0.05],
];

function SolarParticles() {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const siz = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 8 + Math.random() * 0.3;
    const offset = Math.random() * 0.5;
    pos[i * 3] = Math.cos(t + offset) * (4 + Math.sin(t * 0.5) * 1);
    pos[i * 3 + 1] = Math.sin(t * 3 + offset) * 2;
    pos[i * 3 + 2] = Math.sin(t + offset) * 3;
    const c = WARM_COLORS[i % WARM_COLORS.length];
    col[i * 3] = c[0];
    col[i * 3 + 1] = c[1] + Math.random() * 0.2;
    col[i * 3 + 2] = c[2] + Math.random() * 0.1;
    siz[i] = 0.03 + Math.random() * 0.06;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    meshRef.current.rotation.y += delta * 0.05;
    const sizeAttr = meshRef.current.geometry.attributes.size;
    if (sizeAttr) {
      const s = sizeAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        s[i] = siz[i] + Math.sin(timeRef.current * 0.5 + i * 0.01) * 0.02;
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={siz} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function SolarSail() {
  const setWorld = useWorldStore((s) => s.setWorld);

  useEffect(() => {
    setWorld(WORLD_IDS.SOLAR_SAIL);
  }, [setWorld]);

  return (
    <>
      <color attach="background" args={['#0d0800']} />
      <SolarParticles />
      <ambientLight intensity={0.3} color="#ff8833" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#ff8833" />
    </>
  );
}
