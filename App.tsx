
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TrackerButton from './components/TrackerButton';
import ChartContainer from './components/ChartContainer';
import Insights from './components/Insights';
import HistoryList from './components/HistoryList';
import BottomNav from './components/BottomNav';
import TodayLogs from './components/TodayLogs';
import Toast from './components/Toast';
import ChildSwiper from './components/ChildSwiper';
import AddChildModal from './components/AddChildModal';
import AddPartnerModal from './components/AddPartnerModal';
import ProfileModal from './components/ProfileModal';
import AuthFlow from './components/AuthFlow';
import { PottyEvent, AIAdvice, User, Child, EventType } from './types';
import { getPottyAdvice } from './services/geminiService';
import { formatTime } from './utils/stats';
import { db } from './utils/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [children, setChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [events, setEvents] = useState<PottyEvent[]>([]);
  
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [chartWidthMultiplier, setChartWidthMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState<'log' | 'stats'>('log');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Initialize session
  useEffect(() => {
    db.getCurrentUser().then(savedUser => {
      if (savedUser) setUser(savedUser);
      setLoadingUser(false);
    });
  }, []);

  // Load Children when User is set
  useEffect(() => {
    if (user) {
      db.getChildren(user.familyId).then(list => {
        setChildren(list);
        if (list.length > 0 && !activeChildId) {
          setActiveChildId(list[0].id);
        }
      });
    }
  }, [user]);

  // Load Events when active child changes
  const loadEvents = useCallback(async () => {
    if (activeChildId) {
      const list = await db.getEvents(activeChildId);
      setEvents(list.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [activeChildId]);

  useEffect(() => {
    loadEvents();
  }, [activeChildId, loadEvents]);

  const handleLogout = async () => {
    await db.clearSession();
    setUser(null);
    setChildren([]);
    setActiveChildId(null);
    setEvents([]);
    setToastMessage("Logged out successfully.");
    setShowToast(true);
  };

  const onAddChild = async (name: string) => {
    if (!user) return;
    const newChild = await db.addChild(user.familyId, name);
    setChildren(prev => [...prev, newChild]);
    if (!activeChildId) setActiveChildId(newChild.id);
    setToastMessage(`${name} added!`);
    setShowToast(true);
  };

  const onInvitePartner = async (email: string, name: string): Promise<string> => {
    if (!user) return "";
    const token = await db.createToken(email, user.familyId);
    setToastMessage(`Invitation token generated for ${name}`);
    setShowToast(true);
    return token;
  };

  const handleLogEvent = useCallback(async (type: EventType) => {
    if (!activeChildId) {
      setIsAddModalOpen(true);
      return;
    }
    const now = Date.now();
    await db.saveEvent({
      childId: activeChildId,
      timestamp: now,
      type
    });
    
    await loadEvents();
    
    const d = new Date(now);
    const timeStr = formatTime(d.getHours() * 60 + d.getMinutes());
    
    let label = "Event";
    if (type === 'wakeup') label = "Wakeup";
    else if (type === 'potty') label = "Potty Event";
    else if (type === 'nap') label = "Nap";
    else if (type === 'breakfast') label = "Breakfast";
    else if (type === 'lunch') label = "Lunch";
    else if (type === 'dinner') label = "Dinner";
    else if (type === 'snack') label = "Snack";
    else if (type === 'meal') label = "Meal";

    setToastMessage(`${label} logged at ${timeStr}`);
    setShowToast(true);
  }, [activeChildId, loadEvents]);

  const handleDeleteEvent = useCallback(async (id: string) => {
    await db.deleteEvent(id);
    await loadEvents();
  }, [loadEvents]);

  const handleEditEvent = useCallback(async (id: string, newTimestamp: number) => {
    await db.updateEvent(id, newTimestamp);
    await loadEvents();
  }, [loadEvents]);

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

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthFlow onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onAddChild={() => setIsAddModalOpen(true)} 
        onAddPartner={() => setIsAddPartnerModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
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

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        childrenCount={children.length}
      />

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <main className="max-w-4xl mx-auto px-4 safe-area-inset-bottom">
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Child</span>
          </div>
        </div>
        
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
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, {user.firstName}!</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Add your child to start tracking their potty habits and get AI insights.</p>
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
