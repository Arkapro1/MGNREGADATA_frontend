'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  TrendingUp,
  ChevronRight,
  Building2,
  Filter,
  SortAsc,
  Users,
  IndianRupee
} from 'lucide-react';
import { District } from '@/lib/api';

interface DistrictSidebarProps {
  districts: District[];
  selectedDistrict: string | null;
  onDistrictSelect: (districtCode: string) => void;
  stateName?: string;
}

export default function DistrictSidebar({
  districts,
  selectedDistrict,
  onDistrictSelect,
  stateName
}: DistrictSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'code'>('name');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter districts based on search
  const filteredDistricts = districts.filter(district =>
    district.district_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.district_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort districts
  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.district_name.localeCompare(b.district_name);
    }
    return a.district_code.localeCompare(b.district_code);
  });

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 hover:scale-110 transition-transform"
        style={{
          backgroundColor: '#1A3D64',
          borderColor: '#91C4C3',
          color: '#FAF8F1'
        }}
      >
        <Building2 className="w-6 h-6" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`border-r-4 h-[calc(100vh-80px)] sticky top-[80px] transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-80'
        } ${isMobileMenuOpen ? 'fixed left-0 z-50 lg:static' : 'hidden lg:block'}`}
        style={{ 
          backgroundColor: '#1A3D64',
          borderRightColor: '#91C4C3'
        }}
      >
        <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b-4" style={{ 
          borderBottomColor: '#91C4C3',
          backgroundColor: '#1A3D64'
        }}>
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6" style={{ color: '#91C4C3' }} />
                <h2 className="text-xl font-black" style={{ color: '#FAF8F1' }}>ALL DISTRICTS</h2>
              </div>
              {stateName && (
                <p className="text-sm font-semibold" style={{ color: '#91C4C3' }}>
                  {stateName} • {districts.length} Districts
                </p>
              )}
            </>
          )}
          {isCollapsed && (
            <Building2 className="w-6 h-6 mx-auto" style={{ color: '#91C4C3' }} />
          )}
        </div>

        {!isCollapsed && (
          <>
            {/* Search Bar */}
            <div className="p-4 border-b-2" style={{ borderBottomColor: '#91C4C3' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#91C4C3' }} />
                <input
                  type="text"
                  placeholder="Search districts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 outline-none text-sm font-semibold placeholder-gray-400"
                  style={{ 
                    backgroundColor: '#FAF8F1',
                    borderColor: '#91C4C3',
                    color: '#1A3D64'
                  }}
                />
              </div>

              {/* Sort Options */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSortBy('name')}
                  className="flex-1 px-3 py-2 text-xs font-bold border-2 transition-all"
                  style={{
                    backgroundColor: sortBy === 'name' ? '#91C4C3' : '#FAF8F1',
                    borderColor: '#91C4C3',
                    color: sortBy === 'name' ? '#1A3D64' : '#1A3D64'
                  }}
                >
                  <SortAsc className="w-3 h-3 inline mr-1" />
                  NAME
                </button>
                <button
                  onClick={() => setSortBy('code')}
                  className="flex-1 px-3 py-2 text-xs font-bold border-2 transition-all"
                  style={{
                    backgroundColor: sortBy === 'code' ? '#91C4C3' : '#FAF8F1',
                    borderColor: '#91C4C3',
                    color: sortBy === 'code' ? '#1A3D64' : '#1A3D64'
                  }}
                >
                  <Filter className="w-3 h-3 inline mr-1" />
                  CODE
                </button>
              </div>
            </div>

            {/* Districts List */}
            <div className="flex-1 overflow-y-auto" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#91C4C3 #1A3D64'
            }}>
              <AnimatePresence mode="popLayout">
                {sortedDistricts.length > 0 ? (
                  sortedDistricts.map((district, index) => {
                    const isSelected = selectedDistrict === district.district_code;
                    
                    return (
                      <motion.button
                        key={district.district_code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.01, duration: 0.2 }}
                        onClick={() => onDistrictSelect(district.district_code)}
                        className="w-full p-4 text-left border-b-2 transition-all duration-150 group"
                        style={{
                          backgroundColor: isSelected ? '#91C4C3' : '#1A3D64',
                          borderBottomColor: '#91C4C3'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-base mb-1 truncate"
                              style={{ color: isSelected ? '#1A3D64' : '#FAF8F1' }}
                            >
                              {district.district_name}
                            </h3>
                            <p className="text-sm font-medium truncate"
                              style={{ color: isSelected ? '#1A3D64' : '#91C4C3' }}
                            >
                              Code: {district.district_code}
                            </p>
                            
                            {/* Mock stats preview */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" style={{ color: isSelected ? '#1A3D64' : '#91C4C3' }} />
                                <span className="text-sm font-bold" style={{ color: isSelected ? '#1A3D64' : '#FAF8F1' }}>
                                  {Math.floor(Math.random() * 50) + 10}K
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" style={{ color: isSelected ? '#1A3D64' : '#91C4C3' }} />
                                <span className="text-sm font-bold" style={{ color: isSelected ? '#1A3D64' : '#FAF8F1' }}>
                                  ₹{Math.floor(Math.random() * 500) + 50}L
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight 
                            className="w-5 h-5 flex-shrink-0 transition-transform duration-150"
                            style={{ 
                              color: isSelected ? '#1A3D64' : '#91C4C3',
                              transform: isSelected ? 'translateX(4px)' : 'translateX(0)'
                            }}
                          />
                        </div>

                        {/* Last synced info */}
                        {district.last_synced && (
                          <div className="mt-2 pt-2 border-t"
                            style={{ borderTopColor: isSelected ? '#1A3D64' : '#91C4C3' }}
                          >
                            <p className="text-sm font-medium"
                              style={{ color: isSelected ? '#1A3D64' : '#91C4C3' }}
                            >
                              Last synced: {new Date(district.last_synced).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: '#91C4C3' }} />
                    <p className="text-base font-medium" style={{ color: '#91C4C3' }}>
                      No districts found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t-4" style={{ 
              borderTopColor: '#91C4C3',
              backgroundColor: '#1A3D64'
            }}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold" style={{ color: '#91C4C3' }}>TOTAL DISTRICTS</span>
                <span className="font-black text-xl" style={{ color: '#FAF8F1' }}>{districts.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="font-bold" style={{ color: '#91C4C3' }}>SHOWING</span>
                <span className="font-black text-xl" style={{ color: '#FAF8F1' }}>{filteredDistricts.length}</span>
              </div>
            </div>
          </>
        )}

        {/* Collapse Button - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full items-center justify-center border-2 shadow-lg hover:scale-110 transition-transform z-10"
          style={{
            backgroundColor: '#91C4C3',
            borderColor: '#FAF8F1',
            color: '#1A3D64'
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>
      </div>
    </motion.div>
    </>
  );
}
