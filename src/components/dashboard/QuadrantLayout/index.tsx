'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
          <div className="h-full flex items-center justify-center text-[#9A9A9A]">
            {/* TODO: Implement 3D model visualization for TubeSheet/Riser */}
            <p>3D Model Visualization - {screenType}</p>
          </div>
        );

      case 'inspection-area':
        return (
          <div className="h-full flex items-center justify-center text-[#9A9A9A]">
            {/* TODO: Implement TubeSheet/Riser area visualization */}
            {screenType === 'TubeSheet' ? (
              <p>TubeSheet Area - Check for blocked holes</p>
            ) : (
              <p>Riser Area - Check for cracks</p>
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