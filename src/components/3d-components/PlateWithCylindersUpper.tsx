'use client'
import { cylinderData } from '../../data';
import React, { useState } from 'react'
import CylinderDataCard from './CylinderDataCard'
import * as THREE from 'three';

function PlateWithCylindersUpper() {
    const [selectedCylinder, setSelectedCylinder] = useState(null);
    const CYLINDER_RADIUS = 2;
    const CYLINDER_HEIGHT = 8;
  
    const handleCylinderClick = (cylinderData) => {
      setSelectedCylinder(selectedCylinder?.id === cylinderData.id ? null : cylinderData);
    };
  
    return (
      <group position={[0, 20, 0]}>
        {/* Transparent Base Plate */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[11, 11, 0.5, 64]} />
          <meshStandardMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
  
        {/* All Cylinders (Top Half) */}
        {cylinderData.map((cylinder) => (
          <group 
            key={cylinder.id} 
            position={[cylinder.position.x, 0.5, cylinder.position.z]}
            onClick={(e) => {
              e.stopPropagation();
              handleCylinderClick(cylinder);
            }}
          >
            <mesh position={[0, CYLINDER_HEIGHT / 4, 0]}>
              <cylinderGeometry
                args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
              />
              <meshStandardMaterial 
                color={selectedCylinder?.id === cylinder.id ? '#ff4444' : cylinder.color} 
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

export default PlateWithCylindersUpper