'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  RefreshCw, 
  Database, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import apiService, { DBStats, SyncStatus } from '@/lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState<DBStats | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, syncData] = await Promise.all([
        apiService.getStats(),
        apiService.getSyncStatus(5),
      ]);
      setStats(statsData);
      setSyncStatus(syncData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiService.triggerSync();
      alert('Sync initiated successfully! This may take a few minutes.');
      // Refresh data after 10 seconds
      setTimeout(() => {
        fetchData();
        setSyncing(false);
      }, 10000);
    } catch (error) {
      console.error('Error triggering sync:', error);
      alert('Failed to initiate sync. Please try again.');
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
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
            <Settings className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Admin Panel
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage data synchronization and monitor system status
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Trigger Manual Sync'}
            </button>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-6 py-3 glass rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <Database className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </motion.div>

        {/* Database Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Records"
            value={stats?.total_records || '0'}
            icon={<Database className="w-6 h-6" />}
            delay={0.3}
          />
          <StatCard
            title="States"
            value={stats?.total_states || '0'}
            icon={<CheckCircle className="w-6 h-6" />}
            delay={0.4}
          />
          <StatCard
            title="Districts"
            value={stats?.total_districts || '0'}
            icon={<AlertCircle className="w-6 h-6" />}
            delay={0.5}
          />
          <StatCard
            title="Years"
            value={stats?.total_years || '0'}
            icon={<Clock className="w-6 h-6" />}
            delay={0.6}
          />
        </div>

        {/* Sync History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Sync History</h2>
          <div className="space-y-4">
            {syncStatus.map((sync, index) => (
              <motion.div
                key={sync.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(sync.status)}
                    <div>
                      <h3 className="font-semibold">
                        {sync.sync_type === 'scheduled' ? 'Scheduled Sync' : 'Manual Sync'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sync.state_name || 'All States'} • {sync.fin_year || 'All Years'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{sync.records_synced} records</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sync.completed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {sync.error_message && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                    {sync.error_message}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
