import type { CelestialBodyData, SpacecraftData } from '../types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

type SelectableObject = CelestialBodyData | SpacecraftData;

// Type guard to determine if an object is a SpacecraftData
function isSpacecraftData(obj: SelectableObject): obj is SpacecraftData {
  return !('orbitalRadius' in obj);
}

interface ObjectCardProps {
  object: SelectableObject;
  language: 'en' | 'ur';
  onSelect: (obj: SelectableObject) => void;
}

const ObjectCard: React.FC<ObjectCardProps> = ({ object, language, onSelect }) => {
  return (
    <div
      className="object-card"
      onClick={() => onSelect(object)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        margin: '5px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        width: '120px',
        height: '150px',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '80px', height: '80px', marginBottom: '5px' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {object.name === 'Sun' ? (
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial color={object.color} />
            </mesh>
          ) : isSpacecraftData(object) ? ( // Use type guard
            <mesh rotation-x={Math.PI / 2}>
              <coneGeometry args={[0.5, 1, 8]} />
              <meshStandardMaterial color={object.color} />
            </mesh>
          ) : ( // Now TypeScript knows 'object' is CelestialBodyData
            <>
              <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color={object.color} />
              </mesh>
              {object.name === 'Saturn' && (
                <mesh rotation-x={Math.PI / 2} rotation-y={0.5}>
                  <torusGeometry args={[1, 0.2, 2, 100]} />
                  <meshStandardMaterial color="darkgray" />
                </mesh>
              )}
            </>
          )}
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <p style={{ margin: 0, fontSize: '0.9em', color: 'white' }}>
        {language === 'ur' ? object.nameUrdu : object.name}
      </p>
    </div>
  );
};

export default ObjectCard;
