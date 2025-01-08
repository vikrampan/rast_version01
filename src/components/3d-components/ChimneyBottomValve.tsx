import React from 'react'
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';

function ChimneyBottomValve() {
  const VALVE_RADIUS = 1.5;
  const VALVE_HEIGHT = 5;
  const VALVE_POSITIONS = [
    { x: 13.5, y: 10, z: 0, label: "Valve 2" },
  ];

  return (
    <>
      {VALVE_POSITIONS.map((pos, index) => (
        <group key={index}>
          {/* Valve */}
          <mesh
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[VALVE_RADIUS, VALVE_RADIUS, VALVE_HEIGHT, 32]} />
            <meshStandardMaterial color="#afb6ba" />
          </mesh>

          {/* Label */}
          <Html
            position={[pos.x + 10, pos.y + 1, pos.z]} // Adjust label position close to the valve
            center
            style={{
              backgroundColor: "blue",

              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "white",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {pos.label}
          </Html>
        </group>
      ))}
    </>
  );
}

export default ChimneyBottomValve