'use client';
import { Truck, Scale, MapPin } from 'lucide-react';
const STEPS = [
  {
    icon: Truck,
    step: '1',
    title: 'Collect and queue deliveries',
    description:
      'Orders enter the dispatch queue with their destinations, time windows, and COD details ready for assignment.',
    image: '/images/hiw1.jpg',
  },
  {
    icon: Scale,
    step: '2',
    title: 'Balance work across drivers',
    description:
      'The system groups stops into routes and balances work across drivers so each route is practical and fair.',
    image: '/images/hiw2.jpg',
  },
  {
    icon: MapPin,
    step: '3',
    title: 'Execute and monitor routes',
    description:
      'Drivers follow their routes while dispatch monitors progress, exceptions, and returns to hub when needed.',
    image: '/images/hitw3.webp',
  },
];
export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6 md:py-8">
      <section className="mb-6 text-center md:mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          HOW IT WORKS
        </p>
      </section>
      <section>
        <div className="grid grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="flex min-h-[480px] min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:min-h-[560px] md:p-10 lg:min-h-[600px] lg:p-12"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Step {step.step}</span>
                </div>
                <h2 className="mb-6 text-base font-semibold text-slate-900 md:text-lg">
                  {step.title}
                </h2>
                <div className="relative mt-auto min-h-[280px] flex-1 overflow-hidden rounded-xl md:min-h-[340px] lg:min-h-[380px]">
                  <img
                    src={step.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover rounded-xl"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}