import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControlsComponent, Stars } from '@react-three/drei';
import CelestialBody from './components/CelestialBody';
import Spacecraft from './components/Spacecraft';
import InfoPanel from './components/InfoPanel';
import ObjectCard from './components/ObjectCard';
import { Colonist } from './components/Colonist';
import { Rocket } from './components/Rocket';
import Belt from './components/Belt';
import { solarSystemData, spacecraftData, asteroidBeltData, kuiperBeltData } from './data';
import './App.css';
import { Group, Mesh, Vector3 } from 'three';
import type { SelectedObject } from './types';
import { OrbitControls } from 'three-stdlib';

const mars = solarSystemData.find(planet => planet.name === 'Mars');

interface NukeProps {
  targetPosition: Vector3;
  onImpact: () => void;
}

const Nuke: React.FC<NukeProps> = ({ targetPosition, onImpact }) => {
  const meshRef = useRef<Mesh>(null!);
  const startPosition = useMemo(() => new Vector3(0, 0, 0), []); // Launch from Sun
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (progress < 1) {
      const newProgress = Math.min(progress + delta * 0.5, 1);
      setProgress(newProgress);
      meshRef.current.position.lerpVectors(startPosition, targetPosition, newProgress);
      meshRef.current.lookAt(targetPosition);
    } else {
      onImpact();
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
      <meshStandardMaterial color="red" emissive="red" emissiveIntensity={2} />
    </mesh>
  );
};

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
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [nukes, setNukes] = useState<{ id: number; targetName: string }[]>([]);
  const [isShaking, setIsShaking] = useState(false);
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

  const handleLaunchNuke = (targetName: string) => {
    setNukes(prev => [...prev, { id: Date.now(), targetName }]);
  };

  const handleNukeImpact = (id: number) => {
    setNukes(prev => prev.filter(n => n.id !== id));
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Shakes for 0.5 seconds
  };

  const setRef = useCallback((name: string, node: Group | Mesh | null) => {
    if (node) {
      objectRefs.current[name] = node;
    }
  }, []);

  const t = (en: string, ur: string) => (language === 'ur' ? ur : en);

  return (
    <div className={`app-container ${language === 'ur' ? 'rtl' : ''} ${isShaking ? 'shake' : ''}`}>
      <div className="canvas-container">
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1, color: 'white', textAlign: 'center', pointerEvents: 'none' }}>
          <h1 style={{ margin: 0 }}>{t('The Solar System', 'نظام شمسی')}</h1>
          <p style={{ margin: 0 }}>{t('Click on an object card to learn more', 'مزید جاننے کے لیے کسی چیز پر کلک کریں')}</p>
        </div>

        <button
          onClick={() => setLanguage(l => l === 'en' ? 'ur' : 'en')}
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, padding: '10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {language === 'en' ? 'اردو' : 'English'}
        </button>

        {focusedObject && (
          <button
            onClick={handleBackToSolarSystem}
            style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000, padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {t('Back to Solar System', 'نظام شمسی پر واپس جائیں')}
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
          
          {nukes.map(nuke => {
            const target = objectRefs.current[nuke.targetName];
            if (!target) return null;
            return (
              <Nuke 
                key={nuke.id} 
                targetPosition={target.position} 
                onImpact={() => handleNukeImpact(nuke.id)} 
              />
            );
          })}

          <Belt beltData={asteroidBeltData} />
          <Belt beltData={kuiperBeltData} />
          {mars && (
            <>
              <Colonist position={[mars.orbitalRadius + mars.size + 0.1, 0, 0]} scale={0.1} />
              <Colonist position={[mars.orbitalRadius - mars.size - 0.1, 0, 0]} scale={0.1} />
            </>
          )}
        </Canvas>
      </div>

      <div className="object-selection-panel">
        <h2>{t('Objects', 'اشیاء')}</h2>
        {solarSystemData.map((body) => (
          <ObjectCard key={body.name} object={body} language={language} onSelect={handleSelectObject} />
        ))}
        {spacecraftData.map((craft) => (
          <ObjectCard key={craft.name} object={craft} language={language} onSelect={handleSelectObject} />
        ))}
      </div>

      <InfoPanel 
        selectedObject={selectedObject} 
        language={language} 
        onClose={handleClosePanel} 
        onLaunchNuke={handleLaunchNuke}
      />
    </div>
  );
}

export default App;