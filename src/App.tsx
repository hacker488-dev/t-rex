import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControlsComponent, Stars } from '@react-three/drei';
import CelestialBody from './components/CelestialBody';
import Spacecraft from './components/Spacecraft';
import InfoPanel from './components/InfoPanel';
import ObjectCard from './components/ObjectCard';
import { Colonist } from './components/Colonist';
import { Rocket } from './components/Rocket';
import Belt from './components/Belt'; // Import Belt component
import { solarSystemData, spacecraftData, asteroidBeltData, kuiperBeltData } from './data'; // Import belt data
import './App.css';
import { Group, Mesh, Vector3 } from 'three';
import type { SelectedObject } from './types';
import { OrbitControls } from 'three-stdlib';

const mars = solarSystemData.find(planet => planet.name === 'Mars');

interface CameraControllerProps {
  focusedObject: SelectedObject;
  defaultCameraPosition: Vector3;
  defaultCameraTarget: Vector3;
  objectRefs: React.MutableRefObject<{ [key: string]: Group | Mesh | null }>;
}

const CameraController: React.FC<CameraControllerProps> = ({ focusedObject, defaultCameraPosition, defaultCameraTarget, objectRefs }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControls>(null!);
  useFrame(() => {
    if (!controlsRef.current) return;

    if (focusedObject) {
      const targetMesh = objectRefs.current[focusedObject.name];
      if (targetMesh) {
        const targetPosition = targetMesh.position;

        const distance = focusedObject.name === 'Sun' ? focusedObject.size * 2 : focusedObject.size * 5;
        const offset = new Vector3(0, focusedObject.size * 1, distance);

        const newCameraPosition = targetPosition.clone().add(offset);
        
        camera.position.lerp(newCameraPosition, 0.05);
        controlsRef.current.target.lerp(targetPosition, 0.05);

        controlsRef.current.enablePan = false;
        controlsRef.current.enableZoom = false;
        controlsRef.current.maxDistance = distance * 2;
        controlsRef.current.minDistance = distance / 2;
      }
    } else {
      camera.position.lerp(defaultCameraPosition, 0.05);
      controlsRef.current.target.lerp(defaultCameraTarget, 0.05);

      controlsRef.current.enablePan = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.maxDistance = Infinity;
      controlsRef.current.minDistance = 0;
    }
    controlsRef.current.update();
  });

  return <DreiOrbitControlsComponent ref={controlsRef} />;
};


function App() {
  const [selectedObject, setSelectedObject] = useState<SelectedObject>(null);
  const [focusedObject, setFocusedObject] = useState<SelectedObject>(null);
  const objectRefs = useRef<{ [key: string]: Group | Mesh | null }>({});

  const defaultCameraPosition = new Vector3(0, 50, 100);
  const defaultCameraTarget = new Vector3(0, 0, 0);

  const handleSelectObject = (object: SelectedObject) => {
    setSelectedObject(object);
    setFocusedObject(object);
  };

  const handleClosePanel = () => {
    setSelectedObject(null);
  };

  const handleBackToSolarSystem = () => {
    setFocusedObject(null);
    setSelectedObject(null);
  };

  const setRef = useCallback((name: string, node: Group | Mesh | null) => {
    if (node) {
      objectRefs.current[name] = node;
    }
  }, []);

  return (
    <div className="app-container">
      <div className="canvas-container">
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1, color: 'white', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>The Solar System</h1>
          <p style={{ margin: 0 }}>Click on an object card to learn more</p>
        </div>

        {focusedObject && (
          <button
            onClick={handleBackToSolarSystem}
            style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000, padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Back to Solar System
          </button>
        )}

        <Canvas camera={{ position: defaultCameraPosition, fov: 60 }}>
          <CameraController
            focusedObject={focusedObject}
            defaultCameraPosition={defaultCameraPosition}
            defaultCameraTarget={defaultCameraTarget}
            objectRefs={objectRefs}
          />
          <Stars />
          <ambientLight intensity={1} />
          {solarSystemData.map((body) => (
            <React.Fragment key={body.name}>
              <CelestialBody ref={node => setRef(body.name, node)} body={body} />
            </React.Fragment>
          ))}
          {spacecraftData.map((craft) => (
            <React.Fragment key={craft.name}>
              <Spacecraft ref={node => setRef(craft.name, node)} craft={craft} />
            </React.Fragment>
          ))}
          {/* Add Asteroid Belt */}
          <Belt beltData={asteroidBeltData} />
          {/* Add Kuiper Belt */}
          <Belt beltData={kuiperBeltData} />
          <Colonist position={[mars.orbitalRadius + mars.size + 0.1, 0, 0]} scale={0.1} />
          <Colonist position={[mars.orbitalRadius - mars.size - 0.1, 0, 0]} scale={0.1} />
          <Colonist position={[mars.orbitalRadius, mars.size + 0.1, 0]} scale={0.1} />
          <Colonist position={[mars.orbitalRadius, -mars.size - 0.1, 0]} scale={0.1} />
          <Colonist position={[mars.orbitalRadius, 0, mars.size + 0.1]} scale={0.1} />
        </Canvas>
      </div>

      <div className="object-selection-panel">
        <h2>Objects</h2>
        {solarSystemData.map((body) => (
          <ObjectCard key={body.name} object={body} onSelect={handleSelectObject} />
        ))}
        {spacecraftData.map((craft) => (
          <ObjectCard key={craft.name} object={craft} onSelect={handleSelectObject} />
        ))}
      </div>

      <InfoPanel selectedObject={selectedObject} onClose={handleClosePanel} />
    </div>
  );
}

export default App;