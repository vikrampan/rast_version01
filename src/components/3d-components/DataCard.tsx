import React from 'react'
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';

function DataCard({ position, data }) {
    return (
      <Html position={position} style={{ transform: 'translate(-50%, -100%)' }}>
        <div
          style={{
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            pointerEvents: 'none', // Prevent interaction with the card
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align text to the left
            width: '250px', // Set the width of the card
            gap: '4px', // Add gap between items
          }}
        >
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Hole Data</h4>
          <p style={{ margin: 0 }}>Blockage Percentage: {(data.status * 100).toFixed(2)}%</p>
          <p style={{ margin: 0 }}>Row: {data.realRow + 1}</p>
          <p style={{ margin: 0 }}>Tube: {data.realCol}</p>
        </div>
      </Html>
    );
  }

export default DataCard