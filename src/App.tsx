import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import AudioContextProvider from './audio/AudioContextProvider';
import LoadingFallback from './components/LoadingFallback';

const TheDrift = React.lazy(() => import('./worlds/TheDrift'));
const NebulaHeart = React.lazy(() => import('./worlds/NebulaHeart'));
const Singularity = React.lazy(() => import('./worlds/Singularity'));
const SolarSail = React.lazy(() => import('./worlds/SolarSail'));

export default function App() {
  return (
    <ErrorBoundary>
      <AudioContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TheDrift />
                </Suspense>
              }
            />
            <Route
              path="/nebula"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NebulaHeart />
                </Suspense>
              }
            />
            <Route
              path="/singularity"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Singularity />
                </Suspense>
              }
            />
            <Route
              path="/solar"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SolarSail />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AudioContextProvider>
    </ErrorBoundary>
  );
}
