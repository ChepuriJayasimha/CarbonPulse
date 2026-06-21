import React from 'react';

export default function EcoCoach({ footprintData }) {
  
  // Custom analysis logic
  const getCoachInsights = () => {
    const insights = [];

    // Travel recommendations
    if (footprintData.kmDriven > 250) {
      const fuelTypeLabel = footprintData.fuelType === 'gasoline' ? 'fossil-fuel gasoline' : footprintData.fuelType;
      insights.push({
        id: 'car-miles',
        category: 'Transport',
        type: 'warning',
        impact: 'High Impact',
        savings: `${Math.round(footprintData.kmDriven * 52 * 0.15)} kg/year`,
        title: `Reduce vehicle mileage of ${footprintData.kmDriven} km/week`,
        description: `Your weekly commute using a ${fuelTypeLabel} car creates significant emissions. Consider switching to carpooling, riding a bicycle, or working from home 2 days/week. Changing to an electric vehicle (EV) would cut these emissions by up to 75%.`
      });
    }

    if (footprintData.flightHours > 10) {
      insights.push({
        id: 'flights',
        category: 'Aviation',
        type: 'danger',
        impact: 'Critical Alert',
        savings: `${footprintData.flightHours * 150} kg/year`,
        title: `Aviation footprint is ${footprintData.flightHours} hours/year`,
        description: 'Air travel emits massive amounts of CO₂ directly into the upper atmosphere. Consider virtual meetings, booking direct flights (takeoffs/landings emit the most), or traveling by high-speed rail for domestic routes.'
      });
    }

    // Energy recommendations
    if (footprintData.electricityKwh > 400) {
      insights.push({
        id: 'electricity',
        category: 'Home Energy',
        type: 'warning',
        impact: 'High Impact',
        savings: `${Math.round(footprintData.electricityKwh * 12 * 0.1)} kg/year`,
        title: `High Electricity usage of ${footprintData.electricityKwh} kWh/month`,
        description: 'Optimize energy efficiency by replacing remaining incandescent lightbulbs with smart LEDs, unplugging vampire appliances, and running heavy laundry loads in cold water. You can also explore local community solar programs.'
      });
    }

    if (footprintData.naturalGasTherms > 50) {
      insights.push({
        id: 'natural-gas',
        category: 'Home Heating',
        type: 'info',
        impact: 'Medium Impact',
        savings: `${Math.round(footprintData.naturalGasTherms * 12 * 1.5)} kg/year`,
        title: 'Optimize heating and hot water therms',
        description: 'Lowering your central thermostat by just 1.5°C in the winter and wrapping your water heater in an insulating blanket can reduce gas usage by 10-15%. Consider heat pump retrofits for future HVAC upgrades.'
      });
    }

    // Diet recommendations
    if (footprintData.diet === 'heavy-meat' || footprintData.diet === 'average-meat') {
      insights.push({
        id: 'diet-change',
        category: 'Dietary Choice',
        type: 'warning',
        impact: 'High Impact',
        savings: '800 - 1,500 kg/year',
        title: `Transition your '${footprintData.diet === 'heavy-meat' ? 'Heavy Meat' : 'Average Meat'}' diet`,
        description: 'Animal agriculture contributes to roughly 15% of global greenhouse emissions. Replacing 3 meat-heavy meals per week with vegetarian or plant-based meals cuts food footprint by 25%. Swap beef for chicken or lentils to maximize immediate offsets.'
      });
    }

    // Shopping recommendations
    if (footprintData.clothingPurchases > 4) {
      insights.push({
        id: 'retail',
        category: 'Consumption',
        type: 'info',
        impact: 'Medium Impact',
        savings: '250 kg/year',
        title: 'Adopt slow fashion and circular economy habits',
        description: 'Textile production generates high carbon output per item. Seek high-quality durable garments, purchase from second-hand thrift stores, and repair clothing items to extend product lifespans.'
      });
    }

    if (footprintData.recycleHabit < 2) {
      insights.push({
        id: 'recycling',
        category: 'Waste',
        type: 'info',
        impact: 'Medium Impact',
        savings: '180 kg/year',
        title: 'Boost waste sorting and composting habits',
        description: 'Diverting organic food waste and recyclables from landfills reduces fugitive methane emissions. Introduce a compost bin for organic food waste and separate cardboard/plastics consistently.'
      });
    }

    // Add default general recommendation if footprint looks already low
    if (insights.length === 0) {
      insights.push({
        id: 'low-footprint-general',
        category: 'General Advocacy',
        type: 'success',
        impact: 'Advocacy Shift',
        savings: 'N/A',
        title: 'You are an Eco Leader!',
        description: 'Your carbon metrics are exceptionally low. Your next step is systemic advocacy: encourage friends/colleagues to track their footprint, support clean energy policies, and help local conservation projects.'
      });
    }

    return insights;
  };

  const insightsList = getCoachInsights();
  
  // Count criticals and warnings
  const criticalCount = insightsList.filter(ins => ins.type === 'danger').length;
  const warningCount = insightsList.filter(ins => ins.type === 'warning').length;

  return (
    <div className="card col-12 animate-fade-in">
      <h3 className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        Premium Eco-Coach Advisor
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Based on your current calculator data, our premium advisor has compiled personalized recommendations to accelerate your transition to carbon neutrality.
      </p>

      {/* Critical/Warning alerts bar */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="coach-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
          </svg>
          <div>
            <strong>Action Needed:</strong> Found <strong>{criticalCount} critical alerts</strong> and <strong>{warningCount} high-impact improvements</strong>. Address transport and energy parameters to maximize carbon reductions.
          </div>
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="coach-recommendations">
        {insightsList.map((insight) => {
          // Dynamic styling based on impact
          const borderStyle = insight.type === 'danger' ? 'rgba(239, 68, 68, 0.4)' : 
                              insight.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 
                              'rgba(16, 185, 129, 0.2)';
          
          const titleColor = insight.type === 'danger' ? 'var(--danger-color)' :
                             insight.type === 'warning' ? 'var(--warning-color)' :
                             'var(--text-primary)';

          return (
            <div 
              key={insight.id} 
              className="coach-rec-card" 
              style={{ borderLeft: `4px solid ${borderStyle}`, borderColor: borderStyle }}
            >
              <div className="coach-rec-header">
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  🏷️ {insight.category}
                </span>
                <span className="coach-rec-impact" style={{ 
                  backgroundColor: insight.type === 'danger' ? 'rgba(239,68,68,0.15)' : 
                                  insight.type === 'warning' ? 'rgba(245,158,11,0.15)' : 
                                  'rgba(16,185,129,0.15)',
                  color: insight.type === 'danger' ? 'var(--danger-color)' :
                         insight.type === 'warning' ? 'var(--warning-color)' :
                         'var(--accent-secondary)'
                }}>
                  {insight.impact}
                </span>
              </div>
              
              <h4 className="coach-rec-title" style={{ color: titleColor, fontSize: '16px', margin: '6px 0', fontWeight: '700' }}>
                {insight.title}
              </h4>
              
              <p className="coach-rec-desc" style={{ marginBottom: '12px' }}>
                {insight.description}
              </p>
              
              {insight.savings !== 'N/A' && (
                <div style={{ fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Potential Carbon Offset:</span>
                  <strong style={{ color: 'var(--accent-secondary)' }}>✨ {insight.savings}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
