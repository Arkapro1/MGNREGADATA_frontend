'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Building2, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import apiService, { District } from '@/lib/api';

export default function StateDetailPage() {
  const params = useParams();
  const stateName = decodeURIComponent(params.state as string);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await apiService.getDistricts(stateName);
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (stateName) {
      fetchDistricts();
    }
  }, [stateName]);

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
        {/* Back Button */}
        <Link
          href="/states"
          className="inline-flex items-center gap-2 glass rounded-xl px-4 py-2 mb-6 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to States
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              {stateName}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {districts.length} districts with MGNREGA data
          </p>
        </motion.div>

        {/* Districts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district, index) => (
            <motion.div
              key={district.district_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/district/${encodeURIComponent(district.district_name)}`}
                className="block"
              >
                <div className="glass rounded-2xl p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {district.district_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {district.district_code}
                      </p>
                    </div>
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">View Performance</span>
                  </div>

                  {district.last_synced && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(district.last_synced).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {districts.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">
              No district data available for {stateName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
