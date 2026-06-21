import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import HabitTracker from './components/HabitTracker';
import EcoCoach from './components/EcoCoach';
import Simulator from './components/Simulator';
import Offsetting from './components/Offsetting';
import GCPGuide from './components/GCPGuide';

// Initial state structures
const INITIAL_FOOTPRINT = {
  kmDriven: 240,
  fuelType: 'gasoline',
  transitHours: 4,
  flightHours: 12,
  electricityKwh: 350,
  naturalGasTherms: 25,
  diet: 'average-meat',
  clothingPurchases: 3,
  electronicsPurchases: 1,
  recycleHabit: 2
};

const INITIAL_HABITS = [
  { id: 'plant-based', name: 'Eat a plant-based meal instead of meat', emoji: '🥗', carbonSavings: 1.5, completed: false },
  { id: 'transit', name: 'Commute via public transit or bicycle', emoji: '🚴', carbonSavings: 2.5, completed: false },
  { id: 'cold-wash', name: 'Wash laundry using cold water', emoji: '🧼', carbonSavings: 0.5, completed: false },
  { id: 'vampire', name: 'Unplug standby electronics/chargers', emoji: '🔌', carbonSavings: 0.4, completed: false },
  { id: 'compost', name: 'Compost kitchen and organic food waste', emoji: '🍎', carbonSavings: 0.6, completed: false },
  { id: 'thermostat', name: 'Lower thermostat setting by 1.5°C', emoji: '🌡️', carbonSavings: 1.2, completed: false }
];

const INITIAL_BADGES = [
  { id: 'first-steps', name: 'Eco Starter', description: 'Log footprint data in the calculator', unlocked: true },
  { id: 'green-streak', name: 'Streak Master', description: 'Maintain a green daily streak of 3+ days', unlocked: true },
  { id: 'points-rich', name: 'XP Collector', description: 'Accumulate more than 100 Eco-Points', unlocked: false },
  { id: 'offset-neutral', name: 'Carbon Neutralizer', description: 'Purchase carbon credits to offset emissions', unlocked: false },
  { id: 'net-zero', name: 'Climate Champion', description: 'Bring net carbon footprint to zero', unlocked: false }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('theme-midnight-emerald');
  const [footprintData, setFootprintData] = useState(INITIAL_FOOTPRINT);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [ecoPoints, setEcoPoints] = useState(45);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(3);
  const [offsetTonnes, setOffsetTonnes] = useState(0);
  const [historyData, setHistoryData] = useState([14.2, 13.9, 13.5, 12.8, 12.4, 12.1, 11.8]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cp_theme');
    const savedFootprint = localStorage.getItem('cp_footprint');
    const savedHabits = localStorage.getItem('cp_habits');
    const savedBadges = localStorage.getItem('cp_badges');
    const savedPoints = localStorage.getItem('cp_points');
    const savedLevel = localStorage.getItem('cp_level');
    const savedStreak = localStorage.getItem('cp_streak');
    const savedOffset = localStorage.getItem('cp_offset');
    const savedHistory = localStorage.getItem('cp_history');

    if (savedTheme) setTheme(savedTheme);
    if (savedFootprint) setFootprintData(JSON.parse(savedFootprint));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedPoints) setEcoPoints(parseInt(savedPoints));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedOffset) setOffsetTonnes(parseFloat(savedOffset));
    if (savedHistory) setHistoryData(JSON.parse(savedHistory));
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cp_theme', theme);
    document.body.className = theme; // Sync body class
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cp_footprint', JSON.stringify(footprintData));
    
    // Recalculate daily average footprint for today and update history
    const carRate = footprintData.fuelType === 'electric' ? 0.05 : footprintData.fuelType === 'hybrid' ? 0.12 : 0.20;
    const yearlyTravel = (footprintData.kmDriven * carRate * 52) + (footprintData.transitHours * 0.08 * 52) + (footprintData.flightHours * 150);
    const yearlyEnergy = (footprintData.electricityKwh * 0.38 * 12) + (footprintData.naturalGasTherms * 5.3 * 12);
    let dietFactor = 0.5;
    if (footprintData.diet === 'heavy-meat') dietFactor = 3.0;
    else if (footprintData.diet === 'average-meat') dietFactor = 2.0;
    else if (footprintData.diet === 'low-meat') dietFactor = 1.2;
    else if (footprintData.diet === 'vegetarian') dietFactor = 0.8;
    const yearlyDiet = dietFactor * 365 * 3.5;
    const clothingEmissions = footprintData.clothingPurchases * 15;
    const electronicsEmissions = footprintData.electronicsPurchases * 80;
    const recyclingCredit = footprintData.recycleHabit * 80;
    const yearlyLifestyle = Math.max(50, clothingEmissions + electronicsEmissions + (300 - recyclingCredit));

    const totalAnnual = Math.max(0, Math.round((yearlyTravel + yearlyEnergy + yearlyDiet + yearlyLifestyle) - (offsetTonnes * 1000)));
    const todayDailyAvg = Math.round((totalAnnual / 365) * 10) / 10;
    
    setHistoryData(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = todayDailyAvg;
      }
      localStorage.setItem('cp_history', JSON.stringify(updated));
      return updated;
    });
  }, [footprintData, offsetTonnes]);

  // Handle updates to Carbon Inputs
  const updateFootprintData = (key, value) => {
    setFootprintData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle Themes
  const toggleTheme = () => {
    setTheme(prev => prev === 'theme-midnight-emerald' ? 'theme-oled-forest' : 'theme-midnight-emerald');
  };

  // Handle Habit Checks
  const toggleHabit = (id) => {
    let completedState = false;
    let savings = 0;

    const updatedHabits = habits.map(h => {
      if (h.id === id) {
        completedState = !h.completed;
        savings = h.carbonSavings;
        return { ...h, completed: completedState };
      }
      return h;
    });

    setHabits(updatedHabits);
    localStorage.setItem('cp_habits', JSON.stringify(updatedHabits));

    // Experience Points (XP) Calculation
    const pointsDelta = completedState ? 15 : -15;
    const nextPoints = Math.max(0, ecoPoints + pointsDelta);
    setEcoPoints(nextPoints);
    localStorage.setItem('cp_points', nextPoints.toString());

    // Levels progression
    const nextLevelThreshold = level * 100;
    if (nextPoints >= nextLevelThreshold) {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      localStorage.setItem('cp_level', nextLvl.toString());
    }

    // Streaks updates
    if (completedState) {
      const totalChecked = updatedHabits.filter(h => h.completed).length;
      if (totalChecked === 1) {
        // First habit today
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('cp_streak', newStreak.toString());

        if (newStreak >= 3) {
          unlockBadge('green-streak');
        }
      }
    }

    if (nextPoints >= 100) {
      unlockBadge('points-rich');
    }
  };

  // Carbon credits offset purchase handler
  const addOffset = (tonnes) => {
    const nextOffset = offsetTonnes + tonnes;
    setOffsetTonnes(nextOffset);
    localStorage.setItem('cp_offset', nextOffset.toString());

    // Check carbon neutral badges
    unlockBadge('offset-neutral');

    // Check if fully offset to Net Zero
    const carRate = footprintData.fuelType === 'electric' ? 0.05 : footprintData.fuelType === 'hybrid' ? 0.12 : 0.20;
    const yearlyTravel = (footprintData.kmDriven * carRate * 52) + (footprintData.transitHours * 0.08 * 52) + (footprintData.flightHours * 150);
    const yearlyEnergy = (footprintData.electricityKwh * 0.38 * 12) + (footprintData.naturalGasTherms * 5.3 * 12);
    let dietFactor = 0.5;
    if (footprintData.diet === 'heavy-meat') dietFactor = 3.0;
    else if (footprintData.diet === 'average-meat') dietFactor = 2.0;
    else if (footprintData.diet === 'low-meat') dietFactor = 1.2;
    else if (footprintData.diet === 'vegetarian') dietFactor = 0.8;
    const yearlyDiet = dietFactor * 365 * 3.5;
    const clothingEmissions = footprintData.clothingPurchases * 15;
    const electronicsEmissions = footprintData.electronicsPurchases * 80;
    const recyclingCredit = footprintData.recycleHabit * 80;
    const yearlyLifestyle = Math.max(50, clothingEmissions + electronicsEmissions + (300 - recyclingCredit));
    const totalCalculatedFootprintTonnes = (yearlyTravel + yearlyEnergy + yearlyDiet + yearlyLifestyle) / 1000;

    if (nextOffset >= totalCalculatedFootprintTonnes) {
      unlockBadge('net-zero');
    }

    // Award XP bonus
    const pointsDelta = Math.round(tonnes * 25);
    const nextPoints = ecoPoints + pointsDelta;
    setEcoPoints(nextPoints);
    localStorage.setItem('cp_points', nextPoints.toString());

    const nextLevelThreshold = level * 100;
    if (nextPoints >= nextLevelThreshold) {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      localStorage.setItem('cp_level', nextLvl.toString());
    }
  };

  const unlockBadge = (id) => {
    const updatedBadges = badges.map(b => {
      if (b.id === id) return { ...b, unlocked: true };
      return b;
    });
    setBadges(updatedBadges);
    localStorage.setItem('cp_badges', JSON.stringify(updatedBadges));
  };

  return (
    <>
      {/* Premium Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-name">
              CarbonPulse <span className="brand-badge">Premium</span>
            </h1>
          </div>
        </div>

        <div className="nav-controls">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Switch Premium Theme">
            {theme === 'theme-midnight-emerald' ? '☀️' : '🌙'}
          </button>
          
          <div className="user-badge">
            <span className="user-level">Lvl {level}</span>
            <span className="user-points">{ecoPoints} XP</span>
          </div>
        </div>
      </header>

      {/* Main Tabbed Navigation */}
      <nav className="app-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          🧮 Calculator
        </button>
        <button 
          className={`nav-tab ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          🌱 Habit Tracker
        </button>
        <button 
          className={`nav-tab ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => setActiveTab('coach')}
        >
          🧠 Eco-Coach
        </button>
        <button 
          className={`nav-tab ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          🔮 What-If Simulator
        </button>
        <button 
          className={`nav-tab ${activeTab === 'offset' ? 'active' : ''}`}
          onClick={() => setActiveTab('offset')}
        >
          🌍 Offsetting
        </button>
        <button 
          className={`nav-tab ${activeTab === 'gcp' ? 'active' : ''}`}
          onClick={() => setActiveTab('gcp')}
        >
          ☁️ GCP Deploy
        </button>
      </nav>

      {/* Active Tab View */}
      <main style={{ flexGrow: 1, paddingBottom: '40px' }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            footprintData={footprintData} 
            historyData={historyData}
            habits={habits}
            ecoPoints={ecoPoints}
            level={level}
            badges={badges}
            offsetTonnes={offsetTonnes}
          />
        )}
        {activeTab === 'calculator' && (
          <Calculator 
            footprintData={footprintData} 
            updateFootprintData={updateFootprintData} 
          />
        )}
        {activeTab === 'habits' && (
          <HabitTracker 
            habits={habits} 
            toggleHabit={toggleHabit} 
            ecoPoints={ecoPoints}
            level={level}
            streak={streak}
          />
        )}
        {activeTab === 'coach' && (
          <EcoCoach footprintData={footprintData} />
        )}
        {activeTab === 'simulator' && (
          <Simulator />
        )}
        {activeTab === 'offset' && (
          <Offsetting 
            footprintData={footprintData} 
            offsetTonnes={offsetTonnes} 
            addOffset={addOffset}
          />
        )}
        {activeTab === 'gcp' && (
          <GCPGuide />
        )}
      </main>

      {/* Premium Footer */}
      <footer className="app-footer">
        <div className="footer-links">
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab('gcp'); }}>GCP Setup Guide</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab('calculator'); }}>Recalculate Carbon</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab('offset'); }}>Offsetting Projects</a>
        </div>
        <div>
          &copy; 2026 CarbonPulse Premium • Empowering sustainable lifestyle tracking.
        </div>
      </footer>
    </>
  );
}

export default App;
