'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  IndianRupee,
  TrendingUp,
  Briefcase,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import apiService, { PerformanceData } from '@/lib/api';

export default function DistrictDetailPage() {
  const params = useParams();
  const districtName = decodeURIComponent(params.district as string);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await apiService.getPerformance(districtName);
        setPerformance(data);
      } catch (error) {
        console.error('Error fetching performance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (districtName) {
      fetchPerformance();
    }
  }, [districtName]);

  const formatNumber = (num: string) => {
    const number = parseFloat(num);
    if (number >= 10000000) return `${(number / 10000000).toFixed(2)} Cr`;
    if (number >= 100000) return `${(number / 100000).toFixed(2)} L`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)} K`;
    return number.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="w-16 h-16 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const latestData = performance[0];

  return (
    <div className="min-h-screen bharati-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2 mb-6 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-10 h-10" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                {districtName}
              </h1>
              {latestData && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {latestData.state_name} • {latestData.fin_year}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {latestData ? (
          <>
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Expenditure"
                value={`₹${formatNumber(latestData.total_expenditure)}`}
                subtitle="in lakhs"
                icon={<IndianRupee className="w-6 h-6" />}
                trend="up"
                delay={0.1}
              />
              <StatCard
                title="Households Worked"
                value={formatNumber(latestData.total_households_worked)}
                icon={<Users className="w-6 h-6" />}
                trend="up"
                delay={0.2}
              />
              <StatCard
                title="Person Days"
                value={formatNumber(latestData.total_persondays_generated)}
                subtitle="generated"
                icon={<Briefcase className="w-6 h-6" />}
                delay={0.3}
              />
              <StatCard
                title="Avg Employment"
                value={parseFloat(latestData.avg_days_employment_provided).toFixed(1)}
                subtitle="days per household"
                icon={<Calendar className="w-6 h-6" />}
                delay={0.4}
              />
            </div>

            {/* Detailed Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Women Person Days</p>
                  <p className="text-2xl font-bold">{formatNumber(latestData.total_women_persondays)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">SC Person Days</p>
                  <p className="text-2xl font-bold">{formatNumber(latestData.total_sc_persondays)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">ST Person Days</p>
                  <p className="text-2xl font-bold">{formatNumber(latestData.total_st_persondays)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Works Completed</p>
                  <p className="text-2xl font-bold">{formatNumber(latestData.total_works_completed)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Works Ongoing</p>
                  <p className="text-2xl font-bold">{formatNumber(latestData.total_works_ongoing)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Avg Wage Rate</p>
                  <p className="text-2xl font-bold">₹{parseFloat(latestData.avg_wage_rate).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>

            {/* Year-wise Data */}
            {performance.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Year-wise Performance</h2>
                <div className="space-y-4">
                  {performance.map((data, index) => (
                    <div key={index} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{data.fin_year}</h3>
                          <p className="text-sm text-gray-500">
                            {formatNumber(data.total_households_worked)} households
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{formatNumber(data.total_expenditure)}</p>
                          <p className="text-xs text-gray-500">expenditure (lakhs)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12 glass rounded-2xl">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">
              No performance data available for {districtName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
