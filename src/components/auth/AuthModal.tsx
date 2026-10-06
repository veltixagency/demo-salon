import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, ArrowRight, Check } from 'lucide-react';
import { CustomerProfile } from '../../types';
import { DatabaseService } from '../../lib/database';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      // Check admin credentials
      if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@demosalon.com') {
        const adminUser: CustomerProfile = {
          id: 'admin-1',
          name: 'Salon Director (Admin)',
          email: email || 'admin@demosalon.com',
          phone: '(310) 555-0198',
          role: 'admin',
          created_at: '2026-01-01',
        };
        DatabaseService.setCurrentUser(adminUser);
        onSuccess(adminUser);
        onClose();
        return;
      }

      // Customer login
      const customers = DatabaseService.getCustomers();
      const existing = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      const user: CustomerProfile = existing || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '(310) 555-0100',
        role: 'customer',
        created_at: new Date().toISOString(),
      };

      DatabaseService.setCurrentUser(user);
      onSuccess(user);
      onClose();
    } else {
      // Register
      if (!name || !email) {
        setError('Please enter your full name and email.');
        return;
      }
      const newUser: CustomerProfile = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone: phone || '(310) 555-0100',
        role: 'customer',
        total_visits: 1,
        created_at: new Date().toISOString(),
      };
      DatabaseService.recordCustomerActivity({ name, email, phone });
      DatabaseService.setCurrentUser(newUser);
      onSuccess(newUser);
      onClose();
    }
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const adminUser: CustomerProfile = {
        id: 'admin-1',
        name: 'Salon Director & Manager',
        email: 'admin@demosalon.com',
        phone: '(310) 555-0198',
        role: 'admin',
        created_at: '2026-01-01',
      };
      DatabaseService.setCurrentUser(adminUser);
      onSuccess(adminUser);
    } else {
      const demoCustomer: CustomerProfile = {
        id: 'usr-1',
        name: 'Genevieve Sterling',
        email: 'genevieve.s@example.com',
        phone: '(310) 849-2144',
        role: 'customer',
        total_visits: 6,
        created_at: '2026-02-14',
      };
      DatabaseService.setCurrentUser(demoCustomer);
      onSuccess(demoCustomer);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8E1D2] w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#1E3527] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A364] block">
            Demo Salon Concierge
          </span>
          <h3 className="font-serif text-2xl font-medium tracking-tight mt-1 text-[#FAF7F2]">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-[#BFCEC0] mt-1">
            Access your appointments, reschedule with ease, and view salon records.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E5DECf] bg-[#F4EFE6] text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition ${
              mode === 'login' 
                ? 'border-b-2 border-[#1E3527] text-[#1E3527] bg-[#FAF7F2]' 
                : 'text-[#6F7D71] hover:text-[#1E3527]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition ${
              mode === 'register' 
                ? 'border-b-2 border-[#1E3527] text-[#1E3527] bg-[#FAF7F2]' 
                : 'text-[#6F7D71] hover:text-[#1E3527]'
            }`}
          >
            New Client Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#4A574C] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A574C] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(310) 555-0100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[#4A574C] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A574C] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3527] hover:bg-[#14241A] text-white py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-md mt-2"
            >
              {mode === 'login' ? 'Sign In To Account' : 'Complete Registration'}
            </button>
          </form>

          {/* 1-Click Fast Demo Testing */}
          <div className="pt-4 border-t border-[#E8E2D5] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71] block text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-2.5 rounded-xl border border-[#D5CDC0] bg-white hover:bg-[#F2ECE0] text-xs font-medium text-[#1E3527] transition text-center flex flex-col items-center gap-1"
              >
                <User className="w-4 h-4 text-[#788C71]" />
                <span>Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-[#C6A364] bg-[#FDFBF7] hover:bg-[#F7EEDC] text-xs font-semibold text-[#14241A] transition text-center flex flex-col items-center gap-1 shadow-xs"
              >
                <Shield className="w-4 h-4 text-[#C6A364]" />
                <span>Salon Admin</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
