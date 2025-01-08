import React from 'react'
import * as THREE from 'three';
export default function Hole({ position, status, onClick, realRow, realCol }) {
  // Assuming 'status' is now a blockage percentage between 0 and 1
  const blockagePercentage = status;  // This could come from the AI/ML model

  // Interpolate between green and black
  const color = new THREE.Color().setHSL(0.33, 1, 0.5 - 0.5 * blockagePercentage); // Green to black based on percentage
  const invertedRow = 17 - realRow - 1
  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        onClick({ status, position, realRow: invertedRow, realCol });
    }} 
      style={{ cursor: 'pointer' }} >
      <cylinderGeometry args={[0.2, 0.2, 150, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
