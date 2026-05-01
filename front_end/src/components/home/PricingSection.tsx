import React from 'react';
import { Check, Zap, Building2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Basic',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for exploring Evalify and small-scale trials.',
    icon: <Zap size={22} className="text-text-muted" />,
    badge: null,
    highlighted: false,
    cta: 'Get Started Free',
    ctaLink: '/register',
    features: [
      'Up to 30 papers / month',
      'Basic OCR extraction',
      '1 exam template',
      'PDF export',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For active educators who need unlimited power.',
    icon: <Star size={22} className="text-white" />,
    badge: 'Most Popular',
    highlighted: true,
    cta: 'Start Pro Trial',
    ctaLink: '/register',
    features: [
      'Unlimited papers',
      'Advanced AI OCR',
      'Unlimited templates',
      'Analytics dashboard',
      'Priority support',
      'Excel & PDF export',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per institution',
    description: 'Tailored for universities and large academic institutions.',
    icon: <Building2 size={22} className="text-text-muted" />,
    badge: null,
    highlighted: false,
    cta: 'Contact Sales',
    ctaLink: '/register',
    features: [
      'Everything in Pro',
      'Multi-department access',
      'SSO & LMS integration',
      'Dedicated account manager',
      'Custom API access',
      'SLA guarantee',
    ],
  },
];

const PricingSection: React.FC = () => (
  <div className="py-24 bg-white border-t border-border/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Pricing</span>
        <h2 className="text-4xl font-bold text-text-primary mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-text-muted">No hidden fees. No surprises. Pick the plan that fits your workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {PLANS.map((plan, i) => (
          <div
            key={i}
            className={`relative flex flex-col rounded-[2rem] border p-8 transition-all duration-300 hover:-translate-y-1 ${
              plan.highlighted
                ? 'bg-primary border-primary shadow-[0_20px_60px_rgba(79,70,229,0.30)] scale-[1.03]'
                : 'bg-white border-border/40 shadow-strong'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 bg-white border border-primary/20 text-primary text-xs font-bold rounded-full shadow-sm">
                  ★ {plan.badge}
                </span>
              </div>
            )}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.highlighted ? 'bg-white/20' : 'bg-bg-surface'}`}>
              {plan.icon}
            </div>

            <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-text-primary'}`}>{plan.name}</h3>
            <p className={`text-sm mb-6 font-medium ${plan.highlighted ? 'text-white/70' : 'text-text-muted'}`}>{plan.description}</p>

            <div className={`flex items-end gap-1 mb-8 ${plan.highlighted ? 'text-white' : 'text-text-primary'}`}>
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-white/70' : 'text-text-muted'}`}>{plan.period}</span>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${plan.highlighted ? 'bg-white/20' : 'bg-success/10'}`}>
                    <Check size={12} className={plan.highlighted ? 'text-white' : 'text-success'} strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-semibold ${plan.highlighted ? 'text-white/90' : 'text-text-secondary'}`}>{f}</span>
                </li>
              ))}
            </ul>

            <Link to={plan.ctaLink}>
              <button className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] ${
                plan.highlighted
                  ? 'bg-white text-primary hover:bg-white/90 shadow-sm'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-md'
              }`}>
                {plan.cta}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PricingSection;
