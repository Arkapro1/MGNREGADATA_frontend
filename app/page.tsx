'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  Briefcase,
  Calendar,
  ChevronDown,
  BarChart3,
  Building2
} from 'lucide-react';
import RacingBarChart from '@/components/RacingBarChart';
import ChartInfo from '@/components/ChartInfo';
import apiService, { State, District } from '@/lib/api';

export default function Home() {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesData = await apiService.getStates();
        setStates(statesData);

        // Auto-select first state
        if (statesData.length > 0) {
          const defaultState = statesData[0];
          setSelectedState(defaultState);
          
          // Fetch districts for the state
          const districtsData = await apiService.getDistricts(defaultState.state_name);
          setDistricts(districtsData);

          // Generate mock racing chart data
          generateChartData(districtsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (districtsData: District[]) => {
    const years = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25'];
    const data: any[] = [];

    // Use ALL districts, not just slice
    districtsData.forEach(district => {
      years.forEach(year => {
        data.push({
          district: district.district_name,
          value: Math.floor(Math.random() * 100000) + 10000,
          year: year
        });
      });
    });

    setChartData(data);
  };

  const handleStateChange = async (state: State) => {
    setSelectedState(state);
    setMenuOpen(false);
    setLoading(true);

    try {
      const districtsData = await apiService.getDistricts(state.state_name);
      setDistricts(districtsData);
      generateChartData(districtsData);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-center mt-4 text-black font-semibold">Loading MGNREGA Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Black and White Header */}
      <header className="sticky top-0 z-50 bg-black text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold truncate">MGNREGA CONTROL</h1>
                <p className="text-[10px] sm:text-xs text-gray-300 truncate">Transparency Dashboard</p>
              </div>
            </div>

            {/* State Selector */}
                        {/* State Selector */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-black/20 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span className="text-sm font-bold text-black">
                {selectedState?.state_name || 'Select State'}
              </span>
              <ChevronDown className={`w-5 h-5 text-black transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* State Selection Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white border-b-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] max-h-[70vh] overflow-y-auto z-50"
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {states.map(state => (
                    <button
                      key={state.state_code}
                      onClick={() => handleStateChange(state)}
                      className={`p-3 text-left border-2 border-black transition-all touch-manipulation active:scale-95 ${
                        selectedState?.state_code === state.state_code
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-sm">{state.state_name}</div>
                      <div className={`text-xs ${selectedState?.state_code === state.state_code ? 'text-gray-300' : 'text-gray-600'}`}>
                        {state.total_districts} districts
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Location Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black text-white p-4 sm:p-8 border-2 sm:border-4 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300 font-semibold">CURRENTLY VIEWING</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mb-1 break-words">{selectedState?.state_name}</h2>
              <p className="text-gray-300 text-xs sm:text-sm font-semibold">
                {districts.length} Districts • {selectedState?.state_code}
              </p>
            </div>
            <div className="bg-white text-black px-3 py-1 font-bold text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              ACTIVE
            </div>
          </div>
        </motion.div>

        {/* Racing Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 border-4 border-black/20 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-black">
                DISTRICT PERFORMANCE RACE
              </h3>
              <p className="text-sm text-gray-600 font-semibold">
                Top 10 districts by expenditure over years
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-black" />
          </div>
          
          {/* Chart Info Component */}
          <ChartInfo />
          
          {chartData.length > 0 ? (
            <div className="mt-4">
              <RacingBarChart data={chartData} />
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              <p>Loading chart data...</p>
            </div>
          )}
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-5 border-4 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="bg-black text-white px-2 py-1 text-xs font-bold">TOTAL</span>
            </div>
            <h4 className="text-4xl font-black text-black mb-1">
              {districts.length}
            </h4>
            <p className="text-sm text-gray-600 font-bold">DISTRICTS</p>
            <div className="mt-3 h-2 bg-gray-200 border border-black">
              <div className="h-full bg-black" style={{ width: '75%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-5 border-4 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="bg-black text-white px-2 py-1 text-xs font-bold">ACTIVE</span>
            </div>
            <h4 className="text-4xl font-black text-black mb-1">
              {Math.floor(Math.random() * 50000) + 10000}
            </h4>
            <p className="text-sm text-gray-600 font-bold">HOUSEHOLDS</p>
            <div className="mt-3 h-2 bg-gray-200 border border-black">
              <div className="h-full bg-black" style={{ width: '85%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-5 border-4 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <span className="bg-black text-white px-2 py-1 text-xs font-bold">₹</span>
            </div>
            <h4 className="text-4xl font-black text-black mb-1">
              {Math.floor(Math.random() * 500) + 100}Cr
            </h4>
            <p className="text-sm text-gray-600 font-bold">EXPENDITURE</p>
            <div className="mt-3 h-2 bg-gray-200 border border-black">
              <div className="h-full bg-black" style={{ width: '65%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-5 border-4 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="bg-black text-white px-2 py-1 text-xs font-bold">FY</span>
            </div>
            <h4 className="text-4xl font-black text-black mb-1">
              2024-25
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Year</p>
            <div className="mt-3 mat-progress">
              <div className="mat-progress-bar" style={{ width: '90%' }}></div>
            </div>
          </motion.div>
        </div>

        {/* Districts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border-4 border-black/20 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-black">
                ALL DISTRICTS
              </h3>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Click on any district for detailed analytics
              </p>
            </div>
            <div className="bg-black text-white px-3 py-1 font-bold text-sm">
              {districts.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts.map((district, index) => {
              const isExpanded = expandedDistrict === district.district_code;
              return (
                <motion.div
                  key={district.district_code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.02 }}
                  className={`bg-white border-2 border-black transition-all ${
                    isExpanded ? 'col-span-full' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedDistrict(isExpanded ? null : district.district_code)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-black text-black mb-1">
                          {district.district_name}
                        </h4>
                        <p className="text-xs text-gray-600 font-medium">
                          Code: {district.district_code}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-black" />
                        <ChevronDown 
                          className={`w-5 h-5 text-black transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t-2 border-black overflow-hidden"
                      >
                        <div className="p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border-2 border-black p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-black" />
                                <span className="text-xs font-bold text-gray-600">HOUSEHOLDS</span>
                              </div>
                              <p className="text-2xl font-black text-black">
                                {Math.floor(Math.random() * 50000) + 5000}
                              </p>
                            </div>
                            
                            <div className="bg-white border-2 border-black p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <IndianRupee className="w-5 h-5 text-black" />
                                <span className="text-xs font-bold text-gray-600">EXPENDITURE</span>
                              </div>
                              <p className="text-2xl font-black text-black">
                                ₹{Math.floor(Math.random() * 500) + 50}L
                              </p>
                            </div>
                            
                            <div className="bg-white border-2 border-black p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-black" />
                                <span className="text-xs font-bold text-gray-600">EMPLOYMENT</span>
                              </div>
                              <p className="text-2xl font-black text-black">
                                {Math.floor(Math.random() * 100)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-4 bg-white border-2 border-black">
                            <p className="text-xs font-bold text-gray-600 mb-2">LAST SYNCED</p>
                            <p className="text-sm font-medium text-black">
                              {district.last_synced 
                                ? new Date(district.last_synced).toLocaleString() 
                                : 'Not available'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
