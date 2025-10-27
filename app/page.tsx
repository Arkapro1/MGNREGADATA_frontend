'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  TrendingUp,
  Building2,
  Calendar,
  IndianRupee,
  Briefcase,
  Activity,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import apiService, { DBStats, State } from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState<DBStats | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🚀 [Dashboard] Starting data fetch...');
      console.log('🌐 [Dashboard] API Base URL:', process.env.NEXT_PUBLIC_API_URL);
      
      try {
        console.log('📊 [Dashboard] Calling getStats()...');
        const statsData = await apiService.getStats();
        console.log('✅ [Dashboard] Stats received:', statsData);
        setStats(statsData);

        console.log('📍 [Dashboard] Calling getStates()...');
        const statesData = await apiService.getStates();
        console.log('✅ [Dashboard] States received:', statesData);
        setStates(statesData);

        console.log('🎉 [Dashboard] All data loaded successfully!');
      } catch (error) {
        console.error('❌ [Dashboard] Error fetching data:', error);
        console.error('❌ [Dashboard] Error details:', {
          message: (error as any)?.message,
          stack: (error as any)?.stack,
          response: (error as any)?.response,
        });
      } finally {
        setLoading(false);
        console.log('✅ [Dashboard] Loading complete');
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: string | null) => {
    if (!num) return '0';
    const number = parseFloat(num);
    if (number >= 10000000) return `${(number / 10000000).toFixed(2)}Cr`;
    if (number >= 100000) return `${(number / 100000).toFixed(2)}L`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="w-16 h-16 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bharati-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
            Our Voice, Our Rights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering transparency in MGNREGA through data-driven insights across India
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Records"
            value={formatNumber(stats?.total_records || '0')}
            subtitle="synced records"
            icon={<Activity className="w-6 h-6" />}
            trend="up"
            delay={0.1}
          />
          <StatCard
            title="States Covered"
            value={stats?.total_states || '0'}
            subtitle="across India"
            icon={<MapPin className="w-6 h-6" />}
            delay={0.2}
          />
          <StatCard
            title="Districts"
            value={stats?.total_districts || '0'}
            subtitle="monitored"
            icon={<Building2 className="w-6 h-6" />}
            delay={0.3}
          />
          <StatCard
            title="Financial Years"
            value={stats?.total_years || '0'}
            subtitle="of data"
            icon={<Calendar className="w-6 h-6" />}
            delay={0.4}
          />
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatCard
            title="Total Expenditure"
            value={`₹${formatNumber(stats?.total_expenditure_all || '0')}`}
            subtitle="in lakhs"
            icon={<IndianRupee className="w-6 h-6" />}
            trend="up"
            delay={0.5}
          />
          <StatCard
            title="Households Worked"
            value={formatNumber(stats?.total_households_all || '0')}
            subtitle="total household engagements"
            icon={<Users className="w-6 h-6" />}
            trend="up"
            delay={0.6}
          />
        </div>

        {/* States Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">States Overview</h2>
            <span className="text-sm text-gray-500">
              {states.length} states available
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {states.slice(0, 9).map((state, index) => (
              <motion.div
                key={state.state_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="glass rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {state.state_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {state.total_districts} districts
                    </p>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>

          {states.length > 9 && (
            <div className="mt-6 text-center">
              <a
                href="/states"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:scale-105 transition-transform"
              >
                View All States
                <TrendingUp className="w-4 h-4" />
              </a>
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <Briefcase className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Explore MGNREGA Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dive deep into state-wise performance, district analytics, and employment statistics
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/states"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Browse States
            </a>
            <a
              href="/analytics"
              className="px-6 py-3 glass rounded-xl font-medium hover:scale-105 transition-transform"
            >
              View Analytics
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
