'use client';
import { Scale, Clock, Eye } from 'lucide-react';
const VALUES = [
  {
    icon: Scale,
    title: 'Fair dispatch decisions',
    description:
      'Dispatch rules are designed to keep workloads balanced so no single driver or route absorbs all the difficult stops.',
  },
  {
    icon: Clock,
    title: 'Operational efficiency',
    description:
      'Focus on on-time arrivals, practical routes, and clear visibility into where deliveries stand at every moment.',
  },
  {
    icon: Eye,
    title: 'Transparent outcomes',
    description:
      'Understand why specific routes and assignments were made so operations teams can explain and refine them over time.',
  },
];
export default function WhyDFarePage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-none px-6 py-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <section className="mb-6 text-center md:mb-8">
            <p className="text-2xl font-extrabold uppercase tracking-[0.2em] text-blue-600 md:text-3xl">
              WHY D-FARE
            </p>
          </section>
          <section>
            <div className="grid gap-4 md:grid-cols-3">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <article
                    key={value.title}
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {value.title}
                    </h2>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <section className="mt-6 flex min-h-0 flex-1 overflow-hidden md:mt-8">
        <img
          src="/images/ilu%203.jpeg"
          alt="Why D-FARE"
          className="h-full w-full object-cover"
        />
      </section>
    </div>
  );
}