import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Float, Text } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { WORLD_REGISTRY } from '../lib/constants';

const ORB_RADIUS = 0.4;
const ORB_SPACING = 2.0;
const ORB_Y = 1.5;
const ORB_Z = -3;

function Orb({
  entry,
  index,
  onHover,
}: {
  entry: (typeof WORLD_REGISTRY)[number];
  index: number;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const hovered = useRef(false);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const routeMap: Record<string, string> = {
    the_drift: '/',
    nebula_heart: '/nebula',
    singularity: '/singularity',
    solar_sail: '/solar',
  };

  const path = routeMap[entry.id] || '/';

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    const targetScale = hovered.current ? 1.4 : 1;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.08
    );
    const targetEmissive = hovered.current ? 0.8 : 0.3;
    materialRef.current.emissiveIntensity +=
      (targetEmissive - materialRef.current.emissiveIntensity) * 0.08;
  });

  const xPos = (index - (WORLD_REGISTRY.length - 1) / 2) * ORB_SPACING;

  return (
    <group position={[xPos, ORB_Y, ORB_Z]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={() => navigate(path)}
          onPointerOver={() => {
            hovered.current = true;
            setIsHovered(true);
            onHover(entry.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            hovered.current = false;
            setIsHovered(false);
            onHover(null);
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[ORB_RADIUS, 32, 32]} />
          <meshStandardMaterial
            ref={materialRef}
            color={entry.color}
            emissive={entry.color}
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
        <Text
          position={[0, -ORB_RADIUS - 0.4, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="top"
        >
          {entry.label}
        </Text>
      </Float>
    </group>
  );
}

export default function WorldSelector() {
  const [, setHovered] = useState<string | null>(null);

  return (
    <group>
      {WORLD_REGISTRY.map((entry, index) => (
        <Orb
          key={entry.id}
          entry={entry}
          index={index}
          onHover={setHovered}
        />
      ))}
    </group>
  );
}
