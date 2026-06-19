import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useWorldStore } from '../store/worldStore';
import { WORLD_IDS, WORLD_REGISTRY } from '../lib/constants';

const EXHIBITS = WORLD_REGISTRY.filter((w) => w.id !== WORLD_IDS.EXHIBITION);

function Pedestal({ entry, index, total }: { entry: typeof EXHIBITS[number]; index: number; total: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const navigate = useNavigate();

  const angle = (index / total) * Math.PI * 2;
  const radius = 3.5;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const routeMap: Record<string, string> = {
    the_drift: '/',
    nebula_heart: '/nebula',
    singularity: '/singularity',
    solar_sail: '/solar',
  };

  useFrame((_, delta) => {
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[x, -0.5, z]}>
      {/* Pedestal column */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.6, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Pedestal top */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Exhibit orb — clickable */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh
          ref={glowRef}
          position={[0, 0.7, 0]}
          onClick={() => navigate(routeMap[entry.id] || '/')}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color={entry.color}
            emissive={entry.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {entry.label}
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 0.95, 0]}
        fontSize={0.08}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {entry.subtitle}
      </Text>

      {/* Spotlight */}
      <pointLight position={[0, 1.5, 0.8]} intensity={0.4} color={entry.color} distance={3} />
    </group>
  );
}

function CentralDisplay() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15;
      ringRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={ringRef}>
          <torusGeometry args={[1.2, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#c0a060"
            emissive="#c0a060"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </Float>

      {/* Central floating text */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.25}
        color="#c0a060"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        INTERSTELLAR DRIFT
      </Text>

      <pointLight position={[0, 1, 0]} intensity={0.6} color="#c0a060" distance={5} />
    </group>
  );
}

function AmbientDust() {
  const count = 300;
  const meshRef = useRef<THREE.Points>(null);

  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#c0a060"
        size={0.02}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Exhibition() {
  const setWorld = useWorldStore((s) => s.setWorld);

  useEffect(() => {
    setWorld(WORLD_IDS.EXHIBITION);
  }, [setWorld]);

  return (
    <>
      <color attach="background" args={['#08080c']} />
      <ambientLight intensity={0.15} />
      <CentralDisplay />
      {EXHIBITS.map((entry, i) => (
        <Pedestal key={entry.id} entry={entry} index={i} total={EXHIBITS.length} />
      ))}
      <AmbientDust />
      <fog attach="fog" args={['#08080c', 5, 15]} />
    </>
  );
}
