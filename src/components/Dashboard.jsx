import React, { useState } from 'react';

export default function Dashboard({ 
  footprintData, 
  historyData, 
  habits, 
  ecoPoints, 
  level, 
  badges, 
  offsetTonnes 
}) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Carbon Coefficients (Calculated Annual footprint in kg CO2e)
  const calcCategoryFootprints = () => {
    // Travel emissions
    const travelCo2 = 
      (footprintData.kmDriven * (footprintData.fuelType === 'electric' ? 0.05 : footprintData.fuelType === 'hybrid' ? 0.12 : 0.20)) * 52 + // weekly to annual
      (footprintData.transitHours * 0.08) * 52 +
      (footprintData.flightHours * 150); // average short/long flights kg per hr

    // Energy emissions
    const energyCo2 = 
      (footprintData.electricityKwh * 0.38) * 12 + // monthly to annual
      (footprintData.naturalGasTherms * 5.3) * 12;

    // Diet emissions
    let dietFactor = 0.5; // default vegan
    if (footprintData.diet === 'heavy-meat') dietFactor = 3.0;
    else if (footprintData.diet === 'average-meat') dietFactor = 2.0;
    else if (footprintData.diet === 'low-meat') dietFactor = 1.2;
    else if (footprintData.diet === 'vegetarian') dietFactor = 0.8;
    const dietCo2 = dietFactor * 365 * 3.5; // per day footprint to annual

    // Consumption/Shopping emissions
    const shoppingCo2 = 
      (footprintData.clothingPurchases * 15) + 
      (footprintData.electronicsPurchases * 80) + 
      (300 - (footprintData.recycleHabit * 80)); // base lifecycle carbon minus recycling credit

    return {
      travel: Math.round(travelCo2),
      energy: Math.round(energyCo2),
      diet: Math.round(dietCo2),
      shopping: Math.round(shoppingCo2)
    };
  };

  const categories = calcCategoryFootprints();
  const rawTotal = categories.travel + categories.energy + categories.diet + categories.shopping;
  
  // Apply Offsets
  const totalAnnual = Math.max(0, Math.round(rawTotal - (offsetTonnes * 1000)));
  const dailyAverage = Math.round((totalAnnual / 365) * 10) / 10;
  
  // Average comparison (Global Avg ~4,800 kg/yr, USA ~16,000 kg/yr, EU ~6,400 kg/yr)
  const globalAvg = 4800;
  const isBelowAvg = totalAnnual < globalAvg;
  const percentOfAvg = Math.round((totalAnnual / globalAvg) * 100);

  // SVG Donut Calculations
  const donutTotal = categories.travel + categories.energy + categories.diet + categories.shopping || 1;
  const percentages = {
    travel: (categories.travel / donutTotal) * 100,
    energy: (categories.energy / donutTotal) * 100,
    diet: (categories.diet / donutTotal) * 100,
    shopping: (categories.shopping / donutTotal) * 100
  };

  // SVG Line Chart points mapping
  // Map history values (e.g. 7 points) to Y coordinates
  const historyList = historyData || [15, 14.8, 14.2, 13.9, 13.5, 13.1, dailyAverage];
  const maxHistoryVal = Math.max(...historyList, 20);
  const minHistoryVal = Math.min(...historyList, 2);
  const chartHeight = 100;
  const chartWidth = 300;
  
  const linePoints = historyList.map((val, idx) => {
    const x = (idx / (historyList.length - 1)) * chartWidth;
    // Map val to y-axis: higher value = lower y in SVG coordinate system (0 is top)
    const padding = 15;
    const y = padding + ((maxHistoryVal - val) / (maxHistoryVal - minHistoryVal || 1)) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Get dynamic status gauge color
  const getGaugeColor = () => {
    if (totalAnnual < 3000) return 'var(--accent-secondary)'; // Very Eco-Friendly
    if (totalAnnual < 6000) return 'var(--info-color)'; // Good
    if (totalAnnual < 10000) return 'var(--warning-color)'; // Moderate
    return 'var(--danger-color)'; // High Carbon footprint
  };

  const getGaugeLabel = () => {
    if (totalAnnual < 3000) return 'Eco Guardian';
    if (totalAnnual < 6000) return 'Green Pioneer';
    if (totalAnnual < 10000) return 'Carbon Transitioner';
    return 'High Footprint';
  };

  return (
    <div className="dashboard-view animate-fade-in">
      <div className="dashboard-grid">
        
        {/* Main Stats Widget */}
        <div className="card col-8">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Premium Carbon Overview
          </h3>
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-label">Net Carbon Footprint</div>
              <div className="stat-val">
                {(totalAnnual / 1000).toFixed(2)}
                <span className="stat-unit">Tons CO₂e/yr</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Daily Average</div>
              <div className="stat-val">
                {dailyAverage}
                <span className="stat-unit">kg CO₂e/day</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">vs Global Average</div>
              <div className="stat-val">
                {percentOfAvg}%
                <span className="stat-unit">{isBelowAvg ? 'Below' : 'Above'}</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <p>
              Your yearly carbon footprint is <strong>{totalAnnual.toLocaleString()} kg CO₂e</strong>. 
              {isBelowAvg ? ' Fantastic! You are performing better than the global average target of 4.8 tons per year.' : ' You are currently above the global average. Dive into the Habit Tracker and Simulator to explore ways to reduce your footprint.'}
            </p>
          </div>
        </div>

        {/* Gauge Card */}
        <div className="card col-4">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Eco Status
          </h3>
          <div className="chart-container">
            <svg width="200" height="200" viewBox="0 0 100 100">
              {/* Background Arc */}
              <path d="M20,80 A40,40 0 1,1 80,80" fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
              {/* Highlight Arc based on footprint (lower is better, so green arc represents low footprint) */}
              <path 
                d="M20,80 A40,40 0 1,1 80,80" 
                fill="none" 
                stroke={getGaugeColor()} 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeDasharray="188.4" 
                strokeDashoffset={Math.max(0, Math.min(188.4, 188.4 * (totalAnnual / 15000)))} 
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-val">{getGaugeLabel()}</span>
              <span className="gauge-sub">Rating</span>
            </div>
          </div>
        </div>

        {/* Categories Donut Chart */}
        <div className="card col-6">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
            Emission Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1f2937" strokeWidth="3" />
              
              {/* Travel arc */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-primary)" strokeWidth="4.2"
                strokeDasharray={`${percentages.travel} ${100 - percentages.travel}`}
                strokeDashoffset="100" />
                
              {/* Energy arc */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-secondary)" strokeWidth="4.2"
                strokeDasharray={`${percentages.energy} ${100 - percentages.energy}`}
                strokeDashoffset={100 - percentages.travel} />
                
              {/* Diet arc */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--info-color)" strokeWidth="4.2"
                strokeDasharray={`${percentages.diet} ${100 - percentages.diet}`}
                strokeDashoffset={100 - percentages.travel - percentages.energy} />
                
              {/* Shopping arc */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--warning-color)" strokeWidth="4.2"
                strokeDasharray={`${percentages.shopping} ${100 - percentages.shopping}`}
                strokeDashoffset={100 - percentages.travel - percentages.energy - percentages.diet} />
            </svg>
            
            <div className="legend-grid" style={{ width: '100%' }}>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'var(--accent-primary)' }}></span>
                <span>Travel ({Math.round(percentages.travel)}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span>Energy ({Math.round(percentages.energy)}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'var(--info-color)' }}></span>
                <span>Diet ({Math.round(percentages.diet)}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: 'var(--warning-color)' }}></span>
                <span>Lifestyle ({Math.round(percentages.shopping)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Line History */}
        <div className="card col-6">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
            7-Day Footprint Trend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="15" x2={chartWidth} y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="85" x2={chartWidth} y2="85" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Path line */}
                <polyline
                  fill="none"
                  stroke="url(#line-glow-gradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />
                
                {/* Dots on points */}
                {historyList.map((val, idx) => {
                  const x = (idx / (historyList.length - 1)) * chartWidth;
                  const padding = 15;
                  const y = padding + ((maxHistoryVal - val) / (maxHistoryVal - minHistoryVal || 1)) * (chartHeight - 2 * padding);
                  return (
                    <circle 
                      key={idx} 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="var(--accent-secondary)" 
                      stroke="var(--bg-app)" 
                      strokeWidth="1.5" 
                    />
                  );
                })}

                <defs>
                  <linearGradient id="line-glow-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>6 Days Ago</span>
              <span>5 Days Ago</span>
              <span>4 Days Ago</span>
              <span>3 Days Ago</span>
              <span>2 Days Ago</span>
              <span>Yesterday</span>
              <span>Today ({dailyAverage} kg)</span>
            </div>
          </div>
        </div>

        {/* Premium Gamification Badges */}
        <div className="card col-8">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>
            Unlocked Eco-Badges
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Complete challenges, log low emissions, and fund carbon offsets to unlock premium achievements.
          </p>
          <div className="badges-container">
            {badges.map((b) => (
              <span key={b.id} className={`badge-pill ${b.unlocked ? 'unlocked' : ''}`} title={b.description}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {b.unlocked ? (
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                  ) : (
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  )}
                </svg>
                {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Social Sharing Card Generator */}
        <div className="card col-4">
          <h3 className="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            Share Eco-Impact
          </h3>
          <div className="share-card-preview">
            <div className="share-card-bg-glow"></div>
            <div className="share-card-header">CarbonPulse Premium</div>
            <div className="share-card-score">{dailyAverage} kg</div>
            <div className="share-card-label">My Daily Carbon Footprint</div>
            
            <div className="share-card-stats">
              <div className="share-card-stat">
                Level {level}
                <span>Eco Rank</span>
              </div>
              <div className="share-card-stat">
                {ecoPoints} XP
                <span>Points</span>
              </div>
              <div className="share-card-stat">
                {offsetTonnes > 0 ? `${offsetTonnes}T` : '0'}
                <span>Offset</span>
              </div>
            </div>
            
            <button className="share-btn" onClick={handleShare}>
              {copiedLink ? '✓ Copied Share URL!' : 'Share Achievement Card'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
