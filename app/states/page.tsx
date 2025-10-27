'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import apiService, { State } from '@/lib/api';

export default function StatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await apiService.getStates();
        setStates(data);
        setFilteredStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const filtered = states.filter((state) =>
      state.state_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [searchQuery, states]);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            All States
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore MGNREGA data across {states.length} Indian states and union territories
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </motion.div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state, index) => (
            <motion.div
              key={state.state_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/states/${encodeURIComponent(state.state_name)}`}
                className="block"
              >
                <div className="glass rounded-2xl p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {state.state_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {state.state_code}
                      </p>
                    </div>
                    <MapPin className="w-6 h-6 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        {state.total_districts}
                      </p>
                      <p className="text-xs text-gray-500">Districts</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>

                  {state.last_synced && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500">
                        Last synced: {new Date(state.last_synced).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No states found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
