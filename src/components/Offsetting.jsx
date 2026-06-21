import React, { useState } from 'react';

export default function Offsetting({ footprintData, offsetTonnes, addOffset }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tonnesToOffset, setTonnesToOffset] = useState(1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [recentOffsetVal, setRecentOffsetVal] = useState(0);

  // Carbon calculation to find remaining emissions
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

  const totalCalculatedFootprintKg = yearlyTravel + yearlyEnergy + yearlyDiet + yearlyLifestyle;
  const totalCalculatedFootprintTonnes = Math.round((totalCalculatedFootprintKg / 1000) * 10) / 10;
  
  const remainingTonnes = Math.max(0, Math.round((totalCalculatedFootprintTonnes - offsetTonnes) * 10) / 10);

  // Available offset projects
  const projects = [
    {
      id: 'blue-carbon',
      title: 'Oceanic Blue Carbon Seagrass Restoration',
      category: 'Marine Habitat',
      description: 'Restores vital coastal seagrass meadows that capture carbon 35x faster than tropical rainforests, protecting marine biodiversity and supporting coastal communities.',
      pricePerTonne: 22,
      location: 'Key West, Florida, USA',
      emoji: '🌊'
    },
    {
      id: 'appalachian-forest',
      title: 'Appalachian Mixed Hardwood Reforestation',
      category: 'Forestry Conservation',
      description: 'Replants native hardwood species on formerly strip-mined Appalachian land, establishing critical carbon sinks, filtering local watersheds, and recovering native ecosystems.',
      pricePerTonne: 15,
      location: 'Kentucky/West Virginia, USA',
      emoji: '🌳'
    },
    {
      id: 'community-solar',
      title: 'Sub-Saharan Rural Community Solar Microgrids',
      category: 'Clean Energy',
      description: 'Replaces polluting household kerosene lamps with clean, reliable solar power stations, accelerating local economies, lowering local emissions, and improving respiratory health.',
      pricePerTonne: 18,
      location: 'Nairobi Region, Kenya',
      emoji: '☀️'
    },
    {
      id: 'methane-capture',
      title: 'Municipal Landfill Methane Gas Capture',
      category: 'Waste Recovery',
      description: 'Installs vacuum systems to capture high-impact fugitive methane gases from landfills, combusting them to generate clean electrical grid power for surrounding municipalities.',
      pricePerTonne: 11,
      location: 'Jakarta, Indonesia',
      emoji: '♻️'
    }
  ];

  const handlePurchaseOffset = (project, amount) => {
    addOffset(amount);
    setRecentOffsetVal(amount);
    setSelectedProject(project);
    setShowCertificate(true);
  };

  const handleOffsetToZero = (project) => {
    if (remainingTonnes <= 0) return;
    handlePurchaseOffset(project, remainingTonnes);
  };

  return (
    <div className="dashboard-view animate-fade-in">
      {showCertificate ? (
        /* Certificate View */
        <div className="card col-12 animate-fade-in" style={{ textShadow: 'none' }}>
          <div style={{
            border: '4px double var(--accent-primary)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, #0f172a 0%, #030712 100%)',
            boxShadow: 'var(--shadow-glow)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '20px', right: '30px', fontSize: '48px', opacity: 0.15 }}>🌿</div>
            <div style={{ position: 'absolute', bottom: '20px', left: '30px', fontSize: '48px', opacity: 0.15 }}>🌊</div>

            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-secondary)', fontWeight: '700' }}>
              Certificate of Carbon Offset
            </span>
            
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '800', margin: '20px 0', color: '#fff' }}>
              CARBON PULSE NEUTRALITY
            </h2>
            
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px' }}>
              This certifies that the user has successfully offset
            </p>
            
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#fff', margin: '10px 0' }}>
              {recentOffsetVal.toFixed(1)} Metric Tons of CO₂e
            </div>
            
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 32px' }}>
              through verified funding allocated to the <strong>{selectedProject?.title}</strong> ({selectedProject?.location}). This contribution supports the global transition to net-zero carbon output.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <div>
                <strong>ISSUER</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>CarbonPulse Registry</div>
              </div>
              <div>
                <strong>STATUS</strong>
                <div style={{ color: 'var(--accent-secondary)', fontWeight: '700', marginTop: '4px' }}>✓ RETIRED & VERIFIED</div>
              </div>
              <div>
                <strong>REGISTRY ID</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>CP-{Math.floor(100000 + Math.random() * 900000)}</div>
              </div>
            </div>

            <button 
              className="share-btn" 
              style={{ marginTop: '40px', maxWidth: '240px' }}
              onClick={() => setShowCertificate(false)}
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      ) : (
        /* Marketplace View */
        <div className="dashboard-grid">
          
          {/* Offsetting Header Summary */}
          <div className="card col-12">
            <h3 className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Net-Zero Carbon Offsetting Marketplace
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
                  While reducing direct emissions is critical, neutralising unavoidable carbon through environmental offset projects is necessary to achieve true net-zero.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '14px' }}>
                  <span>Total Carbon Footprint: <strong>{totalCalculatedFootprintTonnes} Tons</strong></span>
                  <span>|</span>
                  <span>Already Offset: <strong style={{ color: 'var(--accent-secondary)' }}>{offsetTonnes} Tons</strong></span>
                </div>
              </div>
              
              <div style={{ padding: '16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Remaining Emissions</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: remainingTonnes > 0 ? 'var(--warning-color)' : 'var(--accent-secondary)' }}>
                  {remainingTonnes} Tons
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {remainingTonnes > 0 ? 'Not Net-Zero yet' : '✨ Net-Zero Achieved!'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Offset Input */}
          {remainingTonnes > 0 && (
            <div className="card col-12">
              <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '12px' }}>⚡ Custom Offset Calculator</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div style={{ flexGrow: 1, minWidth: '240px' }}>
                  <label className="form-label">
                    <span>Tons of CO₂ to offset</span>
                    <span className="form-label-val">{tonnesToOffset} Ton(s)</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max={Math.max(10, Math.ceil(remainingTonnes))} 
                    step="1"
                    value={tonnesToOffset}
                    onChange={(e) => setTonnesToOffset(parseInt(e.target.value))}
                    className="input-slider"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  {projects.slice(0, 2).map((proj) => (
                    <button 
                      key={proj.id} 
                      className="offset-buy-btn"
                      onClick={() => handlePurchaseOffset(proj, tonnesToOffset)}
                    >
                      Buy {tonnesToOffset}T for ${tonnesToOffset * proj.pricePerTonne} ({proj.emoji})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="col-12">
            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)' }}>Verified Project Portfolios</h4>
            <div className="offset-project-grid">
              {projects.map((proj) => {
                const projectCost = Math.round(tonnesToOffset * proj.pricePerTonne);
                const netZeroCost = Math.round(remainingTonnes * proj.pricePerTonne);

                return (
                  <div key={proj.id} className="project-card">
                    <div className="project-media-placeholder">
                      <span style={{ fontSize: '48px' }}>{proj.emoji}</span>
                    </div>
                    
                    <div className="project-content">
                      <span className="project-tag">{proj.category}</span>
                      <h4 className="project-title">{proj.title}</h4>
                      <p className="project-desc">{proj.description}</p>
                      
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        📍 {proj.location}
                      </div>

                      <div className="project-meta">
                        <span className="project-price">${proj.pricePerTonne} / tonne</span>
                        <span className="project-offset-amt">Est Offset: 1,000 kg / T</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                        <button 
                          className="offset-buy-btn"
                          onClick={() => handlePurchaseOffset(proj, 1)}
                        >
                          Offset 1 Ton (${proj.pricePerTonne})
                        </button>
                        
                        {remainingTonnes > 0 && (
                          <button 
                            className="offset-buy-btn"
                            style={{ 
                              background: 'rgba(16, 185, 129, 0.1)', 
                              borderColor: 'var(--accent-primary)',
                              color: 'var(--accent-secondary)' 
                            }}
                            onClick={() => handleOffsetToZero(proj)}
                          >
                            Offset to Net-Zero (${netZeroCost})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
