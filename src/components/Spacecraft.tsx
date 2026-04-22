import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Cone } from '@react-three/drei';
import { Mesh } from 'three';
import type { SpacecraftData } from '../types';

interface SpacecraftProps {
  craft: SpacecraftData;
}

const Spacecraft = forwardRef<Mesh | null, SpacecraftProps>(({ craft }, ref) => {
  const meshRef = useRef<Mesh>(null);

  useImperativeHandle(ref, () => meshRef.current!);

  // Spacecraft typically don't orbit the sun in the same way planets do for this model,
  // their position is more fixed or slowly changing relative to the solar system origin.
  // We'll keep their position static for simplicity here.

  return (
    <Cone
      ref={meshRef}
      args={[craft.size, craft.size * 2, 8]} // radius, height, radialSegments
      position={craft.position}
      rotation-x={Math.PI / 2} // Rotate to point along the x-axis for better visibility
    >
      <meshStandardMaterial color={craft.color} />
    </Cone>
  );
});

export default Spacecraft;
