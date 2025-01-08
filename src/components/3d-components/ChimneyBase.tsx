import React from 'react'
import * as THREE from 'three';

function ChimneyBase() {
    const BASE_RADIUS = 11;
    const BASE_HEIGHT = 150;

    return (
        <mesh position={[0, -BASE_HEIGHT / 1.998, 0]}>
            <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_HEIGHT, 32]} />
            <meshStandardMaterial color="#666666" side={THREE.DoubleSide} />
        </mesh>
    );
}

export default ChimneyBase