import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const Help = () => {
  return (
    <Card className="w-full bg-black border-zinc-800">
      <CardContent className="p-6 space-y-8">
        {/* Documentation Links */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Name</h3>
          <div className="space-y-2">
            <a
              href="#"
              className="block text-blue-500 hover:text-blue-400 transition-colors"
            >
              TubePro Software License Activation, Update and Upgrade Instructions for Desktop Software
            </a>
            <a
              href="#"
              className="block text-blue-500 hover:text-blue-400 transition-colors"
            >
              TubePro Software Key Features and Walkthrough
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Contact Information</h3>
          <div className="space-y-2 text-zinc-400">
            <p>EdaFT Technologies</p>
            <p>2525 rue Pierre-Ardouin</p>
            <p>Quebec, Quebec, G1P 0E3</p>
            <p>CANADA</p>
            <p>1 +1 418 780-1565</p>
            <a
              href="http://www.edaft.com"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mt-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.edaft.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Help;