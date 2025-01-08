import React from 'react'
import * as THREE from 'three';

function MidCylinder() {
  const MID_RADIUS = 11;
  const MID_HEIGHT = 20;

  return (
    <mesh position={[0, 10.01, 0]}>
      <cylinderGeometry args={[MID_RADIUS, MID_RADIUS, MID_HEIGHT, 32]} />
      <meshStandardMaterial color="#7e8487" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default MidCylinder