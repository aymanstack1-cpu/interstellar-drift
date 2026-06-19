import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export default function CameraController() {
  const { camera, gl } = useThree();

  return (
    <OrbitControls
      args={[camera, gl.domElement]}
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
