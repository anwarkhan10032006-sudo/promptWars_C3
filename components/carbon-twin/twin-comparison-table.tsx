import React from 'react';
import { CarbonTwinProjection } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface TwinComparisonTableProps {
  projections: CarbonTwinProjection[];
  months: 3 | 6 | 12;
}

export function TwinComparisonTable({ projections, months }: TwinComparisonTableProps) {
  const getEmissionsForMonth = (proj: CarbonTwinProjection | undefined) => {
    if (!proj) return 0;
    if (months === 3) return Number(proj.month_3_kgco2e || 0);
    if (months === 6) return Number(proj.month_6_kgco2e || 0);
    return Number(proj.month_12_kgco2e || 0);
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm overflow-x-auto">
      <h3 className="font-semibold text-text-primary font-display text-lg mb-4">Carbon Twin Scenario Comparison Table</h3>
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-elevated">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Scenario Metric</th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-text-secondary">Current Trajectory</th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-text-secondary">Moderate Improvement</th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-text-secondary">Aggressive Reduction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="px-4 py-3 font-medium text-text-primary">Projected Footprint ({months} mo)</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {getEmissionsForMonth(projections.find(p => p.scenario === 'current_trajectory'))} kg CO2e
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {getEmissionsForMonth(projections.find(p => p.scenario === 'moderate'))} kg CO2e
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {getEmissionsForMonth(projections.find(p => p.scenario === 'aggressive'))} kg CO2e
            </td>
          </tr>
          <tr className="hover:bg-surface-elevated/40">
            <td className="px-4 py-3 font-medium text-text-primary">Percentage Reduction</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'current_trajectory')?.reduction_pct || 0}%
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'moderate')?.reduction_pct || 0}%
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'aggressive')?.reduction_pct || 0}%
            </td>
          </tr>
          <tr className="hover:bg-surface-elevated/40">
            <td className="px-4 py-3 font-medium text-text-primary">Eco Score (0-100)</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'current_trajectory')?.sustainability_score || 0}/100
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'moderate')?.sustainability_score || 0}/100
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {projections.find(p => p.scenario === 'aggressive')?.sustainability_score || 0}/100
            </td>
          </tr>
          <tr className="hover:bg-surface-elevated/40">
            <td className="px-4 py-3 font-medium text-text-primary">Estimated Cost Savings</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">$0.00/mo</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {formatCurrency(projections.find(p => p.scenario === 'moderate')?.estimated_cost_savings || 0)}/mo
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {formatCurrency(projections.find(p => p.scenario === 'aggressive')?.estimated_cost_savings || 0)}/mo
            </td>
          </tr>
          <tr className="hover:bg-surface-elevated/40">
            <td className="px-4 py-3 font-medium text-text-primary">Goal Achievement Probability</td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {((projections.find(p => p.scenario === 'current_trajectory')?.goal_achievement_probability || 0) * 100).toFixed(0)}%
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {((projections.find(p => p.scenario === 'moderate')?.goal_achievement_probability || 0) * 100).toFixed(0)}%
            </td>
            <td className="px-4 py-3 text-right font-tabular text-text-secondary">
              {((projections.find(p => p.scenario === 'aggressive')?.goal_achievement_probability || 0) * 100).toFixed(0)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
