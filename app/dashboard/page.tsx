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
import DistrictSidebar from '@/components/DistrictSidebar';
import DistrictDetailsPanel from '@/components/DistrictDetailsPanel';
import apiService, { State, District } from '@/lib/api';

export default function Home() {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(null);

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

          // Auto-select first district
          if (districtsData.length > 0) {
            setSelectedDistrictCode(districtsData[0].district_code);
          }

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
      
      // Auto-select first district
      if (districtsData.length > 0) {
        setSelectedDistrictCode(districtsData[0].district_code);
      }
      
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

  // Get selected district details
  const selectedDistrict = districts.find(d => d.district_code === selectedDistrictCode);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F1' }}>
      {/* Header with new color scheme */}
      <header className="sticky top-0 z-50 text-white border-b-4" style={{ backgroundColor: '#1A3D64', borderColor: '#1A3D64' }}>
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
              className="flex items-center gap-3 px-4 py-2 border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-x-[1px] active:translate-y-[1px]"
              style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.3)' }}
            >
              <span className="text-sm font-bold" style={{ color: '#1A3D64' }}>
                {selectedState?.state_name || 'Select State'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} style={{ color: '#1A3D64' }} />
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
                className="absolute top-full left-0 right-0 border-b-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] max-h-[70vh] overflow-y-auto z-50"
                style={{ 
                  backgroundColor: '#FAF8F1',
                  borderColor: '#1A3D64',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {states.map(state => (
                    <button
                      key={state.state_code}
                      onClick={() => handleStateChange(state)}
                      className={`p-3 text-left border-2 transition-all touch-manipulation active:scale-95 ${
                        selectedState?.state_code === state.state_code
                          ? 'text-white'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: selectedState?.state_code === state.state_code ? '#1A3D64' : '#FAF8F1',
                        borderColor: '#1A3D64',
                        color: selectedState?.state_code === state.state_code ? 'white' : '#1A3D64'
                      }}
                    >
                      <div className="font-bold text-sm">{state.state_name}</div>
                      <div className={`text-xs ${selectedState?.state_code === state.state_code ? 'text-gray-300' : 'opacity-70'}`}>
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

      {/* Main Content with 3-Column Layout */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - District List */}
        <DistrictSidebar
          districts={districts}
          selectedDistrict={selectedDistrictCode}
          onDistrictSelect={setSelectedDistrictCode}
          stateName={selectedState?.state_name}
        />

        {/* Center - Main Content Area */}
        <div className="flex-1 overflow-y-auto main-content-scroll" style={{ backgroundColor: '#FAF8F1' }}>
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Location Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white p-4 sm:p-8 border-2 sm:border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]"
          style={{ backgroundColor: '#1A3D64', borderColor: 'rgba(26, 61, 100, 0.3)' }}
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold" style={{ color: '#91C4C3' }}>CURRENTLY VIEWING</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black mb-1 break-words">{selectedState?.state_name}</h2>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: '#91C4C3' }}>
                {districts.length} Districts • {selectedState?.state_code}
              </p>
            </div>
            <div className="px-3 py-1 font-bold text-sm flex items-center gap-1" style={{ backgroundColor: '#91C4C3', color: '#1A3D64' }}>
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
              className="p-6 border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]"
              style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black" style={{ color: '#1A3D64' }}>
                    DISTRICT PERFORMANCE RACE
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
                    All districts performance over years - Animated visualization
                  </p>
                </div>
                <BarChart3 className="w-8 h-8" style={{ color: '#1A3D64' }} />
              </div>
              
              {/* Chart Info Component */}
              <ChartInfo />
              
              {chartData.length > 0 ? (
                <div className="mt-4">
                  <RacingBarChart data={chartData} />
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center" style={{ color: '#1A3D64', opacity: 0.5 }}>
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
            className="p-5 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#1A3D64' }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#1A3D64' }}>TOTAL</span>
            </div>
            <h4 className="text-4xl font-black mb-1" style={{ color: '#1A3D64' }}>
              {districts.length}
            </h4>
            <p className="text-sm font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>DISTRICTS</p>
            <div className="mt-3 h-2 border" style={{ backgroundColor: '#91C4C3', opacity: 0.3, borderColor: '#1A3D64' }}>
              <div className="h-full" style={{ backgroundColor: '#1A3D64', width: '75%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#1A3D64' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#1A3D64' }}>ACTIVE</span>
            </div>
            <h4 className="text-4xl font-black mb-1" style={{ color: '#1A3D64' }}>
              {Math.floor(Math.random() * 50000) + 10000}
            </h4>
            <p className="text-sm font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>HOUSEHOLDS</p>
            <div className="mt-3 h-2 border" style={{ backgroundColor: '#91C4C3', opacity: 0.3, borderColor: '#1A3D64' }}>
              <div className="h-full" style={{ backgroundColor: '#1A3D64', width: '85%' }}></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="p-5 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#1A3D64' }}>
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#1A3D64' }}>₹</span>
            </div>
            <h4 className="text-4xl font-black mb-1" style={{ color: '#1A3D64' }}>
              {Math.floor(Math.random() * 500) + 100}Cr
            </h4>
            <p className="text-sm font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>EXPENDITURE</p>
            <div className="mt-3 h-2 border" style={{ backgroundColor: '#91C4C3', opacity: 0.3, borderColor: '#1A3D64' }}>
              <div className="h-full" style={{ backgroundColor: '#1A3D64', width: '65%' }}></div>
            </div>
          </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-5 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#1A3D64' }}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: '#1A3D64' }}>FY</span>
                </div>
                <h4 className="text-4xl font-black mb-1" style={{ color: '#1A3D64' }}>
                  2024-25
                </h4>
                <p className="text-sm font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>Current Year</p>
                <div className="mt-3 h-2 border" style={{ backgroundColor: '#91C4C3', opacity: 0.3, borderColor: '#1A3D64' }}>
                  <div className="h-full" style={{ backgroundColor: '#1A3D64', width: '90%' }}></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - District Details */}
        {selectedDistrict && selectedState && (
          <DistrictDetailsPanel
            districtCode={selectedDistrict.district_code}
            districtName={selectedDistrict.district_name}
            stateName={selectedState.state_name}
          />
        )}
      </main>
    </div>
  );
}
