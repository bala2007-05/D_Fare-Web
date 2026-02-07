'use client';
import { Truck, MapPin, Scale, Clock, BarChart3, Shield } from 'lucide-react';
const FEATURES = [
  {
    icon: Truck,
    title: 'Live Dispatch Board',
    description:
      'Monitor all active routes, driver assignments, and delivery progress from a single view.',
  },
  {
    icon: MapPin,
    title: 'Route Visibility',
    description:
      'See where each delivery is in the route sequence and understand route-level performance.',
  },
  {
    icon: Scale,
    title: 'Fair Workload View',
    description:
      'Check how work is distributed across drivers to keep routes and stops balanced.',
  },
  {
    icon: Clock,
    title: 'Time Window Tracking',
    description:
      'Track delivery time windows, due times, and lateness so you can react before issues occur.',
  },
  {
    icon: BarChart3,
    title: 'Dispatch KPIs',
    description:
      'Review completion rates, capacity usage, and other key logistics metrics in one place.',
  },
  {
    icon: Shield,
    title: 'COD & Return Handling',
    description:
      'Maintain visibility into COD exposure, returns to hub, and payment-related constraints.',
  },
];
export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="flex-none px-6 pt-6 text-center md:pt-8">
        <p className="text-lg font-extrabold uppercase tracking-[0.2em] text-blue-600 md:text-xl">
          FEATURES
        </p>
      </section>
      <section className="flex flex-1 items-center px-6 pb-8 pt-3 md:pb-10 md:pt-4">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mb-2 text-base font-semibold text-slate-900">
                  {feature.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}