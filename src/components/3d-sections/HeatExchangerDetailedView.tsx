import BottomCylinder from '../3d-components/BottomCylinder'
import ChimneyBase from '../3d-components/ChimneyBase'
import ChimneyBottomValve from '../3d-components/ChimneyBottomValve'
import ChimneyTopValve from '../3d-components/ChimneyTopValve'
import MidCylinder from '../3d-components/MidCylinder'
import PlateWithCylindersLower from '../3d-components/PlateWithCylindersLower'
import PlateWithCylindersUpper from '../3d-components/PlateWithCylindersUpper'
import TopCylinder from '../3d-components/TopCylinder'
import TubeSheet from '../3d-components/TubeSheet'
import { OrbitControls } from '@react-three/drei'
import React from 'react'
import { Canvas } from '@react-three/fiber'

function Chimney() {

    return (
        <group>
            <TopCylinder />
            <ChimneyTopValve />

            <BottomCylinder />
            <PlateWithCylindersUpper />
            <PlateWithCylindersLower />
            <ChimneyBottomValve />
            <MidCylinder />

            <TubeSheet onHoleClick={() => { }} />
            <ChimneyBase />
        </group>
    );
}

function HeatExchangerDetailedView() {
    const CAMERA_POSITION = [20, 20, 50];
    const CAMERA_FOV = 40;
    return (

        <Canvas camera={{ position: [20, 20, 20], fov: CAMERA_FOV }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />

            <Chimney />
            <OrbitControls enableZoom enablePan />
        </Canvas>

    )
}

export default HeatExchangerDetailedView