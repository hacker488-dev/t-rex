import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export function Colonist(props) {
  const { scene, animations } = useGLTF('/KayKit_Character_Animations_1.1/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb');
  const { ref, actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Play all animations
    actions[Object.keys(actions)[0]]?.play();
  }, [actions]);

  return <primitive object={scene} {...props} />;
}
