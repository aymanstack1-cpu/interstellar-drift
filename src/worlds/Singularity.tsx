import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CameraController from './common/CameraController';
import { useWorldStore } from '../store/worldStore';
import { WORLD_IDS } from '../lib/constants';

function SingularityGeometry() {
  const icosaRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (icosaRef.current) {
      icosaRef.current.rotation.x += delta * 0.2;
      icosaRef.current.rotation.y += delta * 0.3;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.15;
      torusRef.current.rotation.y += delta * 0.25;
      torusRef.current.rotation.z += delta * 0.1;
    }

    // Pulse the light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <group>
      {/* Central point light with pulsing intensity */}
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={1} color="#ffffff" />
      <ambientLight intensity={0.2} />

      {/* Rotating Icosahedron */}
      <mesh ref={icosaRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#444444"
          emissiveIntensity={0.3}
          wireframe
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* TorusKnot */}
      <mesh ref={torusRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[2, 0.4, 64, 8]} />
        <meshStandardMaterial
          color="#888888"
          emissive="#333333"
          emissiveIntensity={0.2}
          wireframe
          roughness={0.5}
          metalness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Distant grayscale particles
const particlePos = new Float32Array(800 * 3);
for (let i = 0; i < 800; i++) {
  const r = 3 + Math.random() * 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  particlePos[i * 3 + 2] = r * Math.cos(phi);
}

function DistantParticles() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={particlePos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#555555"
        size={0.03}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function Singularity() {
  const setWorld = useWorldStore((s) => s.setWorld);

  useEffect(() => {
    setWorld(WORLD_IDS.SINGULARITY);
  }, [setWorld]);

  return (
    <>
      <color attach="background" args={['#050508']} />
      <CameraController />
      <SingularityGeometry />
      <DistantParticles />
    </>
  );
}
