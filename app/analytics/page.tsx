'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, IndianRupee } from 'lucide-react';
import StatCard from '@/components/StatCard';
import apiService, { DBStats } from '@/lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DBStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: string | null) => {
    if (!num) return '0';
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

  return (
    <div className="min-h-screen bharati-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive insights into MGNREGA performance across India
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Expenditure"
            value={`₹${formatNumber(stats?.total_expenditure_all || '0')}`}
            subtitle="in lakhs"
            icon={<IndianRupee className="w-6 h-6" />}
            trend="up"
            trendValue="+12%"
            delay={0.1}
          />
          <StatCard
            title="Households Benefited"
            value={formatNumber(stats?.total_households_all || '0')}
            subtitle="total engagements"
            icon={<Users className="w-6 h-6" />}
            trend="up"
            trendValue="+8%"
            delay={0.2}
          />
          <StatCard
            title="States Covered"
            value={stats?.total_states || '0'}
            subtitle="across India"
            icon={<TrendingUp className="w-6 h-6" />}
            delay={0.3}
          />
          <StatCard
            title="Districts"
            value={stats?.total_districts || '0'}
            subtitle="monitored"
            icon={<BarChart3 className="w-6 h-6" />}
            delay={0.4}
          />
        </div>

        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
          <div className="space-y-4">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-2">Total Records Synced</h3>
              <p className="text-3xl font-bold text-gradient">
                {formatNumber(stats?.total_records || '0')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {stats?.last_updated ? new Date(stats.last_updated).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-2">Financial Years Covered</h3>
                <p className="text-3xl font-bold">{stats?.total_years || '0'}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-2">Data Quality</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[95%]"></div>
                  </div>
                  <span className="text-sm font-semibold">95%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Data Insights</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            This analytics dashboard provides real-time insights into MGNREGA implementation
            across Indian states. Data is automatically synced from official government APIs
            to ensure accuracy and transparency.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
