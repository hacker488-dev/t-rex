import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function Rocket(props) {
  const { scene } = useGLTF('/models/cartoon_rocket.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.01;
    }
  });

  return <primitive object={scene} ref={ref} {...props} />;
}
