'use client';

import { cylinderData } from '../../data';
import React, { useState } from 'react';
import CylinderDataCard from './CylinderDataCard';
import * as THREE from 'three';

// Define the Cylinder interface based on the data structure
interface Cylinder {
  id: string;
  location: string;
  position: {
    x: number;
    z: number;
  };
  crackPercentage: number;
  temperature: number;
  pressure: number;
  lastInspection: string; // ISO date string
  status: 'Normal' | 'Warning' | 'Critical';
  maintenanceRequired: boolean;
  materialType: string;
  thickness: number; // mm
  color: string; // Hex color
}

function PlateWithCylindersLower() {
  const [selectedCylinder, setSelectedCylinder] = useState<Cylinder | null>(null);
  const CYLINDER_RADIUS = 2;
  const CYLINDER_HEIGHT = 8;

  const handleCylinderClick = (cylinderData: Cylinder) => {
    setSelectedCylinder(selectedCylinder?.id === cylinderData.id ? null : cylinderData);
  };

  return (
    <group position={[0, 20, 0]}>
      {/* All Cylinders (Bottom Half) */}
      {cylinderData.map((cylinder: Cylinder) => (
        <group
          key={cylinder.id}
          position={[cylinder.position.x, 0.5, cylinder.position.z]}
          onClick={(e: THREE.Event) => {
            e.stopPropagation();
            handleCylinderClick(cylinder);
          }}
        >
          <mesh position={[0, -CYLINDER_HEIGHT / 4, 0]}>
            <cylinderGeometry
              args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
            />
            <meshStandardMaterial
              color={selectedCylinder?.id === cylinder.id ? '#ff6666' : cylinder.color}
              side={THREE.DoubleSide}
            />
          </mesh>
          {selectedCylinder?.id === cylinder.id && (
            <CylinderDataCard data={cylinder} />
          )}
        </group>
      ))}
    </group>
  );
}

export default PlateWithCylindersLower;
