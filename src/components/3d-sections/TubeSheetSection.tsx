'use client'
import DataCard from '../3d-components/DataCard';
import TubeSheet from '../3d-components/TubeSheet';
import { Line, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react'

function TubeSheetSection() {
    const CAMERA_POSITION = [20, 20, 50];
    const [selectedHole, setSelectedHole] = useState(null);
    const [cardPosition, setCardPosition] = useState(null);
    const [cardData, setCardData] = useState(null);

    const handleHoleClick = (hole) => {
        console.log(hole);
        setSelectedHole(hole);
        setCardPosition([hole.position[0] + 7, hole.position[1] + 80, hole.position[2]]); // Adjust height as needed
        setCardData(hole);
    };
    return (
        <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            <TubeSheet onHoleClick={handleHoleClick} />
            {cardPosition && <DataCard position={cardPosition} data={cardData} />}
            {selectedHole !== null && (
                <Line points={[[selectedHole.position[0], selectedHole.position[1] + 75, selectedHole.position[2]], cardPosition]} color="blue" />
            )}
            <OrbitControls enableZoom enablePan />
        </Canvas>
    )
}

export default TubeSheetSection