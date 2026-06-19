import { Outlet } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import WorldSelector from './WorldSelector';
import PostEffects from '../worlds/common/PostEffects';
import OverlayUI from './OverlayUI';
import TransitionOverlay from './TransitionOverlay';

export default function Layout() {
  return (
    <>
      {/* Persistent R3F Canvas — stays mounted across routes */}
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <WorldSelector />
        <PostEffects />
        {/* Route-specific world scenes render here */}
        <Outlet />
      </Canvas>

      {/* HTML overlays above the Canvas */}
      <OverlayUI />
      <TransitionOverlay />
    </>
  );
}
