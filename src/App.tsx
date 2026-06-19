import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AudioContextProvider from './audio/AudioContextProvider';
import TheDrift from './worlds/TheDrift';
import NebulaHeart from './worlds/NebulaHeart';
import Singularity from './worlds/Singularity';
import SolarSail from './worlds/SolarSail';
import Exhibition from './worlds/Exhibition';

export default function App() {
  return (
    <AudioContextProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TheDrift />} />
          <Route path="/nebula" element={<NebulaHeart />} />
          <Route path="/singularity" element={<Singularity />} />
          <Route path="/solar" element={<SolarSail />} />
          <Route path="/exhibition" element={<Exhibition />} />
        </Route>
      </Routes>
    </AudioContextProvider>
  );
}
