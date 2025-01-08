import React from 'react';
import * as THREE from 'three';

const BottomCylinder: React.FC = () => {
  const MID_RADIUS: number = 11; // Explicitly define types
  const RED_HEIGHT: number = 10;

  return (
    
    <mesh position={[0, 25.01, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[MID_RADIUS, MID_RADIUS, RED_HEIGHT, 32]} />
      <meshStandardMaterial
        color="red"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default BottomCylinder;
