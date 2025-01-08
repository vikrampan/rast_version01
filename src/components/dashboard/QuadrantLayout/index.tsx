'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import TopCylinder from '@/components/3d-components/TopCylinder';
import BottomCylinder from '@/components/3d-components/BottomCylinder';
import MidCylinder from '@/components/3d-components/MidCylinder';
import PlateWithCylindersLower from '@/components/3d-components/PlateWithCylindersLower';
import PlateWithCylindersUpper from '@/components/3d-components/PlateWithCylindersUpper';
import TubeSheet from '@/components/3d-components/TubeSheet';
import ChimneyBottomValve from '@/components/3d-components/ChimneyBottomValve';
import ChimneyTopValve from '@/components/3d-components/ChimneyTopValve';
import ChimneyBase from '@/components/3d-components/ChimneyBase';
import HeatExchangerDetailedView from '@/components/3d-sections/HeatExchangerDetailedView';
import TubeSheetSection from '@/components/3d-sections/TubeSheetSection';
import RiserSection from '@/components/3d-sections/RiserSection';


interface Screen {
  id: string;
  title: string;
}

interface QuadrantLayoutProps {
  method: string;
  screenType: 'TubeSheet' | 'Riser';
  screens: Screen[];
}

const QuadrantLayout: React.FC<QuadrantLayoutProps> = ({ method, screenType, screens }) => {
  // Animation variants for quadrants
  const quadrantVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const renderQuadrantContent = (screen: Screen) => {
    switch (screen.id) {
      case '3d-model':
        return (
          <div className="h-[250px] flex items-center justify-center bg-white text-[#9A9A9A]">
            {/* TODO: Implement 3D model visualization for TubeSheet/Riser */}
            <HeatExchangerDetailedView/>
          </div>
        );

      case 'inspection-area':
        return (
          <div className="h-[250px] flex items-center bg-white justify-center text-[#9A9A9A]">
            {/* TODO: Implement TubeSheet/Riser area visualization */}
            {screenType === 'TubeSheet' ? (
              // <p>TubeSheet Area - Check for blocked holes</p>
              <TubeSheetSection />
            ) : (
              <RiserSection />
            )}
          </div>
        );

      case 'live-images':
        return (
          <div className="h-full flex items-center justify-center text-[#9A9A9A]">
            {/* TODO: Implement live image feed from crawler */}
            <p>Live Camera Feed - {screenType}</p>
          </div>
        );

      case 'inspection-variation':
        return (
          <div className="h-full flex items-center justify-center text-[#9A9A9A]">
            {/* TODO: Implement inspection variation analysis */}
            <p>Inspection Variation Analysis - {screenType}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
      {screens.map((screen, index) => (
        <motion.div
          key={screen.id}
          variants={quadrantVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, delay: index * 0.1 }}
          className="bg-[#282828] rounded-lg p-4 shadow-lg border border-[#383838]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#E0E0E0]">{screen.title}</h3>
            <span className="text-sm text-[#9A9A9A]">{method}</span>
          </div>

          {renderQuadrantContent(screen)}
        </motion.div>
      ))}
    </div>
  );
};

export default QuadrantLayout;