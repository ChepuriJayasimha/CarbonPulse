import React, { useState } from 'react';

export default function Simulator() {
  // Simulator slider states
  const [carCommuteReduction, setCarCommuteReduction] = useState(0); // km per week
  const [ledBulbsSwapped, setLedBulbsSwapped] = useState(0); // number of bulbs
  const [veganMealsSubbed, setVeganMealsSubbed] = useState(0); // meals per week
  const [tempLowering, setTempLowering] = useState(0); // degrees Celsius

  // Calculation coefficients
  const carSavingsPerKm = 0.20; // kg CO2 per km
  const ledSavingsPerBulb = 35; // kg CO2 per year (assuming switching from 60W incandescent used 3h/day)
  const veganSavingsPerMeal = 1.8; // kg CO2 per meal swap (switching from beef/poultry to plant food)
  const tempSavingsPerDegree = 80; // kg CO2 per year per degree Celsius lower thermostat

  const annualCarSavings = Math.round(carCommuteReduction * 52 * carSavingsPerKm);
  const annualLedSavings = Math.round(ledBulbsSwapped * ledSavingsPerBulb);
  const annualVeganSavings = Math.round(veganMealsSubbed * 52 * veganSavingsPerMeal);
  const annualTempSavings = Math.round(tempLowering * tempSavingsPerDegree);

  const totalAnnualSavings = annualCarSavings + annualLedSavings + annualVeganSavings + annualTempSavings;
  
  // Equivalence metrics
  const treesPlantedEquivalent = Math.round((totalAnnualSavings / 22) * 10) / 10; // 1 tree absorbs ~22 kg CO2 per year
  const petrolLitresSaved = Math.round((totalAnnualSavings / 2.3) * 10) / 10; // 1L petrol emits ~2.3 kg CO2

  return (
    <div className="dashboard-grid animate-fade-in">
      
      {/* Simulation Controls */}
      <div className="card col-7">
        <h3 className="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          What-If Scenario Simulator
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
          Move the sliders to project how simple adjustments in your routines would reduce your yearly carbon impact.
        </p>

        {/* Slider 1: Commute */}
        <div className="form-group">
          <label className="form-label">
            <span>Reduce Weekly Car Travel</span>
            <span className="form-label-val">-{carCommuteReduction} km/week</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="400" 
            step="10"
            value={carCommuteReduction}
            onChange={(e) => setCarCommuteReduction(parseInt(e.target.value))}
            className="input-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>No change</span>
            <span>Est: -{annualCarSavings} kg CO₂/yr</span>
          </div>
        </div>

        {/* Slider 2: LED swap */}
        <div className="form-group">
          <label className="form-label">
            <span>Swap Incandescent Bulbs with Smart LEDs</span>
            <span className="form-label-val">{ledBulbsSwapped} bulbs</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="30" 
            step="1"
            value={ledBulbsSwapped}
            onChange={(e) => setLedBulbsSwapped(parseInt(e.target.value))}
            className="input-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>No change</span>
            <span>Est: -{annualLedSavings} kg CO₂/yr</span>
          </div>
        </div>

        {/* Slider 3: Meals */}
        <div className="form-group">
          <label className="form-label">
            <span>Swap Weekly Meals to Vegan / Plant-Based</span>
            <span className="form-label-val">{veganMealsSubbed} meals/week</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="21" 
            step="1"
            value={veganMealsSubbed}
            onChange={(e) => setVeganMealsSubbed(parseInt(e.target.value))}
            className="input-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>No change</span>
            <span>Est: -{annualVeganSavings} kg CO₂/yr</span>
          </div>
        </div>

        {/* Slider 4: Thermostat */}
        <div className="form-group">
          <label className="form-label">
            <span>Lower Winter Thermostat Setting</span>
            <span className="form-label-val">-{tempLowering} °C</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5"
            value={tempLowering}
            onChange={(e) => setTempLowering(parseFloat(e.target.value))}
            className="input-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>No change</span>
            <span>Est: -{annualTempSavings} kg CO₂/yr</span>
          </div>
        </div>
      </div>

      {/* Simulation Results Card */}
      <div className="card col-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 className="card-title" style={{ justifyContent: 'center' }}>
          ✨ Projected Reductions
        </h3>
        
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <div style={{ fontSize: '54px', fontWeight: '800', color: 'var(--accent-secondary)', lineHeight: '1', textShadow: 'var(--shadow-glow)' }}>
            {totalAnnualSavings.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '1px' }}>
            kg CO₂e Prevented / year
          </span>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '16px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>🌳</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{treesPlantedEquivalent} trees</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Equivalent annual carbon absorption of mature trees</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>⛽</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{petrolLitresSaved} Litres</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Equivalent vehicle gasoline fuel saved from burning</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', color: 'var(--accent-secondary)' }}>
          💡 <strong>Tip:</strong> Swapping just 1 flight or driving 50 km less per week has the equivalent benefit of planting over 10 mature trees. Focus on transport choices first!
        </div>
      </div>

    </div>
  );
}
