import React from 'react'
import Hole from './Hole';
import * as THREE from 'three';
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';
import { holeData } from '../../data';
import Board from './Board';

function TubeSheet({ onHoleClick }) {
  const TUBE_SHEET_RADIUS = 11;
  const HOLE_RADIUS = 0.2;
  const HOLE_SPACING = 0.8;
  const MAX_DISTANCE_FROM_CENTER = 10;
  const ROWS = 17;
  const COLS = 25;

  // Column distribution for each row
  const rowColumnPattern = [7, 15, 29, 22, 25, 25, 25, 25, 25, 25, 25, 25, 25, 22, 19, 15, 7];

  const createHoles = () => {
    const holes = [];
    const sampleHolesData = holeData;

    let holeIndex = 0;
    for (let row = 0; row < ROWS; row++) {
      const numColsInRow = rowColumnPattern[row];  // Get the number of columns for the current row

      for (let col = 1; col <= numColsInRow; col++) {

        if (holeIndex >= sampleHolesData.length) break;

        // Swap and rotate the coordinates (90 degrees rotation)
        const x = (col - Math.floor(numColsInRow / 2)) * HOLE_SPACING;  // Adjusted to center the columns properly
        const z = (row - Math.floor(ROWS / 2)) * HOLE_SPACING;
        const newX = z; // 90-degree rotation (swap x and z)
        const newZ = -x; // Invert the sign of the new x to get proper rotation

        const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ);

        if (distanceFromCenter <= MAX_DISTANCE_FROM_CENTER) {
          const { status } = sampleHolesData[holeIndex];
          holes.push({
            position: [newX, -74.9, newZ],
            status,
            realRow: row,
            realCol: col,  // Column will be positive and start from 1
          });
          holeIndex++;
        }
      }
    }
    return holes;
  };

  const holes = createHoles();

  return (
    <group>
      <Board
        rows={COLS}
        cols={ROWS}
        spacing={HOLE_SPACING}
        width={25} // Adjust based on TubeSheet dimensions
        height={28} // Adjust based on TubeSheet dimensions
      />
      <Circle args={[TUBE_SHEET_RADIUS, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="white"
          side={THREE.DoubleSide}
          specular="black"
          shininess={0}
        />
      </Circle>
      {holes.map((hole, index) => (
        <Hole key={index} position={hole.position} status={hole.status} realRow={hole.realRow} realCol={hole.realCol} onClick={onHoleClick} />
      ))}
    </group>
  );
}

export default TubeSheet