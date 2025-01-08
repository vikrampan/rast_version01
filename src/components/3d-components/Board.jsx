import React from 'react'
import * as THREE from 'three';
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';

function Board({ rows, cols, spacing, width, height }) {
  return (
    <group>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} />
      </mesh>

      {/* Row and Column Markings */}
      {/* {Array.from({ length: rows }, (_, rowIndex) => (
        <Text
          key={`row-${rowIndex}`}
          position={[-width / 2 - 0.5, 0, (rowIndex - rows / 2 + 0.5) * spacing]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="black"
        >
          L {rowIndex + 1}
        </Text>
      ))} */}

      {Array.from({ length: cols }, (_, colIndex) => (
        <Text
          key={`col-${colIndex}`}
          position={[(colIndex - cols / 2 + 0.5) * spacing, 0, height / 2 - 1.5]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={0.5}
          color="black"
        >
          Row {cols - colIndex}
        </Text>
      ))}
    </group>
  );
}

export default Board