import React from 'react'
import PlateWithCylindersLower from '../3d-components/PlateWithCylindersLower.tsx'
import PlateWithCylindersUpper from '../3d-components/PlateWithCylindersUpper.tsx'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function RiserSection() {
    const CAMERA_POSITION = [30, 80, 10];
  
    return (
        <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            <PlateWithCylindersUpper />
            <PlateWithCylindersLower />
            <OrbitControls enableZoom enablePan />
        </Canvas>
    )
}

export default RiserSection