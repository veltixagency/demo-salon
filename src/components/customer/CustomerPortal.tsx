import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  Phone,
  Mail,
  Award,
  Sparkles
} from 'lucide-react';
import { Appointment, CustomerProfile, Staff } from '../../types';
import { DatabaseService, subscribeToDatabase } from '../../lib/database';

interface CustomerPortalProps {
  currentUser: CustomerProfile;
  onOpenBooking: () => void;
  onLogout: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentUser,
  onOpenBooking,
  onLogout,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming');

  // Reschedule state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');

  const loadData = () => {
    const all = DatabaseService.getAppointments();
    // Filter matching email or customer_id
    const userApts = all.filter(a => 
      (a.customer_id && a.customer_id === currentUser.id) || 
      a.customer_email.toLowerCase() === currentUser.email.toLowerCase()
    );
    setAppointments(userApts);
    setStaffList(DatabaseService.getStaff());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabase(loadData);
    return () => unsubscribe();
  }, [currentUser]);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppointments = appointments.filter(a => 
    a.date >= todayStr && a.status !== 'Cancelled' && a.status !== 'Completed'
  );

  const pastAppointments = appointments.filter(a => 
    a.date < todayStr || a.status === 'Cancelled' || a.status === 'Completed'
  );

  // Handle Cancel
  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you wish to cancel this appointment reservation?')) {
      DatabaseService.updateAppointmentStatus(id, 'Cancelled');
      loadData();
    }
  };

  // Handle Reschedule submit
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !newDate || !newTime) return;

    setRescheduleError('');
    setRescheduleSuccess('');

    const res = DatabaseService.rescheduleAppointment(reschedulingApt.id, newDate, newTime);
    if (res.success) {
      setRescheduleSuccess('Your appointment has been successfully rescheduled.');
      setTimeout(() => {
        setReschedulingApt(null);
        setRescheduleSuccess('');
        loadData();
      }, 1200);
    } else {
      setRescheduleError(res.error || 'Failed to reschedule. Please select a different time.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Welcome Header */}
        <div className="bg-[#1E3527] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#C6A364] text-[#14241A] font-serif text-2xl font-bold flex items-center justify-center shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A364] block">
                VIP Guest Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#FAF7F2]">
                {currentUser.name}
              </h1>
              <p className="text-xs text-[#BFCEC0] mt-0.5">
                {currentUser.email} • {currentUser.phone || '(310) 849-2144'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#14241A] px-4 py-2.5 rounded-2xl border border-[#263D2E] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#A5B9A6] block">Total Visits</span>
              <span className="font-serif text-lg font-bold text-[#C6A364]">{currentUser.total_visits || 1}</span>
            </div>
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 bg-[#C6A364] hover:bg-[#d8b577] text-[#14241A] font-semibold text-xs px-5 py-3 rounded-full transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Appointment</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3DCce] gap-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3.5 transition relative ${
              activeTab === 'upcoming' 
                ? 'text-[#1E3527] border-b-2 border-[#1E3527]' 
                : 'text-[#6F7D71] hover:text-[#1E3527]'
            }`}
          >
            Upcoming Reservations ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3.5 transition relative ${
              activeTab === 'past' 
                ? 'text-[#1E3527] border-b-2 border-[#1E3527]' 
                : 'text-[#6F7D71] hover:text-[#1E3527]'
            }`}
          >
            Appointment History ({pastAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3.5 transition relative ${
              activeTab === 'profile' 
                ? 'text-[#1E3527] border-b-2 border-[#1E3527]' 
                : 'text-[#6F7D71] hover:text-[#1E3527]'
            }`}
          >
            Client Preferences & Notes
          </button>
        </div>

        {/* Tab 1: Upcoming Appointments */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E1D2] shadow-sm max-w-xl mx-auto space-y-4">
                <Calendar className="w-12 h-12 text-[#788C71] mx-auto opacity-70" />
                <h3 className="font-serif text-xl font-medium text-[#16281E]">No Upcoming Bookings</h3>
                <p className="text-xs text-[#6F7D71] max-w-md mx-auto">
                  You have no active appointments scheduled. Treat yourself to our signature hair, barber, or scalp rituals today.
                </p>
                <button
                  onClick={onOpenBooking}
                  className="bg-[#1E3527] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#14241A] transition"
                >
                  Schedule Your Visit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl p-6 border border-[#E5DECf] shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                        <span className="font-mono text-xs font-bold text-[#1E3527] bg-[#EFECE5] px-2.5 py-1 rounded-md">
                          {apt.booking_code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          apt.status === 'Confirmed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="py-4 space-y-2.5">
                        <h4 className="font-serif text-lg font-semibold text-[#16281E]">
                          {apt.service_name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#526054]">
                          <User className="w-3.5 h-3.5 text-[#C6A364]" />
                          <span>Stylist: <strong>{apt.staff_name}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#526054]">
                          <Calendar className="w-3.5 h-3.5 text-[#C6A364]" />
                          <span>Date: <strong>{apt.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#526054]">
                          <Clock className="w-3.5 h-3.5 text-[#C6A364]" />
                          <span>Time: <strong>{apt.start_time} – {apt.end_time}</strong> ({apt.service_duration} min)</span>
                        </div>
                        {apt.notes && (
                          <p className="text-[11px] text-[#788C71] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE7DB] mt-2">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                      <span className="font-serif font-bold text-[#1E3527]">
                        ${apt.service_price}.00
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReschedulingApt(apt);
                            setNewDate(apt.date);
                            setNewTime(apt.start_time);
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#D5CDC0] text-xs font-medium text-[#1E3527] hover:bg-[#EFECE5] transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium text-red-700 hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Past Appointments */}
        {activeTab === 'past' && (
          <div className="space-y-3">
            {pastAppointments.length === 0 ? (
              <p className="text-center text-xs text-[#788C71] py-10">No past appointments recorded yet.</p>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5DECf] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F1E8] text-[#4A574C] font-semibold border-b border-[#E5DECf]">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Stylist</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {pastAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3 px-4 font-medium">{apt.date}</td>
                        <td className="py-3 px-4 font-semibold text-[#16281E]">{apt.service_name}</td>
                        <td className="py-3 px-4 text-[#526054]">{apt.staff_name}</td>
                        <td className="py-3 px-4 font-serif font-bold text-[#1E3527]">${apt.service_price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'Cancelled' ? 'bg-gray-100 text-gray-600' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={onOpenBooking}
                            className="text-[#1E3527] hover:underline font-semibold text-[11px]"
                          >
                            Rebook Service
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DECf] max-w-xl space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#16281E]">
              Client Profile & Sanctuary Preferences
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#6F7D71] font-medium block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-[#1E2620]"
                />
              </div>
              <div>
                <label className="text-[#6F7D71] font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-[#1E2620]"
                />
              </div>
              <div>
                <label className="text-[#6F7D71] font-medium block mb-1">Phone Number</label>
                <input
                  type="tel"
                  disabled
                  value={currentUser.phone || '(310) 849-2144'}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-[#1E2620]"
                />
              </div>
              <div className="pt-2">
                <span className="text-xs text-[#788C71]">
                  Complimentary Beverages Available Upon Arrival: Craft Espresso, Sparkling Mineral Water, Chamomile Lavender Infusion.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8E1D2] shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                Reschedule Reservation
              </h3>
              <button
                onClick={() => setReschedulingApt(null)}
                className="text-[#6F7D71] hover:text-[#16281E]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6F7D71]">
              Rescheduling <strong>{reschedulingApt.service_name}</strong> with <strong>{reschedulingApt.staff_name}</strong>.
            </p>

            {rescheduleError && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                {rescheduleError}
              </div>
            )}
            {rescheduleSuccess && (
              <div className="p-2.5 rounded-lg bg-green-50 text-green-700 text-xs border border-green-200">
                {rescheduleSuccess}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]"
                />
              </div>

              <div>
                <label className="block text-[#4A574C] font-semibold mb-1">Select New Time</label>
                <select
                  required
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-white text-[#1E2620]"
                >
                  <option value="">Choose slot...</option>
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 rounded-full border border-[#D5CDC0] text-[#4A574C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E3527] text-white font-semibold"
                >
                  Confirm Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
