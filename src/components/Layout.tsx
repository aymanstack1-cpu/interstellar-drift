import { Outlet } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import WorldSelector from './WorldSelector';
import OverlayUI from './OverlayUI';
import TransitionOverlay from './TransitionOverlay';

export default function Layout() {
  return (
    <>
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
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
        <WorldSelector />
        <Outlet />
      </Canvas>
      <OverlayUI />
      <TransitionOverlay />
    </>
  );
}
