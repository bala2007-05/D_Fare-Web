import { ORDER_STATUS } from '@/lib/enterpriseMockData';
function getOrderAddress(order) {
  if (!order) return '';
  return (
    order.deliveryAddress ??
    order.delivery_address ??
    order.address ??
    order.customer_address ??
    ''
  ).toString().trim();
}
function normalizeLocationKey(address) {
  if (!address || typeof address !== 'string') return '';
  const s = address.trim().toLowerCase().replace(/\s+/g, ' ');
  return s || '';
}
function getAreaKey(address) {
  const parts = address.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join(', ');
  return normalizeLocationKey(address);
}
const DEFAULT_OPTIONS = {
  targetDailyEffort: 100,
  weightPerKg: 1.0,
  baseEffort: 5,
  effortPerKm: 0.5,
  hubLat: null,
  hubLng: null,
  clusterByArea: false,
  spreadWeightToday: 2.0,
  zeroOrdersBonus: 80,
  serviceTypeMultiplier: {
    standard: 1.0,
    express: 1.3,
    same_day: 1.4,
    scheduled: 1.1,
  },
  priorityMultiplier: {
    low: 0.9,
    normal: 1.0,
    high: 1.2,
    urgent: 1.4,
  },
  urgencyBoostNearWindowHours: 1,
  urgencyBoostFactor: 1.2,
};
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
export function computeOrderEffort(order, options = {}) {
  const cfg = { ...DEFAULT_OPTIONS, ...options };
  if (!order) return 0;
  const weight = typeof order.packageWeight === 'number' && !isNaN(order.packageWeight)
    ? order.packageWeight
    : 0;
  const serviceMultiplier =
    cfg.serviceTypeMultiplier[order.serviceType] ?? cfg.serviceTypeMultiplier.standard;
  const priorityMultiplier =
    cfg.priorityMultiplier[order.priority] ?? cfg.priorityMultiplier.normal;
  let effort = cfg.baseEffort;
  effort += weight * cfg.weightPerKg;
  effort *= serviceMultiplier * priorityMultiplier;
  const loc = order.geolocation || order;
  const lat = loc.lat ?? loc.latitude;
  const lng = loc.lng ?? loc.longitude;
  if (cfg.hubLat != null && cfg.hubLng != null && typeof lat === 'number' && typeof lng === 'number') {
    const km = distanceKm(cfg.hubLat, cfg.hubLng, lat, lng);
    effort += km * (cfg.effortPerKm ?? 0.5);
  }
  if (order.timeWindowEnd) {
    const now = new Date();
    const end = new Date(order.timeWindowEnd);
    const hoursRemaining = (end - now) / (1000 * 60 * 60);
    if (hoursRemaining <= cfg.urgencyBoostNearWindowHours) {
      effort *= cfg.urgencyBoostFactor;
    }
  }
  return effort;
}
export function computePreviousDayEffort(previousDayOrders = [], options = {}) {
  const effortByDriver = {};
  for (const order of previousDayOrders) {
    const driverId = order.assignedDriver;
    if (!driverId) continue;
    const status = order.status;
    const isCompleted =
      status === ORDER_STATUS.DELIVERED ||
      status === ORDER_STATUS.FAILED ||
      status === ORDER_STATUS.RTO ||
      status === ORDER_STATUS.ARRIVED;
    if (!isCompleted) continue;
    const effort = computeOrderEffort(order, options);
    effortByDriver[driverId] = (effortByDriver[driverId] || 0) + effort;
  }
  return effortByDriver;
}
function isDriverAssignable(driver) {
  const id = driver.driverId ?? driver.driver_id;
  if (!id) return false;
  const status = driver.status && String(driver.status).toLowerCase();
  if (status === 'offline') return false;
  if (driver.isOnLeave === true || status === 'on_leave' || status === 'on leave') return false;
  if (typeof driver.active === 'boolean') return driver.active === true;
  return true;
}

export function planFairAssignments({
  previousDayOrders = [],
  todayOrders = [],
  drivers = [],
  options = {},
}) {
  const totalDrivers = Array.isArray(drivers) ? drivers.length : 0;
  const activeDrivers = Array.isArray(drivers) ? drivers.filter(isDriverAssignable) : [];
  const activeCount = activeDrivers.length;

  if (!Array.isArray(todayOrders) || todayOrders.length === 0) {
    return {
      assignedOrders: todayOrders || [],
      assignments: [],
      driverEffortSummary: {},
      totalDrivers,
      activeDrivers: activeCount,
    };
  }
  const cfg = { ...DEFAULT_OPTIONS, ...options };
  const yesterdayEffort = computePreviousDayEffort(previousDayOrders, cfg);
  const driverIds = activeDrivers.map((d) => d.driverId ?? d.driver_id).filter(Boolean);
  const todayEffort = {};
  for (const id of driverIds) {
    todayEffort[id] = 0;
    if (!yesterdayEffort[id]) {
      yesterdayEffort[id] = 0;
    }
  }
  const assignableOrders = todayOrders.filter((order) => {
    const isPending = order.status === ORDER_STATUS.PENDING;
    const isUnassigned = !order.assignedDriver;
    return isPending || isUnassigned;
  });
  if (assignableOrders.length === 0) {
    const driverEffortSummary = {};
    for (const id of driverIds) {
      driverEffortSummary[id] = { yesterday: yesterdayEffort[id] || 0, today: 0, total: yesterdayEffort[id] || 0 };
    }
    return { assignedOrders: todayOrders, assignments: [], driverEffortSummary };
  }
  const clusterKey = (order) => {
    const addr = getOrderAddress(order);
    return cfg.clusterByArea ? getAreaKey(addr) : normalizeLocationKey(addr) || order.orderId;
  };
  const clusterMap = new Map();
  for (const order of assignableOrders) {
    const key = clusterKey(order) || order.orderId;
    if (!clusterMap.has(key)) clusterMap.set(key, { key, orders: [], totalEffort: 0, maxUrgency: 0 });
    const c = clusterMap.get(key);
    const effort = computeOrderEffort(order, cfg);
    const urgency = getOrderUrgencyScore(order);
    c.orders.push({ order, effort, urgency });
    c.totalEffort += effort;
    c.maxUrgency = Math.max(c.maxUrgency, urgency);
  }
  const clusters = Array.from(clusterMap.values());
  clusters.sort((a, b) => {
    if (b.maxUrgency !== a.maxUrgency) return b.maxUrgency - a.maxUrgency;
    return b.totalEffort - a.totalEffort;
  });
  const assignments = [];
  for (const cluster of clusters) {
    const driverId = pickBestDriverForCluster({
      drivers: activeDrivers,
      yesterdayEffort,
      todayEffort,
      clusterEffort: cluster.totalEffort,
      cfg,
    });
    if (!driverId) continue;
    todayEffort[driverId] += cluster.totalEffort;
    for (const { order, effort } of cluster.orders) {
      assignments.push({ orderId: order.orderId, driverId, effort });
    }
  }
  const assignmentMap = new Map(assignments.map((a) => [a.orderId, a.driverId]));
  const assignedOrders = todayOrders.map((order) => {
    const suggestedDriver = assignmentMap.get(order.orderId);
    if (!suggestedDriver) return order;
    return {
      ...order,
      assignedDriver: suggestedDriver,
      status: order.status === ORDER_STATUS.PENDING ? ORDER_STATUS.ASSIGNED : order.status,
    };
  });
  const driverEffortSummary = {};
  for (const id of driverIds) {
    const y = yesterdayEffort[id] || 0;
    const t = todayEffort[id] || 0;
    driverEffortSummary[id] = { yesterday: y, today: t, total: y + t };
  }
  return {
    assignedOrders,
    assignments,
    driverEffortSummary,
    totalDrivers,
    activeDrivers: activeCount,
  };
}
function getOrderUrgencyScore(order) {
  let score = 0;
  if (order.priority === 'urgent') score += 3;
  else if (order.priority === 'high') score += 2;
  else if (order.priority === 'normal') score += 1;
  if (order.timeWindowEnd) {
    const now = new Date();
    const end = new Date(order.timeWindowEnd);
    const hoursRemaining = (end - now) / (1000 * 60 * 60);
    if (hoursRemaining <= 0) score += 4; // already overdue
    else if (hoursRemaining <= 1) score += 3;
    else if (hoursRemaining <= 3) score += 2;
    else score += 1;
  }
  return score;
}
function getEffectiveCapacity(driver, cfg) {
  const target = cfg.targetDailyEffort ?? 100;
  if (driver.isHalfDay === true || driver.halfDay === true) return target / 2;
  return target;
}
function pickBestDriverForCluster({
  drivers,
  yesterdayEffort,
  todayEffort,
  clusterEffort,
  cfg,
}) {
  let bestDriverId = null;
  let bestScore = Infinity;
  for (const driver of drivers) {
    const id = driver.driverId ?? driver.driver_id;
    if (!id) continue;
    const status = driver.status && String(driver.status).toLowerCase();
    if (status === 'offline') continue;
    if (driver.isOnLeave === true || status === 'on_leave' || status === 'on leave') continue;
    const y = yesterdayEffort[id] || 0;
    const t = todayEffort[id] || 0;
    const projectedToday = t + clusterEffort;
    const capacity = getEffectiveCapacity(driver, cfg);
    const overCapacity = Math.max(0, projectedToday - capacity);
    const overloadPenalty = overCapacity * 1.5;
    const projectedTotal = y + projectedToday;
    let score = projectedTotal + overloadPenalty;
    const spreadWeight = cfg.spreadWeightToday ?? 2.0;
    score += t * spreadWeight;
    const zeroBonus = cfg.zeroOrdersBonus ?? 80;
    if (t === 0) score -= zeroBonus;
    if (score < bestScore) {
      bestScore = score;
      bestDriverId = id;
    }
  }
  return bestDriverId;
}
