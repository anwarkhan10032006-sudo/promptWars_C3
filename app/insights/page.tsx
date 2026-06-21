import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionId, getUserProfile, getActivityLogs } from '../../lib/db';
import { Navigation } from '../../components/navigation';
import { LineChart } from '../../components/charts/line-chart';
import { DonutChart } from '../../components/charts/donut-chart';
import { LineChart as LineChartIcon, BarChart3, PieChart } from 'lucide-react';
import { partitionLogsInto30DayBlocks, forecastNext30DayFootprint } from '../../lib/emissions';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const sessionId = await getSessionId();
  const userId = `user-${sessionId}`;

  const profile = await getUserProfile(userId);
  if (!profile) {
    redirect('/demo');
  }

  const logs = await getActivityLogs(userId);

  // 1. Calculate Monthly Footprint Partitioning
  const [b1, b2, b3] = partitionLogsInto30DayBlocks(logs);

  // 2. Forecast Footprint
  const forecast = forecastNext30DayFootprint(logs);

  // 3. Donut Chart breakdown data
  const getCategoryTotal = (cat: string) => {
    return logs
      .filter(l => l.category === cat && new Date(l.occurred_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, l) => sum + Number(l.computed_emissions_kgco2e), 0);
  };

  const donutData = [
    { name: 'Transportation', value: getCategoryTotal('transportation'), color: 'var(--category-transportation)' },
    { name: 'Electricity', value: getCategoryTotal('electricity'), color: 'var(--category-electricity)' },
    { name: 'Food', value: getCategoryTotal('food'), color: 'var(--category-food)' },
    { name: 'Shopping', value: getCategoryTotal('shopping'), color: 'var(--category-shopping)' },
    { name: 'Flights', value: getCategoryTotal('flights'), color: 'var(--category-flights)' }
  ];

  // 4. Line Chart historical + forecast data
  const lineData = [
    { date: '60d ago', actual: Number(b3.toFixed(1)) },
    { date: '30d ago', actual: Number(b2.toFixed(1)) },
    { 
      date: 'Current Month', 
      actual: Number(b1.toFixed(1)), 
      forecast: Number(b1.toFixed(1)),
      lowerBound: Number(b1.toFixed(1)), 
      upperBound: Number(b1.toFixed(1)) 
    },
    { 
      date: 'Forecast (Next 30d)', 
      forecast: Number(forecast.forecasted.toFixed(1)),
      lowerBound: Number(forecast.lowerBound.toFixed(1)),
      upperBound: Number(forecast.upperBound.toFixed(1))
    }
  ];

  return (
    <Navigation userProfile={profile}>
      <div className="space-y-8 pb-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-border p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-text-primary tracking-tight">
              Deep Analytics
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Visualize your footprint trajectory, pinpoint high-emission categories, and explore tabular data.
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <LineChartIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-primary" />
              90-Day Trend
            </h3>
            <div className="h-80 w-full">
              <LineChart data={lineData} />
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6 flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-primary" />
              Category Breakdown
            </h3>
            <div className="h-80 w-full">
              <DonutChart data={donutData} />
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
