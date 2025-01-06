'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter } from 'lucide-react';

interface ReportingViewProps {
  activeSubSection: string;
}

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
}

const ReportingView: React.FC<ReportingViewProps> = ({ activeSubSection }) => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Inspection Report #1',
      date: '2025-01-05',
      type: 'ProVis',
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Calibration Report #1',
      date: '2025-01-04',
      type: 'CaliPro',
      status: 'Pending'
    },
    {
      id: '3',
      title: 'Inspection Report #2',
      date: '2025-01-03',
      type: 'BoroVis',
      status: 'In Progress'
    }
  ]);

  const [filter, setFilter] = useState('all');

  // Use activeSubSection to filter reports if needed
  useEffect(() => {
    if (activeSubSection !== 'all') {
      const filteredBySubSection = reports.filter(report =>
        report.type.toLowerCase().includes(activeSubSection.toLowerCase())
      );
      setReports(filteredBySubSection);
    }
  }, [activeSubSection]);

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.type.toLowerCase() === filter.toLowerCase();
  });

  const handleDownload = (reportId: string) => {
    // Implement download functionality
    console.log(`Downloading report ${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#383838]">
        <Filter className="w-5 h-5 text-[#9A9A9A]" />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-[#FFC857] text-[#282828]' : 'text-[#9A9A9A] hover:bg-[#282828]'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('provis')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'provis' ? 'bg-[#FFC857] text-[#282828]' : 'text-[#9A9A9A] hover:bg-[#282828]'
            }`}
        >
          Pro Vis
        </button>
        <button
          onClick={() => setFilter('calipro')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'calipro' ? 'bg-[#FFC857] text-[#282828]' : 'text-[#9A9A9A] hover:bg-[#282828]'
            }`}
        >
          Cali Pro
        </button>
        <button
          onClick={() => setFilter('borovis')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'borovis' ? 'bg-[#FFC857] text-[#282828]' : 'text-[#9A9A9A] hover:bg-[#282828]'
            }`}
        >
          Boro Vis
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#282828] rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-[#FFC857]" />
              <div>
                <h3 className="text-[#E0E0E0] font-medium">{report.title}</h3>
                <p className="text-sm text-[#9A9A9A]">
                  {new Date(report.date).toLocaleDateString()} - {report.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${report.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                  report.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                }`}>
                {report.status}
              </span>
              <button
                onClick={() => handleDownload(report.id)}
                className="p-2 hover:bg-[#383838] rounded-lg transition-colors"
                title="Download Report"
                aria-label={`Download ${report.title}`}
              >
                <Download className="w-5 h-5 text-[#9A9A9A]" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-[#9A9A9A]"
          >
            No reports found matching the selected filter.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportingView;