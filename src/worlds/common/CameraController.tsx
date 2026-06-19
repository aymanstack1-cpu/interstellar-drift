import { OrbitControls } from '@react-three/drei';

export default function CameraController() {
  return (
    <OrbitControls
      makeDefault
      autoRotate
      autoRotateSpeed={0.3}
      enableZoom
      maxDistance={10}
      minDistance={2}
      enableDamping
      dampingFactor={0.05}
      enablePan={false}
      rotateSpeed={0.5}
    />
  );
}
