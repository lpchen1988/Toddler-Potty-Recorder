
import React, { useState } from 'react';

// Added async return type to onInvite to support the database operations in App.tsx
interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, name: string) => Promise<string>;
}

const AddPartnerModal: React.FC<AddPartnerModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Updated handleSubmit to be async to handle the awaited token generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      setLoading(true);
      try {
        const token = await onInvite(email, name);
        setGeneratedToken(token);
      } catch (error) {
        console.error("Invite error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setGeneratedToken(null);
    setEmail('');
    setName('');
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Add a Partner</h2>
          <p className="text-sm text-slate-500 mt-1">Share tracking duties with another parent</p>
        </div>

        {generatedToken ? (
          <div className="space-y-6 text-center">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Invitation Token</p>
              <p className="text-3xl font-black text-indigo-600 tracking-tighter">{generatedToken}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Copy this token and send it to <strong>{name}</strong>. They should enter it during registration to join your family.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Partner's Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Partner Name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Partner's Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPartnerModal;
