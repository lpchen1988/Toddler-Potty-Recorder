
import React from 'react';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  childrenCount: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, childrenCount }) => {
  if (!isOpen) return null;

  // Derive partner status from familyId for this mock version
  const hasPartner = user.familyId.startsWith('shared-family-');
  const partnerName = hasPartner ? "Linked Partner" : "No partner linked";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-300 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100">
            <span className="text-3xl text-white font-bold">{user.firstName?.[0]}{user.lastName?.[0]}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Profile</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your account details</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <p className="bg-slate-50 px-4 py-3 rounded-2xl text-slate-700 font-bold border border-slate-100">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
            <p className="bg-slate-50 px-4 py-3 rounded-2xl text-slate-700 font-bold border border-slate-100">
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kids</label>
              <p className="bg-slate-50 px-4 py-3 rounded-2xl text-slate-700 font-bold border border-slate-100 text-center">
                {childrenCount}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Partner</label>
              <p className="bg-slate-50 px-4 py-3 rounded-2xl text-slate-700 font-bold border border-slate-100 text-center truncate text-xs">
                {partnerName}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
