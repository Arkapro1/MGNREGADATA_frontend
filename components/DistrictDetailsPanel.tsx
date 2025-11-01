'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  IndianRupee,
  Briefcase,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  Clock,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import apiService, { PerformanceData } from '@/lib/api';

interface DistrictDetailsPanelProps {
  districtCode: string;
  districtName: string;
  stateName: string;
}

export default function DistrictDetailsPanel({
  districtCode,
  districtName,
  stateName
}: DistrictDetailsPanelProps) {
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const data = await apiService.getPerformance(districtName);
        setPerformance(data);
        // Auto expand first year
        if (data.length > 0) {
          setExpandedYear(data[0].fin_year);
        }
      } catch (error) {
        console.error('Error fetching performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [districtName]);

  const formatNumber = (num: string) => {
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    if (number >= 10000000) return `${(number / 10000000).toFixed(2)} Cr`;
    if (number >= 100000) return `${(number / 100000).toFixed(2)} L`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)} K`;
    return number.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="border-l-4 p-8 flex items-center justify-center h-[calc(100vh-80px)]"
        style={{ backgroundColor: '#FAF8F1', borderLeftColor: '#91C4C3' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#91C4C3', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-sm font-bold" style={{ color: '#1A3D64' }}>Loading details...</p>
        </div>
      </div>
    );
  }

  const latestData = performance[0];

  if (!latestData) {
    return (
      <div className="border-l-4 p-8 flex items-center justify-center h-[calc(100vh-80px)]"
        style={{ backgroundColor: '#FAF8F1', borderLeftColor: '#91C4C3' }}
      >
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#91C4C3' }} />
          <p className="text-sm font-bold" style={{ color: '#1A3D64' }}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="border-l-4 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto w-96"
      style={{ 
        backgroundColor: '#FAF8F1',
        borderLeftColor: '#91C4C3',
        scrollbarWidth: 'thin',
        scrollbarColor: '#91C4C3 #FAF8F1'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b-4"
        style={{ 
          backgroundColor: '#1A3D64',
          borderBottomColor: '#91C4C3'
        }}
      >
        <h2 className="text-2xl font-black mb-1" style={{ color: '#FAF8F1' }}>{districtName}</h2>
        <p className="text-sm font-semibold" style={{ color: '#91C4C3' }}>{stateName}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="px-3 py-1.5 text-sm font-bold"
            style={{ backgroundColor: '#91C4C3', color: '#1A3D64' }}
          >
            {latestData.fin_year}
          </div>
          <div className="px-3 py-1.5 text-sm font-bold flex items-center gap-1"
            style={{ backgroundColor: '#91C4C3', color: '#1A3D64' }}
          >
            <TrendingUp className="w-4 h-4" />
            ACTIVE
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-black mb-3" style={{ color: '#1A3D64' }}>
          KEY METRICS ({latestData.fin_year})
        </h3>
        
        {/* Expenditure */}
        <div className="border-2 p-4"
          style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: '#1A3D64' }}
              >
                <IndianRupee className="w-5 h-5" style={{ color: '#FAF8F1' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>EXPENDITURE</span>
            </div>
          </div>
          <p className="text-2xl font-black" style={{ color: '#1A3D64' }}>
            ₹{formatNumber(latestData.total_expenditure)}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: '#91C4C3' }}>in lakhs</p>
        </div>

        {/* Households */}
        <div className="border-2 p-4"
          style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: '#1A3D64' }}
              >
                <Users className="w-5 h-5" style={{ color: '#FAF8F1' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>HOUSEHOLDS</span>
            </div>
          </div>
          <p className="text-2xl font-black" style={{ color: '#1A3D64' }}>
            {formatNumber(latestData.total_households_worked)}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: '#91C4C3' }}>worked</p>
        </div>

        {/* Person Days */}
        <div className="border-2 p-4"
          style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: '#1A3D64' }}
              >
                <Briefcase className="w-5 h-5" style={{ color: '#FAF8F1' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>PERSON DAYS</span>
            </div>
          </div>
          <p className="text-2xl font-black" style={{ color: '#1A3D64' }}>
            {formatNumber(latestData.total_persondays_generated)}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: '#91C4C3' }}>generated</p>
        </div>

        {/* Avg Employment */}
        <div className="border-2 p-4"
          style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: '#1A3D64' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#FAF8F1' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>AVG EMPLOYMENT</span>
            </div>
          </div>
          <p className="text-2xl font-black" style={{ color: '#1A3D64' }}>
            {parseFloat(latestData.avg_days_employment_provided).toFixed(1)}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: '#91C4C3' }}>days per household</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="p-4 border-t-2" style={{ borderTopColor: '#91C4C3' }}>
        <h3 className="text-sm font-black mb-3" style={{ color: '#1A3D64' }}>DETAILED BREAKDOWN</h3>
        
        <div className="space-y-2">
          {/* Women Person Days */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>Women Person Days</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              {formatNumber(latestData.total_women_persondays)}
            </span>
          </div>

          {/* SC Person Days */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>SC Person Days</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              {formatNumber(latestData.total_sc_persondays)}
            </span>
          </div>

          {/* ST Person Days */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>ST Person Days</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              {formatNumber(latestData.total_st_persondays)}
            </span>
          </div>

          {/* Works Completed */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>Works Completed</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              {formatNumber(latestData.total_works_completed)}
            </span>
          </div>

          {/* Works Ongoing */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>Works Ongoing</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              {formatNumber(latestData.total_works_ongoing)}
            </span>
          </div>

          {/* Avg Wage Rate */}
          <div className="flex justify-between items-center p-3 border"
            style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}
          >
            <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>Avg Wage Rate</span>
            <span className="text-base font-black" style={{ color: '#1A3D64' }}>
              ₹{parseFloat(latestData.avg_wage_rate).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Data */}
      {performance.length > 1 && (
        <div className="p-4 border-t-2" style={{ borderTopColor: '#91C4C3' }}>
          <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: '#1A3D64' }}>
            <BarChart3 className="w-5 h-5" />
            YEAR-WISE PERFORMANCE
          </h3>
          
          <div className="space-y-2">
            {performance.map((data, index) => {
              const isExpanded = expandedYear === data.fin_year;
              const isLatest = index === 0;
              
              return (
                <div key={data.fin_year} className="border-2"
                  style={{ 
                    backgroundColor: isLatest ? '#1A3D64' : '#FAF8F1',
                    borderColor: '#91C4C3'
                  }}
                >
                  <button
                    onClick={() => setExpandedYear(isExpanded ? null : data.fin_year)}
                    className="w-full p-3 text-left flex items-center justify-between transition-colors duration-150"
                  >
                    <div>
                      <p className="font-black text-base"
                        style={{ color: isLatest ? '#FAF8F1' : '#1A3D64' }}
                      >
                        {data.fin_year}
                      </p>
                      <p className="text-sm font-medium"
                        style={{ color: isLatest ? '#91C4C3' : '#91C4C3' }}
                      >
                        ₹{formatNumber(data.total_expenditure)}
                      </p>
                    </div>
                    <ChevronDown 
                      className="w-5 h-5 transition-transform duration-150"
                      style={{ 
                        color: isLatest ? '#FAF8F1' : '#1A3D64',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
                      }}
                    />
                  </button>
                  
                  {isExpanded && (
                    <div className="p-3 border-t-2 space-y-1"
                      style={{ 
                        backgroundColor: '#FAF8F1',
                        borderTopColor: '#91C4C3'
                      }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium" style={{ color: '#1A3D64' }}>Households:</span>
                        <span className="font-bold" style={{ color: '#1A3D64' }}>{formatNumber(data.total_households_worked)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium" style={{ color: '#1A3D64' }}>Person Days:</span>
                        <span className="font-bold" style={{ color: '#1A3D64' }}>{formatNumber(data.total_persondays_generated)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium" style={{ color: '#1A3D64' }}>Avg Employment:</span>
                        <span className="font-bold" style={{ color: '#1A3D64' }}>{parseFloat(data.avg_days_employment_provided).toFixed(1)} days</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="p-4 border-t-4"
        style={{ 
          backgroundColor: '#1A3D64',
          borderTopColor: '#91C4C3'
        }}
      >
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-5 h-5" style={{ color: '#91C4C3' }} />
          <div>
            <p className="font-bold" style={{ color: '#91C4C3' }}>LAST UPDATED</p>
            <p className="font-medium" style={{ color: '#FAF8F1' }}>
              {latestData.last_updated 
                ? new Date(latestData.last_updated).toLocaleString() 
                : 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
