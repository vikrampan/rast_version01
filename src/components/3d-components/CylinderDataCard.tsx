import React from 'react'
import * as THREE from 'three';
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';

function CylinderDataCard({ data }) {
    return (
      <Html position={[30,-10, 0]} style={{ transform: 'translate(-50%, -100%)' }}>
        <div
          style={{
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '250px',
            gap: '4px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Cylinder Data</h4>
          <p style={{ margin: 0 }}>Location: {data.location}</p>
          <p style={{ margin: 0 }}>Crack Percentage: {data.crackPercentage}%</p>
          {/* <p style={{ margin: 0 }}>Temperature: {data.temperature}°C</p>
          <p style={{ margin: 0 }}>Pressure: {data.pressure} PSI</p> */}
          <p style={{ margin: 0 }}>Status: {data.status}</p>
        </div>
      </Html>
    );
  }
  

export default CylinderDataCard