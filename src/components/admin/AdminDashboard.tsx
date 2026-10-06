import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Scissors, 
  DollarSign, 
  Star, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  Database, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { 
  Appointment, 
  Service, 
  Staff, 
  Review, 
  GalleryItem, 
  SalonSettings, 
  CustomerProfile,
  AppointmentStatus,
  ServiceCategory 
} from '../../types';
import { DatabaseService, subscribeToDatabase } from '../../lib/database';
import { SUPABASE_SCHEMA_SQL, isSupabaseConfigured } from '../../lib/supabase';
import { SafeImage } from '../common/SafeImage';

interface AdminDashboardProps {
  onLogout: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onExitAdmin }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'services' | 'staff' | 'availability' | 'customers' | 'reviews' | 'gallery' | 'settings' | 'supabase'
  >('overview');

  // State data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SalonSettings>(DatabaseService.getSettings());
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  // Search & Filter for appointments
  const [aptSearch, setAptSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  // Modals
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [isWalkInBookingOpen, setIsWalkInBookingOpen] = useState(false);

  const [copiedSql, setCopiedSql] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadAllData = () => {
    setAppointments(DatabaseService.getAppointments());
    setServices(DatabaseService.getServices());
    setStaffList(DatabaseService.getStaff());
    setReviews(DatabaseService.getReviews());
    setGallery(DatabaseService.getGallery());
    setSettings(DatabaseService.getSettings());
    setCustomers(DatabaseService.getCustomers());
  };

  useEffect(() => {
    loadAllData();
    const unsub = subscribeToDatabase(loadAllData);
    return () => unsub();
  }, []);

  // Stats computation
  const todayStr = new Date().toISOString().split('T')[0];
  
  const stats = useMemo(() => {
    const todayApts = appointments.filter(a => a.date === todayStr);
    const completed = appointments.filter(a => a.status === 'Completed');
    const totalRevenue = appointments
      .filter(a => a.status === 'Completed' || a.status === 'Confirmed')
      .reduce((sum, a) => sum + (a.service_price || 0), 0);

    return {
      totalBookings: appointments.length,
      todayBookingsCount: todayApts.length,
      completedCount: completed.length,
      totalRevenue,
      activeStaffCount: staffList.filter(s => s.is_active).length,
      pendingCount: appointments.filter(a => a.status === 'Pending').length,
    };
  }, [appointments, staffList, todayStr]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Status filter
      if (statusFilter !== 'All' && apt.status !== statusFilter) return false;

      // Date filter
      if (dateFilter === 'today' && apt.date !== todayStr) return false;
      if (dateFilter === 'upcoming' && (apt.date < todayStr || apt.status === 'Cancelled' || apt.status === 'Completed')) return false;

      // Search
      if (aptSearch.trim()) {
        const query = aptSearch.toLowerCase();
        const matchesName = apt.customer_name.toLowerCase().includes(query);
        const matchesCode = apt.booking_code.toLowerCase().includes(query);
        const matchesService = apt.service_name.toLowerCase().includes(query);
        const matchesStaff = apt.staff_name.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesService && !matchesStaff) return false;
      }

      return true;
    });
  }, [appointments, statusFilter, dateFilter, aptSearch, todayStr]);

  // Appointment status update
  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    DatabaseService.updateAppointmentStatus(id, status);
    showToast(`Appointment status updated to ${status}.`);
  };

  // Copy SQL script
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    showToast('Supabase PostgreSQL schema script copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1E2620]">
      {/* Admin Top Navigation */}
      <div className="bg-[#14241A] text-white border-b border-[#233D2D] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C6A364] text-[#14241A] flex items-center justify-center font-bold text-xs">
            DS
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-tight text-[#FAF7F2] leading-none">
              Demo Salon Admin ERP
            </h1>
            <span className="text-[10px] text-[#A5B9A6] tracking-wider uppercase">
              Management & Scheduling Control
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-full border border-[#44624D] text-[#D3E2D5] hover:bg-[#1E3527] text-xs font-medium transition"
          >
            Preview Customer View
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 hover:bg-red-900/60 text-xs font-medium transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3527] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#C6A364]/40 text-xs flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-[#C6A364]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-[#E8E2D5] rounded-2xl text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'services', label: `Services (${services.length})`, icon: Scissors },
            { id: 'staff', label: `Staff (${staffList.length})`, icon: Users },
            { id: 'availability', label: 'Hours & Shifts', icon: Clock },
            { id: 'customers', label: `Clients (${customers.length})`, icon: Users },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'gallery', label: `Lookbook (${gallery.length})`, icon: ImageIcon },
            { id: 'settings', label: 'Salon Settings', icon: Settings },
            { id: 'supabase', label: 'Supabase SQL', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition ${
                  isActive 
                    ? 'bg-[#1E3527] text-white shadow-sm' 
                    : 'text-[#4A574C] hover:bg-[#DDD5C7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E3DCce] shadow-xs">
                <div className="flex justify-between items-center text-xs text-[#788C71]">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#C6A364]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#1E3527] mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#788C71]">From confirmed & completed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E3DCce] shadow-xs">
                <div className="flex justify-between items-center text-xs text-[#788C71]">
                  <span>Today's Bookings</span>
                  <Calendar className="w-4 h-4 text-[#1E3527]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#1E3527] mt-2">
                  {stats.todayBookingsCount}
                </div>
                <span className="text-[10px] text-[#788C71]">{stats.pendingCount} pending confirmation</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E3DCce] shadow-xs">
                <div className="flex justify-between items-center text-xs text-[#788C71]">
                  <span>Active Master Stylists</span>
                  <Users className="w-4 h-4 text-[#788C71]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#1E3527] mt-2">
                  {stats.activeStaffCount}
                </div>
                <span className="text-[10px] text-[#788C71]">Zero double-booking guarantee</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E3DCce] shadow-xs">
                <div className="flex justify-between items-center text-xs text-[#788C71]">
                  <span>Completed Sessions</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#1E3527] mt-2">
                  {stats.completedCount}
                </div>
                <span className="text-[10px] text-[#788C71]">4.98 average rating</span>
              </div>
            </div>

            {/* Quick Actions & Recent Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E3DCce] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                    Upcoming Schedule Stream
                  </h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-semibold text-[#1E3527] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="divide-y divide-[#F0ECE1]">
                  {appointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EFECE5] flex items-center justify-center font-bold text-xs text-[#1E3527]">
                          {apt.customer_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#16281E]">{apt.customer_name}</h4>
                          <p className="text-[11px] text-[#788C71]">{apt.service_name} with {apt.staff_name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-medium text-[#1E3527] block">
                          {apt.date} at {apt.start_time}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-[#E3DCce] shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                  Concierge Quick Actions
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsWalkInBookingOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1E3527] text-white text-xs font-semibold hover:bg-[#14241A] transition text-left flex items-center justify-between"
                  >
                    <span>+ New Walk-in / Phone Reservation</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setIsAddServiceOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D5CDC0] text-[#1E3527] text-xs font-semibold hover:bg-[#FAF7F2] transition text-left flex items-center justify-between"
                  >
                    <span>+ Add New Salon Service</span>
                    <Scissors className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingStaff(null);
                      setIsAddStaffOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D5CDC0] text-[#1E3527] text-xs font-semibold hover:bg-[#FAF7F2] transition text-left flex items-center justify-between"
                  >
                    <span>+ Onboard New Stylist</span>
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('supabase')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#F0ECE1] text-[#1E3527] text-xs font-semibold hover:bg-[#E8E2D5] transition text-left flex items-center justify-between"
                  >
                    <span>Check Supabase Database Connection</span>
                    <Database className="w-4 h-4 text-[#C6A364]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                  Appointments & Scheduling
                </h3>
                <p className="text-xs text-[#788C71]">
                  Manage bookings, verify collision locks, and update statuses.
                </p>
              </div>

              <button
                onClick={() => setIsWalkInBookingOpen(true)}
                className="flex items-center gap-2 bg-[#1E3527] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#14241A] transition self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Walk-in Appointment</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#788C71]" />
                <input
                  type="text"
                  placeholder="Search client, code, stylist..."
                  value={aptSearch}
                  onChange={e => setAptSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-xs text-[#1E2620] focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-xs text-[#1E2620]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-show">No-show</option>
              </select>

              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value as any)}
                className="py-2 px-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-xs text-[#1E2620]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only</option>
                <option value="upcoming">Upcoming Only</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E5DECf]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F1E8] text-[#4A574C] font-semibold border-b border-[#E5DECf]">
                  <tr>
                    <th className="py-3 px-3.5">Code</th>
                    <th className="py-3 px-3.5">Guest</th>
                    <th className="py-3 px-3.5">Service</th>
                    <th className="py-3 px-3.5">Stylist</th>
                    <th className="py-3 px-3.5">Date & Time</th>
                    <th className="py-3 px-3.5">Price</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No appointments found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-[#FAF7F2] transition">
                        <td className="py-3 px-3.5 font-mono font-bold text-[#1E3527]">{apt.booking_code}</td>
                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-[#16281E] block">{apt.customer_name}</span>
                          <span className="text-[10px] text-[#788C71]">{apt.customer_phone}</span>
                        </td>
                        <td className="py-3 px-3.5 font-medium">{apt.service_name}</td>
                        <td className="py-3 px-3.5 text-[#526054]">{apt.staff_name}</td>
                        <td className="py-3 px-3.5 font-medium">
                          {apt.date} <br />
                          <span className="text-[11px] text-[#788C71]">{apt.start_time} - {apt.end_time}</span>
                        </td>
                        <td className="py-3 px-3.5 font-serif font-bold text-[#1E3527]">${apt.service_price}</td>
                        <td className="py-3 px-3.5">
                          <select
                            value={apt.status}
                            onChange={e => handleUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                            className="text-[11px] font-semibold px-2 py-1 rounded-md border border-[#D5CDC0] bg-white cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No-show">No-show</option>
                          </select>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                                className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                title="Confirm"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {apt.status !== 'Completed' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                                className="p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                                title="Mark Completed"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {apt.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                                className="p-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                  Salon Menu & Service Catalog
                </h3>
                <p className="text-xs text-[#788C71]">
                  Add, update, or deactivate services, pricing, and treatment duration.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService(null);
                  setIsAddServiceOpen(true);
                }}
                className="flex items-center gap-1.5 bg-[#1E3527] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#14241A] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(srv => (
                <div key={srv.id} className="p-4 rounded-xl border border-[#E5DECf] bg-[#FAF7F2] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71]">
                        {srv.category}
                      </span>
                      <span className="font-serif font-bold text-base text-[#1E3527]">
                        ${srv.price}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-[#16281E] mt-1">{srv.name}</h4>
                    <p className="text-xs text-[#6F7D71] mt-1 line-clamp-2">{srv.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#788C71]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.duration_min} minutes</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E1D2] flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      srv.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {srv.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsAddServiceOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#D5CDC0] text-[#1E3527] hover:bg-white"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${srv.name}?`)) {
                            DatabaseService.deleteService(srv.id);
                            showToast('Service removed.');
                          }
                        }}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                  Master Stylists & Barbers Roster
                </h3>
                <p className="text-xs text-[#788C71]">
                  Manage staff bios, specialties, and experience credentials.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingStaff(null);
                  setIsAddStaffOpen(true);
                }}
                className="flex items-center gap-1.5 bg-[#1E3527] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#14241A] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Stylist</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.map(stf => (
                <div key={stf.id} className="p-5 rounded-2xl border border-[#E5DECf] bg-[#FAF7F2] flex items-start gap-4">
                  <SafeImage
                    src={stf.photo_url}
                    alt={stf.name}
                    fallbackType="stylist"
                    className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#D5CDC0]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-[#16281E]">{stf.name}</h4>
                        <span className="text-xs text-[#788C71]">{stf.title}</span>
                      </div>
                      <span className="text-xs font-bold text-[#C6A364]">★ {stf.rating}</span>
                    </div>

                    <p className="text-xs text-[#526054] mt-2 line-clamp-2">{stf.bio}</p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {stf.specialties.map((sp, i) => (
                        <span key={i} className="text-[10px] bg-[#E8E2D5] text-[#3A473C] px-2 py-0.5 rounded-md">
                          {sp}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E1D2]">
                      <span className="text-[11px] text-[#788C71]">
                        Shift: {stf.work_start_time} - {stf.work_end_time}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingStaff(stf);
                            setIsAddStaffOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-md border border-[#D5CDC0] text-xs font-medium hover:bg-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${stf.name}?`)) {
                              DatabaseService.deleteStaff(stf.id);
                              showToast('Staff profile deleted.');
                            }
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AVAILABILITY & WORKING HOURS */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                Staff Working Hours & Shift Roster
              </h3>
              <p className="text-xs text-[#788C71]">
                Configure weekly working days and hours for each team member to dynamically prevent double booking.
              </p>
            </div>

            <div className="space-y-4">
              {staffList.map(stf => {
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return (
                  <div key={stf.id} className="p-4 rounded-xl border border-[#E5DECf] bg-[#FAF7F2] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img src={stf.photo_url} alt={stf.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-sm text-[#16281E]">{stf.name}</h4>
                          <span className="text-xs text-[#788C71]">{stf.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#526054] font-medium">Shift Hours:</span>
                        <input
                          type="time"
                          value={stf.work_start_time}
                          onChange={e => {
                            DatabaseService.saveStaff({ id: stf.id, name: stf.name, title: stf.title, work_start_time: e.target.value });
                            showToast(`Updated ${stf.name}'s start time.`);
                          }}
                          className="p-1 rounded border border-[#D5CDC0] bg-white text-xs"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={stf.work_end_time}
                          onChange={e => {
                            DatabaseService.saveStaff({ id: stf.id, name: stf.name, title: stf.title, work_end_time: e.target.value });
                            showToast(`Updated ${stf.name}'s end time.`);
                          }}
                          className="p-1 rounded border border-[#D5CDC0] bg-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Working days buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-xs text-[#526054] font-medium mr-2">Scheduled Days:</span>
                      {daysOfWeek.map((dayName, dayIndex) => {
                        const isWorking = stf.working_days.includes(dayIndex);
                        return (
                          <button
                            key={dayName}
                            onClick={() => {
                              const newDays = isWorking 
                                ? stf.working_days.filter(d => d !== dayIndex)
                                : [...stf.working_days, dayIndex].sort();
                              DatabaseService.saveStaff({ id: stf.id, name: stf.name, title: stf.title, working_days: newDays });
                              showToast(`Updated ${stf.name}'s scheduled days.`);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                              isWorking 
                                ? 'bg-[#1E3527] text-white shadow-xs' 
                                : 'bg-[#E5DECf] text-[#6E7B70] hover:bg-[#D5CDC0]'
                            }`}
                          >
                            {dayName} {isWorking ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                Client Sanctuary Directory
              </h3>
              <p className="text-xs text-[#788C71]">
                Complete records of clients, booking frequencies, and concierge notes.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E5DECf]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F1E8] text-[#4A574C] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Total Visits</th>
                    <th className="py-3 px-4">Concierge Preferences</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 px-4 font-semibold text-[#16281E]">{c.name}</td>
                      <td className="py-3 px-4 text-[#526054]">{c.email}</td>
                      <td className="py-3 px-4 text-[#526054]">{c.phone}</td>
                      <td className="py-3 px-4 font-serif font-bold text-[#1E3527]">{c.total_visits || 1}</td>
                      <td className="py-3 px-4 text-gray-600">{c.notes || 'Prefers organic herbal tea & serene setting.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                Reviews Moderation
              </h3>
              <p className="text-xs text-[#788C71]">
                Approve, feature, or manage customer feedback testimonials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl border border-[#E5DECf] bg-[#FAF7F2] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xs text-[#16281E]">{rev.customer_name}</h4>
                      <span className="text-[11px] text-[#788C71]">{rev.service_name} • {rev.date}</span>
                    </div>
                    <span className="text-xs font-bold text-[#C6A364]">{'★'.repeat(rev.rating)}</span>
                  </div>

                  <p className="text-xs text-[#526054] italic">"{rev.comment}"</p>

                  <div className="pt-2 border-t border-[#E8E1D2] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          DatabaseService.toggleReviewStatus(rev.id, 'is_approved');
                          showToast('Review approval toggled.');
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          rev.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.is_approved ? 'Approved' : 'Pending'}
                      </button>
                      <button
                        onClick={() => {
                          DatabaseService.toggleReviewStatus(rev.id, 'is_featured');
                          showToast('Review featured status toggled.');
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          rev.is_featured ? 'bg-[#C6A364] text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {rev.is_featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this review?')) {
                          DatabaseService.deleteReview(rev.id);
                          showToast('Review deleted.');
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                  Lookbook & Portfolio Media
                </h3>
                <p className="text-xs text-[#788C71]">
                  Manage high-resolution lookbook photos displayed on the public website.
                </p>
              </div>

              <button
                onClick={() => setIsAddGalleryOpen(true)}
                className="flex items-center gap-1.5 bg-[#1E3527] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#14241A] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lookbook Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden border border-[#E5DECf] shadow-xs">
                  <SafeImage src={item.image_url} alt={item.title} fallbackType="interior" className="w-full h-40 object-cover" />
                  <div className="p-2.5 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71] block">{item.category}</span>
                    <h5 className="font-semibold text-xs text-[#16281E] truncate">{item.title}</h5>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete lookbook image?')) {
                        DatabaseService.deleteGalleryItem(item.id);
                        showToast('Gallery image removed.');
                      }
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SALON SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 sm:p-8 shadow-xs max-w-2xl space-y-5">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                Salon Brand & Operating Settings
              </h3>
              <p className="text-xs text-[#788C71]">
                Configure salon branding, address, booking slot durations, and policy notices.
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                DatabaseService.saveSettings(settings);
                showToast('Salon settings successfully updated.');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Salon Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={e => setSettings({ ...settings, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Concierge Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">Address & Suite</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">City, State & Zip</label>
                <input
                  type="text"
                  value={settings.city_state_zip}
                  onChange={e => setSettings({ ...settings, city_state_zip: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={settings.banner_message}
                  onChange={e => setSettings({ ...settings, banner_message: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">Cancellation Policy Notice</label>
                <textarea
                  rows={2}
                  value={settings.cancellation_policy}
                  onChange={e => setSettings({ ...settings, cancellation_policy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#1E3527] text-white px-6 py-2.5 rounded-full font-semibold text-xs hover:bg-[#14241A] transition"
                >
                  Save Settings Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 10: SUPABASE SQL & POSTGRESQL INTEGRATION */}
        {activeTab === 'supabase' && (
          <div className="bg-white rounded-2xl border border-[#E3DCce] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#C6A364]" />
                  <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                    Supabase PostgreSQL Database Integration
                  </h3>
                </div>
                <p className="text-xs text-[#788C71] mt-1">
                  Ready-to-run SQL schema migration with Row Level Security (RLS) policies, tables, and collision indexes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isSupabaseConfigured 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-[#F0ECE1] text-[#788C71]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  {isSupabaseConfigured ? 'Connected to Supabase Project' : 'Using Offline-Ready Storage Engine'}
                </span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 bg-[#1E3527] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#14241A] transition shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#526054] space-y-2">
              <p className="font-semibold text-[#1E3527]">
                How to connect your external Supabase project:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a free project at <strong>supabase.com</strong>.</li>
                <li>Go to the <strong>SQL Editor</strong> in Supabase and paste the SQL script below, then click <strong>RUN</strong>.</li>
                <li>Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment variables.</li>
                <li>All data syncs seamlessly while preserving zero crash reliability!</li>
              </ol>
            </div>

            {/* SQL Code Box */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D5CDC0] bg-[#14241A]">
              <div className="bg-[#101D15] px-4 py-2.5 flex items-center justify-between border-b border-[#233D2D]">
                <span className="text-xs font-mono text-[#A5B9A6]">supabase_schema.sql</span>
                <button
                  onClick={handleCopySql}
                  className="text-xs text-[#C6A364] hover:underline font-mono"
                >
                  {copiedSql ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono text-[#D8E6DA] overflow-x-auto max-h-96 leading-relaxed">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT SERVICE */}
      {isAddServiceOpen && (
        <ServiceEditModal
          service={editingService}
          onClose={() => {
            setIsAddServiceOpen(false);
            setEditingService(null);
          }}
          onSave={newSrv => {
            DatabaseService.saveService(newSrv);
            setIsAddServiceOpen(false);
            setEditingService(null);
            showToast('Service saved successfully.');
          }}
        />
      )}

      {/* MODAL: ADD / EDIT STAFF */}
      {isAddStaffOpen && (
        <StaffEditModal
          staff={editingStaff}
          onClose={() => {
            setIsAddStaffOpen(false);
            setEditingStaff(null);
          }}
          onSave={newStf => {
            DatabaseService.saveStaff(newStf);
            setIsAddStaffOpen(false);
            setEditingStaff(null);
            showToast('Stylist profile saved successfully.');
          }}
        />
      )}

      {/* MODAL: ADD GALLERY ITEM */}
      {isAddGalleryOpen && (
        <GalleryAddModal
          onClose={() => setIsAddGalleryOpen(false)}
          onSave={item => {
            DatabaseService.addGalleryItem(item);
            setIsAddGalleryOpen(false);
            showToast('Lookbook image added.');
          }}
        />
      )}

      {/* MODAL: MANUAL WALK-IN BOOKING */}
      {isWalkInBookingOpen && (
        <WalkInBookingModal
          services={services}
          staffList={staffList}
          onClose={() => setIsWalkInBookingOpen(false)}
          onSuccess={apt => {
            setIsWalkInBookingOpen(false);
            showToast(`Walk-in booked! Code: ${apt.booking_code}`);
          }}
        />
      )}
    </div>
  );
};

// Sub-modal: Service Edit
const ServiceEditModal: React.FC<{
  service: Service | null;
  onClose: () => void;
  onSave: (service: any) => void;
}> = ({ service, onClose, onSave }) => {
  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState<ServiceCategory>(service?.category || 'Hair');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price?.toString() || '65');
  const [duration, setDuration] = useState(service?.duration_min?.toString() || '45');
  const [imageUrl, setImageUrl] = useState(service?.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-semibold text-[#16281E]">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button onClick={onClose} className="text-[#6F7D71] hover:text-[#16281E]">✕</button>
        </div>

        <form onSubmit={e => {
          e.preventDefault();
          onSave({
            ...(service ? { id: service.id } : {}),
            name,
            category,
            description,
            price: Number(price),
            duration_min: Number(duration),
            image_url: imageUrl,
            is_active: true,
          });
        }} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Service Title</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]">
              <option value="Hair">Hair</option>
              <option value="Barber">Barber</option>
              <option value="Color & Highlights">Color & Highlights</option>
              <option value="Spa & Beauty">Spa & Beauty</option>
              <option value="Bridal">Bridal</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4A574C] font-semibold mb-1">Price ($)</label>
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
            </div>
            <div>
              <label className="block text-[#4A574C] font-semibold mb-1">Duration (Min)</label>
              <input required type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
            </div>
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Photo Image URL</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold">Save Service</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-modal: Staff Edit
const StaffEditModal: React.FC<{
  staff: Staff | null;
  onClose: () => void;
  onSave: (staff: any) => void;
}> = ({ staff, onClose, onSave }) => {
  const [name, setName] = useState(staff?.name || '');
  const [title, setTitle] = useState(staff?.title || '');
  const [bio, setBio] = useState(staff?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(staff?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const [specialtiesStr, setSpecialtiesStr] = useState(staff?.specialties?.join(', ') || 'Balayage, Styling');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-semibold text-[#16281E]">
            {staff ? 'Edit Stylist' : 'Add New Stylist'}
          </h3>
          <button onClick={onClose} className="text-[#6F7D71] hover:text-[#16281E]">✕</button>
        </div>

        <form onSubmit={e => {
          e.preventDefault();
          onSave({
            ...(staff ? { id: staff.id } : {}),
            name,
            title,
            bio,
            photo_url: photoUrl,
            specialties: specialtiesStr.split(',').map(s => s.trim()).filter(Boolean),
          });
        }} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Full Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Title / Designation</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master Colorist & Stylist" className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Specialties (comma separated)</label>
            <input value={specialtiesStr} onChange={e => setSpecialtiesStr(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Bio</label>
            <textarea rows={2} value={bio} onChange={e => setBio(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Photo Image URL</label>
            <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold">Save Stylist</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-modal: Gallery Add
const GalleryAddModal: React.FC<{
  onClose: () => void;
  onSave: (item: any) => void;
}> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Hair' | 'Color' | 'Barber' | 'Bridal' | 'Spa' | 'Salon Interior'>('Hair');
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-semibold text-[#16281E]">Add Lookbook Media</h3>
          <button onClick={onClose} className="text-[#6F7D71] hover:text-[#16281E]">✕</button>
        </div>

        <form onSubmit={e => {
          e.preventDefault();
          onSave({ title, category, image_url: imageUrl });
        }} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]">
              <option value="Hair">Hair</option>
              <option value="Color">Color</option>
              <option value="Barber">Barber</option>
              <option value="Bridal">Bridal</option>
              <option value="Spa">Spa</option>
              <option value="Salon Interior">Salon Interior</option>
            </select>
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Image URL</label>
            <input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold">Add Image</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-modal: Walk-in Booking
const WalkInBookingModal: React.FC<{
  services: Service[];
  staffList: Staff[];
  onClose: () => void;
  onSuccess: (apt: Appointment) => void;
}> = ({ services, staffList, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(staffList[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const res = DatabaseService.createAppointment({
      customer_name: customerName,
      customer_email: customerEmail || 'walkin@demosalon.com',
      customer_phone: customerPhone,
      service_id: serviceId,
      staff_id: staffId,
      date,
      start_time: time,
      notes: 'Reception desk walk-in reservation',
    });

    if (res.success && res.appointment) {
      onSuccess(res.appointment);
    } else {
      setErr(res.error || 'Failed to book slot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-semibold text-[#16281E]">Manual / Walk-in Booking</h3>
          <button onClick={onClose} className="text-[#6F7D71] hover:text-[#16281E]">✕</button>
        </div>

        {err && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Guest Name *</label>
            <input required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Phone Number *</label>
            <input required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Select Service</label>
            <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]">
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#4A574C] font-semibold mb-1">Select Stylist</label>
            <select value={staffId} onChange={e => setStaffId(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]">
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#4A574C] font-semibold mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
            </div>
            <div>
              <label className="block text-[#4A574C] font-semibold mb-1">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]" />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold">Reserve Walk-in</button>
          </div>
        </form>
      </div>
    </div>
  );
};
