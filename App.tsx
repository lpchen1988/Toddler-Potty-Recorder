
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TrackerButton from './components/TrackerButton';
import ChartContainer from './components/ChartContainer';
import Insights from './components/Insights';
import HistoryList from './components/HistoryList';
import BottomNav from './components/BottomNav';
import TodayLogs from './components/TodayLogs';
import Toast from './components/Toast';
import Auth from './components/Auth';
import ChildSwiper from './components/ChildSwiper';
import AddChildModal from './components/AddChildModal';
import AddPartnerModal from './components/AddPartnerModal';
import { PottyEvent, AIAdvice, User, Child } from './types';
import { getPottyAdvice } from './services/geminiService';
import { formatTime } from './utils/stats';
import { db } from './utils/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(db.getSession());
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [events, setEvents] = useState<PottyEvent[]>([]);
  
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [chartWidthMultiplier, setChartWidthMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState<'log' | 'stats'>('log');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load children when user changes (using familyId for shared access)
  useEffect(() => {
    if (user) {
      const familyChildren = db.getChildren(user.familyId);
      setChildren(familyChildren);
      if (familyChildren.length > 0 && !activeChildId) {
        setActiveChildId(familyChildren[0].id);
      }
    } else {
      setChildren([]);
      setActiveChildId(null);
    }
  }, [user]);

  // Load events when active child changes
  useEffect(() => {
    if (activeChildId) {
      setEvents(db.getEvents(activeChildId));
      setAdvice(null);
    } else {
      setEvents([]);
    }
  }, [activeChildId]);

  // Persistence for events
  useEffect(() => {
    if (activeChildId) {
      db.saveEvents(activeChildId, events);
    }
  }, [events, activeChildId]);

  const handleLogin = (u: User) => {
    setUser(u);
    db.setSession(u);
  };

  const handleLogout = () => {
    setUser(null);
    db.setSession(null);
  };

  const onAddChild = (name: string) => {
    if (!user) return;
    const newChild: Child = { 
      id: Math.random().toString(36).substr(2, 9), 
      name,
      familyId: user.familyId
    };
    db.addChild(user.familyId, newChild);
    setChildren(prev => [...prev, newChild]);
    setActiveChildId(newChild.id);
    setToastMessage(`${name} added!`);
    setShowToast(true);
  };

  const onInvitePartner = (email: string, name: string): string => {
    if (!user) return "";
    const token = db.createToken(email, user.familyId);
    setToastMessage(`Invitation token generated for ${name}`);
    setShowToast(true);
    return token;
  };

  const handleLogEvent = useCallback(() => {
    if (!activeChildId) {
      setIsAddModalOpen(true);
      return;
    }
    const now = Date.now();
    const newEvent: PottyEvent = {
      id: Math.random().toString(36).substr(2, 9),
      childId: activeChildId,
      timestamp: now
    };
    setEvents(prev => [...prev, newEvent]);
    
    const d = new Date(now);
    const timeStr = formatTime(d.getHours() * 60 + d.getMinutes());
    setToastMessage(`Logged for ${children.find(c => c.id === activeChildId)?.name} at ${timeStr}`);
    setShowToast(true);
  }, [activeChildId, children]);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleEditEvent = useCallback((id: string, newTimestamp: number) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, timestamp: newTimestamp } : e));
  }, []);

  const fetchAdvice = useCallback(async () => {
    if (events.length >= 3) {
      setLoadingAdvice(true);
      const res = await getPottyAdvice(events);
      setAdvice(res);
      setLoadingAdvice(false);
    }
  }, [events]);

  useEffect(() => {
    if (events.length >= 5 && events.length % 3 === 0) {
      fetchAdvice();
    }
  }, [events.length, fetchAdvice]);

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onAddChild={() => setIsAddModalOpen(true)} 
        onAddPartner={() => setIsAddPartnerModalOpen(true)}
      />
      
      <AddChildModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={onAddChild} 
      />

      <AddPartnerModal 
        isOpen={isAddPartnerModalOpen}
        onClose={() => setIsAddPartnerModalOpen(false)}
        onInvite={onInvitePartner}
      />

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <main className="max-w-4xl mx-auto px-4 safe-area-inset-bottom">
        <ChildSwiper 
          children={children} 
          activeChildId={activeChildId} 
          onSelect={setActiveChildId} 
        />

        {children.length === 0 ? (
          <div className="text-center py-12 px-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No children added yet</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Add your first child to start tracking their potty habits and get AI insights.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95"
            >
              Add Your Child
            </button>
          </div>
        ) : activeTab === 'log' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TrackerButton onLog={handleLogEvent} />
            <TodayLogs 
              events={events} 
              onDelete={handleDeleteEvent} 
              onEdit={handleEditEvent} 
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <Insights 
              advice={advice} 
              loading={loadingAdvice} 
              eventCount={events.length} 
            />

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Zoom Timeline</h3>
                <span className="text-xs text-slate-400 font-mono">{chartWidthMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={chartWidthMultiplier}
                onChange={(e) => setChartWidthMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <ChartContainer events={events} chartWidthMultiplier={chartWidthMultiplier} />
            <HistoryList events={events} onDelete={handleDeleteEvent} />

            <div className="flex flex-col items-center gap-4 pb-8">
               <button 
                onClick={fetchAdvice}
                disabled={events.length < 3 || loadingAdvice}
                className="text-xs bg-slate-100 text-slate-500 px-4 py-2 rounded-full font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
