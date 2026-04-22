import { Circle } from '@react-three/drei';

interface OrbitLineProps {
  radius: number;
}

const OrbitLine: React.FC<OrbitLineProps> = ({ radius }) => {
  return (
    <Circle args={[radius, 64]} rotation-x={Math.PI / 2}>
      <meshBasicMaterial attach="material" color="#ffffff" transparent opacity={0.1} />
    </Circle>
  );
};

export default OrbitLine;
