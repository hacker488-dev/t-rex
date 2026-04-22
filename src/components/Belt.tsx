// remove them completely if not used
import type { AsteroidBeltData, KuiperBeltData } from '../types';

interface BeltProps {
  beltData: AsteroidBeltData | KuiperBeltData;
}

const Belt = ({ beltData }: BeltProps) => {
  // Temporarily rendering a single sphere for debugging
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

export default Belt;
