import React from 'react'
import * as THREE from 'three';

function TopCylinder() {
  const TOP_UPPER_RADIUS = 6;
  const TOP_LOWER_RADIUS = 11;
  const TOP_HEIGHT = 12;

  return (
    <mesh position={[0, 36.1, 0]}>
      <cylinderGeometry args={[TOP_UPPER_RADIUS, TOP_LOWER_RADIUS, TOP_HEIGHT, 32]} />
      <meshStandardMaterial color="black" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default TopCylinder