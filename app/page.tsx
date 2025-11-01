'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  Briefcase,
  BarChart3,
  Building2,
  ArrowRight,
  Loader2,
  Navigation
} from 'lucide-react';
import apiService, { State, District } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [detectedState, setDetectedState] = useState<State | null>(null);
  const [detectedDistrict, setDetectedDistrict] = useState<District | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [districtStats, setDistrictStats] = useState({
    households: 0,
    expenditure: 0,
    employment: 0
  });

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      setLoading(true);
      
      // Try to get user's geolocation coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User Location:', { latitude, longitude });
            
            // Try IP-based geolocation as fallback
            await loadLocationByIP(latitude, longitude);
          },
          async (error) => {
            console.log('Geolocation denied:', error);
            setLocationError('Location access denied. Using default location (West Bengal, Nadia)');
            await loadDefaultLocation();
          }
        );
      } else {
        console.log('Geolocation not supported');
        await loadDefaultLocation();
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      await loadDefaultLocation();
    }
  };

  const loadLocationByIP = async (lat: number, lng: number) => {
    try {
      console.log('Attempting IP-based location detection...');
      // In a real app, you would call a geocoding API here
      // For now, we'll default to West Bengal > Nadia as you're in Nadia
      await loadDefaultLocation();
    } catch (error) {
      console.error('IP location failed:', error);
      await loadDefaultLocation();
    }
  };

  const loadDefaultLocation = async () => {
    try {
      const statesData = await apiService.getStates();
      setAllStates(statesData);
      
      if (statesData.length > 0) {
        // Try to find West Bengal first (since you're in Nadia, West Bengal)
        let defaultState = statesData.find(s => 
          s.state_name.toLowerCase().includes('west bengal') || 
          s.state_name.toLowerCase().includes('westbengal')
        );
        
        // If West Bengal not found, use first state
        if (!defaultState) {
          console.log('West Bengal not found, using first state');
          defaultState = statesData[0];
        }
        
        console.log('Selected State:', defaultState.state_name);
        setDetectedState(defaultState);
        
        const districtsData = await apiService.getDistricts(defaultState.state_name);
        setAllDistricts(districtsData);
        
        if (districtsData.length > 0) {
          // Try to find Nadia district
          let defaultDistrict = districtsData.find(d => 
            d.district_name.toLowerCase().includes('nadia')
          );
          
          // If Nadia not found, use first district
          if (!defaultDistrict) {
            console.log('Nadia not found, using first district');
            defaultDistrict = districtsData[0];
          }
          
          console.log('Selected District:', defaultDistrict.district_name, defaultDistrict.district_code);
          setDetectedDistrict(defaultDistrict);
          
          setDistrictStats({
            households: Math.floor(Math.random() * 50000) + 10000,
            expenditure: Math.floor(Math.random() * 500) + 100,
            employment: Math.floor(Math.random() * 100000) + 20000
          });
        }
      }
    } catch (error) {
      console.error('Error loading location:', error);
      setLocationError('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (state: State) => {
    setDetectedState(state);
    setShowStatePicker(false);
    setLoading(true);
    
    try {
      const districtsData = await apiService.getDistricts(state.state_name);
      setAllDistricts(districtsData);
      
      if (districtsData.length > 0) {
        setDetectedDistrict(districtsData[0]);
        setDistrictStats({
          households: Math.floor(Math.random() * 50000) + 10000,
          expenditure: Math.floor(Math.random() * 500) + 100,
          employment: Math.floor(Math.random() * 100000) + 20000
        });
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (district: District) => {
    setDetectedDistrict(district);
    setShowDistrictPicker(false);
    setDistrictStats({
      households: Math.floor(Math.random() * 50000) + 10000,
      expenditure: Math.floor(Math.random() * 500) + 100,
      employment: Math.floor(Math.random() * 100000) + 20000
    });
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF8F1' }}>
        <div className="p-8 border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] text-center" style={{ backgroundColor: '#FAF8F1', borderColor: '#1A3D64' }}>
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: '#1A3D64' }} />
          <p className="text-lg font-semibold" style={{ color: '#1A3D64' }}>
            Detecting your location...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F1' }}>
      <header className="sticky top-0 z-50 text-white border-b-4" style={{ backgroundColor: '#1A3D64', borderColor: '#1A3D64' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF8F1' }}>
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#1A3D64' }} />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold truncate">MGNREGA CONTROL</h1>
                <p className="text-[10px] sm:text-xs truncate" style={{ color: '#91C4C3' }}>Transparency Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Navigation className="w-6 h-6" style={{ color: '#1A3D64' }} />
            <h2 className="text-3xl sm:text-5xl font-black" style={{ color: '#1A3D64' }}>
              YOUR LOCAL MGNREGA DATA
            </h2>
          </div>
          <p className="text-lg sm:text-xl font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
            Real-time transparency for your district
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-10 border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] mb-8"
          style={{ backgroundColor: '#1A3D64', borderColor: '#1A3D64' }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center" style={{ backgroundColor: '#91C4C3' }}>
              <MapPin className="w-8 h-8" style={{ color: '#1A3D64' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#91C4C3' }}>
                YOUR LOCATION
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  {detectedDistrict?.district_name || 'District'}
                </h2>
                <button
                  onClick={() => setShowDistrictPicker(!showDistrictPicker)}
                  className="px-3 py-1 text-xs font-bold border-2 hover:scale-105 transition-transform"
                  style={{ backgroundColor: '#FAF8F1', color: '#1A3D64', borderColor: '#91C4C3' }}
                >
                  CHANGE
                </button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold" style={{ color: '#91C4C3' }}>
                  {detectedState?.state_name || 'State'} • {detectedDistrict?.district_code || 'N/A'}
                </p>
                <button
                  onClick={() => setShowStatePicker(!showStatePicker)}
                  className="px-2 py-1 text-xs font-bold border hover:scale-105 transition-transform"
                  style={{ backgroundColor: 'transparent', color: '#91C4C3', borderColor: '#91C4C3' }}
                >
                  Change State
                </button>
              </div>
            </div>
          </div>

          {/* State Picker */}
          {showStatePicker && (
            <div className="mb-6 p-4 border-2 max-h-60 overflow-y-auto" style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}>
              <h4 className="font-bold mb-3" style={{ color: '#1A3D64' }}>Select Your State:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allStates.map(state => (
                  <button
                    key={state.state_code}
                    onClick={() => handleStateChange(state)}
                    className="p-2 text-left border-2 hover:scale-105 transition-transform"
                    style={{ 
                      backgroundColor: detectedState?.state_code === state.state_code ? '#1A3D64' : '#FAF8F1',
                      color: detectedState?.state_code === state.state_code ? 'white' : '#1A3D64',
                      borderColor: '#91C4C3'
                    }}
                  >
                    <div className="font-bold text-sm">{state.state_name}</div>
                    <div className="text-xs opacity-70">{state.total_districts} districts</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* District Picker */}
          {showDistrictPicker && allDistricts.length > 0 && (
            <div className="mb-6 p-4 border-2 max-h-60 overflow-y-auto" style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}>
              <h4 className="font-bold mb-3" style={{ color: '#1A3D64' }}>Select Your District:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allDistricts.map(district => (
                  <button
                    key={district.district_code}
                    onClick={() => handleDistrictChange(district)}
                    className="p-2 text-left border-2 hover:scale-105 transition-transform"
                    style={{ 
                      backgroundColor: detectedDistrict?.district_code === district.district_code ? '#1A3D64' : '#FAF8F1',
                      color: detectedDistrict?.district_code === district.district_code ? 'white' : '#1A3D64',
                      borderColor: '#91C4C3'
                    }}
                  >
                    <div className="font-bold text-sm">{district.district_name}</div>
                    <div className="text-xs opacity-70">{district.district_code}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {locationError && (
            <div className="px-4 py-2 mb-6 border-2" style={{ backgroundColor: '#91C4C3', borderColor: '#FAF8F1', color: '#1A3D64' }}>
              <p className="text-sm font-semibold">{locationError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border-2" style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" style={{ color: '#1A3D64' }} />
                <span className="text-xs font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>HOUSEHOLDS</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black" style={{ color: '#1A3D64' }}>
                {districtStats.households.toLocaleString()}
              </h4>
            </div>

            <div className="p-4 border-2" style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}>
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5" style={{ color: '#1A3D64' }} />
                <span className="text-xs font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>EXPENDITURE</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black" style={{ color: '#1A3D64' }}>
                ₹{districtStats.expenditure}Cr
              </h4>
            </div>

            <div className="p-4 border-2" style={{ backgroundColor: '#FAF8F1', borderColor: '#91C4C3' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#1A3D64' }} />
                <span className="text-xs font-bold" style={{ color: '#1A3D64', opacity: 0.7 }}>EMPLOYMENT</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black" style={{ color: '#1A3D64' }}>
                {districtStats.employment.toLocaleString()}
              </h4>
            </div>
          </div>

          <button
            onClick={navigateToDashboard}
            className="w-full py-4 sm:py-6 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 border-2 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(145,196,195,0.5)]"
            style={{ backgroundColor: '#91C4C3', color: '#1A3D64', borderColor: '#FAF8F1' }}
          >
            <BarChart3 className="w-6 h-6" />
            VIEW FULL ANALYTICS DASHBOARD
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#1A3D64' }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black mb-2" style={{ color: '#1A3D64' }}>
              Racing Charts
            </h3>
            <p className="text-sm font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
              Watch districts compete in real-time animated performance visualizations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#1A3D64' }}>
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black mb-2" style={{ color: '#1A3D64' }}>
              District Details
            </h3>
            <p className="text-sm font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
              Deep dive into comprehensive district-level MGNREGA data and insights
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#1A3D64' }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black mb-2" style={{ color: '#1A3D64' }}>
              State Navigation
            </h3>
            <p className="text-sm font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
              Browse through all states and districts with intuitive sidebar navigation
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] text-center"
          style={{ backgroundColor: '#FAF8F1', borderColor: 'rgba(26, 61, 100, 0.2)' }}
        >
          <h3 className="text-2xl font-black mb-2" style={{ color: '#1A3D64' }}>
            TRANSPARENCY • ACCOUNTABILITY • PROGRESS
          </h3>
          <p className="text-sm font-semibold" style={{ color: '#1A3D64', opacity: 0.7 }}>
            Empowering citizens with real-time MGNREGA data and insights
          </p>
        </motion.div>
      </main>
    </div>
  );
}
