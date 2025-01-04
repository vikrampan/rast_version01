import React from 'react';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const License = () => {
  return (
    <Card className="w-full bg-black border-zinc-800">
      <CardContent className="p-6 space-y-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">About</h3>
          <div className="space-y-2 text-zinc-400">
            <p>TubePro 6.0</p>
            <p>Version: TubePro 6.0R2 / 6.0.0.1102</p>
            <a
              href="https://www.inspection-software.com"
              className="block text-blue-500 hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Designed and written: Inspection Software Systems LLC
            </a>
            <p>
              <a
                href="https://www.edaft.com"
                className="text-blue-500 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Distributed by: EdaFT Technologies
              </a>
            </p>
            <p className="mt-4 text-zinc-400">
              Copyright © 2007-2024 Inspection Software Systems LLC
            </p>
          </div>
        </div>

        {/* License Manager Button */}
        <div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-200 transition-colors"
          >
            <Key className="w-5 h-5 text-blue-500" />
            <span>License Manager</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default License;