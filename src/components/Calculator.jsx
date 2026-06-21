import React, { useState } from 'react';

export default function Calculator({ footprintData, updateFootprintData }) {
  const [activeStep, setActiveStep] = useState('travel'); // travel, energy, diet, lifestyle

  // Travel calculation
  const carEmissionRate = 
    footprintData.fuelType === 'electric' ? 0.05 : 
    footprintData.fuelType === 'hybrid' ? 0.12 : 
    footprintData.fuelType === 'diesel' ? 0.18 : 0.20; // kg CO2e per km

  const annualCarEmissions = Math.round(footprintData.kmDriven * carEmissionRate * 52);
  const annualTransitEmissions = Math.round(footprintData.transitHours * 0.08 * 52);
  const annualFlightEmissions = Math.round(footprintData.flightHours * 150);
  const totalTravelEmissions = annualCarEmissions + annualTransitEmissions + annualFlightEmissions;

  // Energy calculation
  const annualElectricityEmissions = Math.round(footprintData.electricityKwh * 0.38 * 12);
  const annualGasEmissions = Math.round(footprintData.naturalGasTherms * 5.3 * 12);
  const totalEnergyEmissions = annualElectricityEmissions + annualGasEmissions;

  // Diet calculation
  let dietFactor = 0.5;
  if (footprintData.diet === 'heavy-meat') dietFactor = 3.0;
  else if (footprintData.diet === 'average-meat') dietFactor = 2.0;
  else if (footprintData.diet === 'low-meat') dietFactor = 1.2;
  else if (footprintData.diet === 'vegetarian') dietFactor = 0.8;
  const annualDietEmissions = Math.round(dietFactor * 365 * 3.5);

  // Lifestyle calculation
  const clothingEmissions = footprintData.clothingPurchases * 15;
  const electronicsEmissions = footprintData.electronicsPurchases * 80;
  const recyclingCredit = footprintData.recycleHabit * 80;
  const totalLifestyleEmissions = Math.max(50, clothingEmissions + electronicsEmissions + (300 - recyclingCredit));

  const totalCalculatedFootprint = totalTravelEmissions + totalEnergyEmissions + annualDietEmissions + totalLifestyleEmissions;

  return (
    <div className="card col-12 animate-fade-in">
      <h3 className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Carbon Footprint Calculator
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Adjust the inputs below to calculate your personal annual carbon footprint in real-time.
      </p>

      <div className="calc-step-header">
        <button 
          className={`calc-step-btn ${activeStep === 'travel' ? 'active' : ''}`}
          onClick={() => setActiveStep('travel')}
        >
          🚗 Travel & Transport
        </button>
        <button 
          className={`calc-step-btn ${activeStep === 'energy' ? 'active' : ''}`}
          onClick={() => setActiveStep('energy')}
        >
          ⚡ Home Energy
        </button>
        <button 
          className={`calc-step-btn ${activeStep === 'diet' ? 'active' : ''}`}
          onClick={() => setActiveStep('diet')}
        >
          🍔 Diet & Meals
        </button>
        <button 
          className={`calc-step-btn ${activeStep === 'lifestyle' ? 'active' : ''}`}
          onClick={() => setActiveStep('lifestyle')}
        >
          🛍️ Lifestyle & Shopping
        </button>
      </div>

      <div className="calc-body" style={{ minHeight: '300px' }}>
        {activeStep === 'travel' && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                <span>Weekly Car Driving (km)</span>
                <span className="form-label-val">{footprintData.kmDriven} km</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="10" 
                value={footprintData.kmDriven} 
                onChange={(e) => updateFootprintData('kmDriven', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Car Engine Type</label>
              <select 
                className="input-select" 
                value={footprintData.fuelType}
                onChange={(e) => updateFootprintData('fuelType', e.target.value)}
              >
                <option value="gasoline">Gasoline / Petrol (High Carbon)</option>
                <option value="diesel">Diesel (Moderate-High Carbon)</option>
                <option value="hybrid">Hybrid (Medium Carbon)</option>
                <option value="electric">Electric EV (Very Low Carbon)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Weekly Public Transit Commuting (hours)</span>
                <span className="form-label-val">{footprintData.transitHours} hrs</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="40" 
                step="1" 
                value={footprintData.transitHours} 
                onChange={(e) => updateFootprintData('transitHours', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Annual Flight Hours (Short and Long Haul)</span>
                <span className="form-label-val">{footprintData.flightHours} hrs</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1" 
                value={footprintData.flightHours} 
                onChange={(e) => updateFootprintData('flightHours', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Transport Calculations Breakdown</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Car: {annualCarEmissions.toLocaleString()} kg CO₂e/yr</span>
                <span>Public Transit: {annualTransitEmissions.toLocaleString()} kg CO₂e/yr</span>
                <span>Aviation: {annualFlightEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Total Transport Footprint:</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{totalTravelEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 'energy' && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                <span>Monthly Household Electricity Consumption (kWh)</span>
                <span className="form-label-val">{footprintData.electricityKwh} kWh</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="1500" 
                step="20" 
                value={footprintData.electricityKwh} 
                onChange={(e) => updateFootprintData('electricityKwh', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Monthly Household Natural Gas Consumption (Therms)</span>
                <span className="form-label-val">{footprintData.naturalGasTherms} Therms</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="5" 
                value={footprintData.naturalGasTherms} 
                onChange={(e) => updateFootprintData('naturalGasTherms', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Energy Calculations Breakdown</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Electricity (Clean Grid Avg): {annualElectricityEmissions.toLocaleString()} kg CO₂e/yr</span>
                <span>Natural Gas: {annualGasEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Total Energy Footprint:</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{totalEnergyEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 'diet' && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Primary Food Dietary Habit</label>
              <select 
                className="input-select" 
                value={footprintData.diet}
                onChange={(e) => updateFootprintData('diet', e.target.value)}
              >
                <option value="heavy-meat">High Beef/Meat Eater (Frequent steak/beef/pork)</option>
                <option value="average-meat">Average Meat Eater (Mixed poultry, beef, seafood)</option>
                <option value="low-meat">Low Meat / Flexitarian (Occasional meat, mostly plant-based)</option>
                <option value="vegetarian">Vegetarian (No meat, consumes dairy/eggs)</option>
                <option value="vegan">Vegan / Plant-Based (Zero animal products, lowest footprint)</option>
              </select>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Dietary Impact Summary</h5>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Beef production accounts for up to 30x more carbon emissions per gram of protein than plant alternatives. Switching to a plant-forward diet is one of the most effective personal carbon reductions.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Diet Carbon Footprint:</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{annualDietEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 'lifestyle' && (
          <div className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">
                <span>New Clothes Purchased (Pieces per Month)</span>
                <span className="form-label-val">{footprintData.clothingPurchases} items</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={footprintData.clothingPurchases} 
                onChange={(e) => updateFootprintData('clothingPurchases', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>New Electronic Devices (Purchased per Year)</span>
                <span className="form-label-val">{footprintData.electronicsPurchases} devices</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1" 
                value={footprintData.electronicsPurchases} 
                onChange={(e) => updateFootprintData('electronicsPurchases', parseInt(e.target.value))}
                className="input-slider"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recycling Habits & Frequency</label>
              <select 
                className="input-select" 
                value={footprintData.recycleHabit}
                onChange={(e) => updateFootprintData('recycleHabit', parseInt(e.target.value))}
              >
                <option value="0">Never Recycle (Landfill everything)</option>
                <option value="1">Rarely Recycle (Only papers/cardboards occasionally)</option>
                <option value="2">Often Recycle (Recycle cans, plastics, and glass)</option>
                <option value="3">Always Recycle & Compost (Zero-waste focus)</option>
              </select>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Lifestyle Impact Breakdown</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Shopping Emissions: {(clothingEmissions + electronicsEmissions).toLocaleString()} kg/yr</span>
                <span>Recycling Offset: -{recyclingCredit.toLocaleString()} kg/yr</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span>Total Lifestyle Footprint:</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{totalLifestyleEmissions.toLocaleString()} kg CO₂e/yr</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '32px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global footprint projection</span>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '800' }}>
            {(totalCalculatedFootprint / 1000).toFixed(2)} Tons CO₂e/year
          </div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Changes are saved locally.</span>
        </div>
      </div>
    </div>
  );
}
