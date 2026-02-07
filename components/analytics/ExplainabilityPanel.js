'use client';
import { Info, Lightbulb } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { explainabilityExample } from '@/lib/mockData';
export default function ExplainabilityPanel() {
  return (
    <Card className="border-primary-200 bg-primary-50/30">
      <CardHeader className="bg-primary-50/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <CardTitle>AI Assignment Explainability</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Understanding how the AI makes fair task assignments
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Example Assignment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Example: Task {explainabilityExample.taskId}
            </h4>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Assigned to</span>
              <span className="text-sm font-semibold text-primary-700">
                {explainabilityExample.driverName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Driver ID</span>
              <span className="text-xs font-mono text-slate-700">
                {explainabilityExample.assignedDriver}
              </span>
            </div>
          </div>
          {/* Decision Factors */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Decision Factors
            </h5>
            {explainabilityExample.factors.map((factor, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:border-primary-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h6 className="text-sm font-semibold text-slate-900">
                        {factor.name}
                      </h6>
                      <span className="text-xs font-medium text-primary-600">
                        {factor.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right flex-shrink-0">
                    <div className="text-xs text-slate-500 mb-1">Weight</div>
                    <div className="text-lg font-bold text-slate-900">
                      {factor.weight}%
                    </div>
                  </div>
                </div>
                {/* Weight Bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${factor.weight}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Summary Explanation */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Summary
              </h6>
              <p className="text-sm text-slate-700 leading-relaxed">
                {explainabilityExample.explanation}
              </p>
            </div>
          </div>
        </div>
        {/* Read-Only Notice */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 italic text-center">
            This is a read-only view. All task assignments are made automatically by AI.
            Manual overrides are not permitted to maintain fairness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}