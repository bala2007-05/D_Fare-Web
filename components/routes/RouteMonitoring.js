'use client';
import { MapPin, Navigation, Clock, TrendingUp, Circle } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { routes } from '@/lib/enterpriseMockData';
import { formatRelativeTime, cn } from '@/lib/utils';
export default function RouteMonitoring() {
  const getGeofenceColor = (status) => {
    const colors = {
      inside: 'bg-success-100 text-success-700',
      outside: 'bg-danger-100 text-danger-700',
      approaching: 'bg-warning-100 text-warning-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Active Routes</h2>
        <p className="text-sm text-slate-600 mt-1">{routes.length} routes in progress</p>
      </div>
      <div className="space-y-4">
        {routes.map((route) => (
          <Card key={route.routeId}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{route.routeId}</CardTitle>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Driver: {route.driverId}</p>
                </div>
                <Badge variant={route.status === 'in_progress' ? 'in_progress' : 'completed'}>
                  {route.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Route Progress</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {route.distanceTraveled.toFixed(1)} / {route.totalDistance.toFixed(1)} km
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(route.distanceTraveled / route.totalDistance) * 100}%` }}
                  />
                </div>
              </div>
              {/* Stop Progress */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Current Stop</div>
                  <div className="text-lg font-bold text-slate-900">
                    {route.sequenceNumber} / {route.totalStops}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">ETA Next Stop</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatRelativeTime(route.etaNextStop)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Traffic Factor</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {route.trafficFactor}x
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Geofence Status</div>
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded text-xs font-medium capitalize',
                    getGeofenceColor(route.geofenceStatus)
                  )}>
                    {route.geofenceStatus}
                  </span>
                </div>
              </div>
              {/* Stop Sequence */}
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-3">Stop Sequence</div>
                <div className="space-y-2">
                  {route.stops.map((stop, index) => (
                    <div 
                      key={index}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border',
                        stop.completed 
                          ? 'bg-success-50 border-success-200' 
                          : index === route.sequenceNumber - 1
                          ? 'bg-primary-50 border-primary-200'
                          : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        stop.completed 
                          ? 'bg-success-500 text-white' 
                          : index === route.sequenceNumber - 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-300 text-slate-600'
                      )}>
                        {index === route.sequenceNumber - 1 ? (
                          <Navigation className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-mono font-medium text-slate-900">
                          {stop.orderId}
                        </div>
                        {index === route.sequenceNumber - 1 && (
                          <div className="text-xs text-primary-600 font-medium">Current Stop</div>
                        )}
                      </div>
                      {stop.completed && (
                        <Badge variant="completed">Completed</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Map Placeholder */}
              <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Live Map View</p>
                  <p className="text-xs text-slate-400">Integration placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}