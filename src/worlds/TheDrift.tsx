import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';
import { WORLD_IDS } from '../lib/constants';

function DriftParticles() {
  const count = 2000;
  const meshRef = useRef<THREE.Points>(null);

  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);
    vel[i * 3] = (Math.random() - 0.5) * 0.002;
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  useFrame(() => {
    if (!meshRef.current) return;
    const positionAttr = meshRef.current.geometry.attributes.position;
    const p = positionAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      p[i * 3] += vel[i * 3];
      p[i * 3 + 1] += vel[i * 3 + 1];
      p[i * 3 + 2] += vel[i * 3 + 2];
      const r = Math.sqrt(p[i * 3] ** 2 + p[i * 3 + 1] ** 2 + p[i * 3 + 2] ** 2);
      if (r > 8) {
        const scale = 2 / r;
        p[i * 3] *= scale;
        p[i * 3 + 1] *= scale;
        p[i * 3 + 2] *= scale;
      }
    }
    positionAttr.needsUpdate = true;
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
      </bufferGeometry>
      <pointsMaterial
        color="#7b68ee"
        size={0.04}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function TheDrift() {
  const setWorld = useWorldStore((s) => s.setWorld);

  useEffect(() => {
    setWorld(WORLD_IDS.THE_DRIFT);
  }, [setWorld]);

  return (
    <>
      <color attach="background" args={['#0a0015']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <DriftParticles />
    </>
  );
}
