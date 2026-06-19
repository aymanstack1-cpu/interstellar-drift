import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TheDrift from './worlds/TheDrift';
import NebulaHeart from './worlds/NebulaHeart';
import Singularity from './worlds/Singularity';
import SolarSail from './worlds/SolarSail';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TheDrift />} />
        <Route path="/nebula" element={<NebulaHeart />} />
        <Route path="/singularity" element={<Singularity />} />
        <Route path="/solar" element={<SolarSail />} />
      </Route>
    </Routes>
  );
}
