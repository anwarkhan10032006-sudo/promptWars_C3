import React from 'react';
import { selectDemoProfile } from './actions';
import { Leaf, GraduationCap, Plane, Home, ShieldCheck } from 'lucide-react';

export default function DemoPage() {
  const personas = [
    {
      slug: 'college_student' as const,
      name: 'College Student (Alex)',
      desc: 'Living in a shared apartment, commuting by bus or bicycle, and vegetarian. Low baseline emissions.',
      footprint: '85.5 kg/mo',
      icon: <GraduationCap className="h-6 w-6 text-category-food" />,
      color: 'border-category-food/20 hover:border-category-food/50'
    },
    {
      slug: 'frequent_traveler' as const,
      name: 'Frequent Traveler (Maya)',
      desc: 'Constant flight commutes for business travel. High baseline emissions. Flight offsets are the key challenge.',
      footprint: '1,250.0 kg/mo',
      icon: <Plane className="h-6 w-6 text-category-flights" />,
      color: 'border-category-flights/20 hover:border-category-flights/50'
    },
    {
      slug: 'family_household' as const,
      name: 'Family Household (The Millers)',
      desc: '4 family members in suburban home. High heating, food prep, and residential utility consumption.',
      footprint: '340.0 kg/mo',
      icon: <Home className="h-6 w-6 text-category-electricity" />,
      color: 'border-category-electricity/20 hover:border-category-electricity/50'
    },
    {
      slug: 'sustainability_enthusiast' as const,
      name: 'Sustainability Enthusiast (Clara)',
      desc: 'EV driver with rooftop solar. 100% vegan eating. Very low emissions, looking for final marginal improvements.',
      footprint: '32.2 kg/mo',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      color: 'border-primary/20 hover:border-primary/50'
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-center items-center py-12 px-6">
      
      {/* Brand Header */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-1.5 bg-primary rounded-lg text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-extrabold font-display text-xl tracking-tight">VERDANCE DEMO</span>
      </div>

      <div className="max-w-4xl w-full text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-text-primary">
          Select a Judge Demo Profile
        </h1>
        <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto">
          Experience VERDANCE instantly with 90 days of preloaded data, active recommendations, streaks, and missions.
        </p>
      </div>

      {/* Grid of Profile options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {personas.map((p) => (
          <form key={p.slug} action={selectDemoProfile}>
            <input type="hidden" name="slug" value={p.slug} />
            <button
              type="submit"
              className={`w-full text-left bg-surface border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-120 flex flex-col justify-between h-48 cursor-pointer ${p.color} hover:scale-[1.01]`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-surface-elevated border border-border/40 rounded-xl">
                  {p.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Est. Footprint</span>
                  <span className="font-tabular font-bold text-text-primary text-base">{p.footprint}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-base font-display text-text-primary">{p.name}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-snug">{p.desc}</p>
              </div>
            </button>
          </form>
        ))}
      </div>

    </div>
  );
}
