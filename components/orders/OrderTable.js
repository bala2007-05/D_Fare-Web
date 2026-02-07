'use client';
import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  Search, 
  Download, 
  Plus, 
  AlertTriangle, 
  MoreHorizontal, 
  UploadCloud, 
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { ORDER_STATUS } from '@/lib/enterpriseMockData';
import { formatRelativeTime, cn } from '@/lib/utils';
import { useRole } from '@/lib/roleContext';
import { planFairAssignments } from '@/components/drivers/fairassignment';
export default function OrderTable({
  orders = [],
  drivers = [],
  ordersLoading = false,
  onOrderSelect,
  onOverride,
  onUpdateOrder,
  onCreateOrders,
  onClearOrdersError,
}) {
  const { hasPermission } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeActionOrderId, setActiveActionOrderId] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [manualOrder, setManualOrder] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    codAmount: '',
    serviceType: 'standard',
  });
  const closeNewOrderModal = () => {
    setShowNewOrderModal(false);
    setCsvPreview([]);
    setCsvError('');
    setCsvFileName('');
    if (typeof onClearOrdersError === 'function') onClearOrdersError();
  };
  const hasFinancialAccess = hasPermission('canViewFinancials');
  const getOrderAddress = (order) => {
    if (!order) return '';
    return (
      order.deliveryAddress ??
      order.delivery_address ??
      order.address ??
      order.customer_address ??
      ''
    );
  };
  const isCODOrder = (order) => order.codAmount && order.codAmount > 0;
  const getPaymentStatus = (order) => {
    if (isCODOrder(order)) {
      if (order.status === ORDER_STATUS.DELIVERED) {
        return 'COD – Collected';
      }
      if (order.status === ORDER_STATUS.RETURNED_TO_HUB) {
        return 'COD – Not Collected';
      }
      return 'COD – Pending';
    }
    if (order.status === ORDER_STATUS.RETURNED_TO_HUB) {
      return 'Refund Initiated';
    }
    return 'Prepaid';
  };
  const getPaymentStatusClasses = (status) => {
    const map = {
      'COD – Pending': 'bg-amber-50 text-amber-700',
      'COD – Collected': 'bg-emerald-50 text-emerald-700',
      'COD – Not Collected': 'bg-red-50 text-red-700',
      Prepaid: 'bg-slate-100 text-slate-700',
      Refunded: 'bg-emerald-50 text-emerald-700',
      'Refund Initiated': 'bg-blue-50 text-blue-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };
  const driverCodInfo = useMemo(() => {
    if (!orders.length || !drivers.length) return {};
    const info = {};
    const driverLimits = {};
    drivers.forEach((d) => {
      driverLimits[d.driverId] = d.codLimit ?? 500;
    });
    orders.forEach((order) => {
      if (!order.assignedDriver || !isCODOrder(order)) return;
      const driverId = order.assignedDriver;
      const limit = driverLimits[driverId] ?? 500;
      if (!info[driverId]) {
        info[driverId] = { collected: 0, limit, limitReached: false };
      }
      if (order.status === ORDER_STATUS.DELIVERED) {
        info[driverId].collected += order.codAmount;
      }
    });
    Object.values(info).forEach((entry) => {
      entry.limitReached = entry.collected >= entry.limit;
    });
    return info;
  }, [orders, drivers]);
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const address = getOrderAddress(order);
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesService = serviceFilter === 'all' || order.serviceType === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [orders, searchQuery, statusFilter, serviceFilter]);
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    const dir = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'orderId':
          va = (a.orderId || '').toLowerCase();
          vb = (b.orderId || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'customerName':
          va = (a.customerName || '').toLowerCase();
          vb = (b.customerName || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'deliveryAddress':
          va = (getOrderAddress(a) || '').toLowerCase();
          vb = (getOrderAddress(b) || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'status':
          va = (a.status || '').toLowerCase();
          vb = (b.status || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'serviceType':
          va = (a.serviceType || '').toLowerCase();
          vb = (b.serviceType || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'assignedDriver':
          va = (a.assignedDriver || '').toLowerCase();
          vb = (b.assignedDriver || '').toLowerCase();
          return dir * (va < vb ? -1 : va > vb ? 1 : 0);
        case 'createdAt':
        default:
          va = new Date(a.createdAt || 0).getTime();
          vb = new Date(b.createdAt || 0).getTime();
          return dir * (va - vb);
      }
    });
    return list;
  }, [filteredOrders, sortBy, sortDir]);
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir(column === 'createdAt' ? 'desc' : 'asc');
    }
  };
  const handleExportAssignedOrders = () => {
    const assignedOrders = sortedOrders.filter((o) => o.assignedDriver);
    if (assignedOrders.length === 0) {
      return;
    }
    const rows = assignedOrders.map((order) => ({
      'Order ID': order.orderId ?? '',
      Customer: order.customerName ?? '',
      'Customer Phone': order.customerPhone ?? '',
      'Delivery Address': getOrderAddress(order) ?? '',
      Status: order.status ?? '',
      Service: order.serviceType ?? '',
      Driver: order.assignedDriver ?? '',
      'Assigned Route': order.assignedRoute ?? '',
      'Hub ID': order.hubId ?? '',
      'COD (INR)': order.codAmount != null ? Number(order.codAmount) : '',
      'Payment Status': getPaymentStatus(order),
      Priority: order.priority ?? '',
      Attempts: order.attempts ?? 0,
      Created: order.createdAt ?? '',
      Updated: order.updatedAt ?? '',
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-assigned-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 inline" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-600 ml-0.5 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-600 ml-0.5 inline" />
    );
  };
  const getSLAStatus = (order) => {
    const now = new Date();
    const windowEnd = new Date(order.timeWindowEnd);
    const hoursRemaining = (windowEnd - now) / (1000 * 60 * 60);
    if (order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.RETURNED_TO_HUB) {
      return 'completed';
    }
    if (hoursRemaining < 0) return 'overdue';
    if (hoursRemaining < 1) return 'critical';
    if (hoursRemaining < 3) return 'warning';
    return 'ontime';
  };
  const getSLABadge = (order) => {
    const status = getSLAStatus(order);
    const colors = {
      completed: 'bg-success-100 text-success-700',
      ontime: 'bg-slate-100 text-slate-600',
      warning: 'bg-warning-100 text-warning-700',
      critical: 'bg-danger-100 text-danger-700',
      overdue: 'bg-danger-500 text-white',
    };
    const labels = {
      completed: 'Completed',
      ontime: 'On Time',
      warning: 'Due Soon',
      critical: 'Critical',
      overdue: 'Overdue',
    };
    return (
      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colors[status])}>
        {labels[status]}
      </span>
    );
  };
  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'bg-slate-100 text-slate-700',
      [ORDER_STATUS.ASSIGNED]: 'bg-primary-100 text-primary-700',
      [ORDER_STATUS.PICKED_UP]: 'bg-blue-100 text-blue-700',
      [ORDER_STATUS.IN_TRANSIT]: 'bg-purple-100 text-purple-700',
      [ORDER_STATUS.ARRIVED]: 'bg-cyan-100 text-cyan-700',
      [ORDER_STATUS.DELIVERED]: 'bg-success-100 text-success-700',
      [ORDER_STATUS.FAILED]: 'bg-orange-100 text-orange-700', // generic failed
      [ORDER_STATUS.RTO]: 'bg-warning-100 text-warning-700',
      [ORDER_STATUS.DELIVERY_FAILED_CUSTOMER_NOT_AVAILABLE]: 'bg-orange-100 text-orange-700',
      [ORDER_STATUS.RE_ATTEMPT_SCHEDULED]: 'bg-yellow-100 text-yellow-700',
      [ORDER_STATUS.RETURNED_TO_HUB]: 'bg-slate-200 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };
  const formatOrderStatus = (order) => {
    switch (order.status) {
      case ORDER_STATUS.DELIVERY_FAILED_CUSTOMER_NOT_AVAILABLE:
        return 'Delivery Failed – Customer Not Available';
      case ORDER_STATUS.RE_ATTEMPT_SCHEDULED:
        return 'Re-attempt Scheduled';
      case ORDER_STATUS.RETURNED_TO_HUB:
        return 'Returned to Hub';
      default:
        return order.status.replace(/_/g, ' ').toUpperCase();
    }
  };
  const handleScheduleReattempt = (order) => {
    if (!onUpdateOrder) return;
    const currentAttempts = order.attempts || 0;
    if (currentAttempts >= 2) {
      onUpdateOrder(order.orderId, {
        status: ORDER_STATUS.RETURNED_TO_HUB,
        attempts: currentAttempts,
        failureReason: order.failureReason || 'Customer not available',
      });
      setActiveActionOrderId(null);
      return;
    }
    const nextAttempts = currentAttempts + 1;
    const deliveryAttemptStatus = nextAttempts === 1 ? 'Re-attempt 1' : 'Re-attempt 2';
    onUpdateOrder(order.orderId, {
      status: ORDER_STATUS.RE_ATTEMPT_SCHEDULED,
      attempts: nextAttempts,
      deliveryAttemptStatus,
      failureReason: order.failureReason || 'Customer not available',
    });
    setActiveActionOrderId(null);
  };
  const handleMarkReturnedToHub = (order) => {
    if (!onUpdateOrder) return;
    const attempts = Math.max(order.attempts || 0, 2);
    onUpdateOrder(order.orderId, {
      status: ORDER_STATUS.RETURNED_TO_HUB,
      attempts,
      deliveryAttemptStatus: 'Returned to Hub',
      failureReason: order.failureReason || 'Customer not available',
    });
    setActiveActionOrderId(null);
  };
  const handleFile = (file) => {
    setCsvError('');
    setCsvPreview([]);
    setCsvFileName('');
    if (!file) return;
    const name = file.name.toLowerCase();
    const isCsv = name.endsWith('.csv');
    const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls');
    if (!isCsv && !isExcel) {
      setCsvError('Only .csv or .xlsx/.xls files are allowed.');
      return;
    }
    setCsvFileName(file.name);
    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvPreview(results.data || []);
        },
        error: (err) => {
          setCsvError(`Failed to parse CSV: ${err.message}`);
        },
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
        setCsvPreview(rows);
      } catch (err) {
        setCsvError(`Failed to parse Excel: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const handleAddOrder = () => {
    if (!onCreateOrders) return;
    if (csvPreview.length > 0 && !csvError) {
      handleCreateFromCsv();
      return;
    }
    if (manualOrder.customerName && manualOrder.deliveryAddress) {
      handleCreateSingleOrder();
    }
  };
  const getRowVal = (row, possibleKeys, fallback = '') => {
    if (!row || typeof row !== 'object') return fallback;
    const normalize = (s) => String(s).trim().toLowerCase().replace(/[\s_]/g, '');
    const rowKeys = Object.keys(row);
    for (const key of possibleKeys) {
      const n = normalize(key);
      const found = rowKeys.find((rk) => normalize(rk) === n);
      if (found != null) {
        const v = row[found];
        if (v !== '' && v != null && String(v).trim() !== '') return String(v).trim();
      }
    }
    return fallback;
  };
  const getRowNum = (row, possibleKeys, fallback = 0) => {
    const v = getRowVal(row, possibleKeys, null);
    if (v === null || v === '') return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const handleCreateFromCsv = () => {
    if (!onCreateOrders || !csvPreview.length) {
      closeNewOrderModal();
      return;
    }
    const now = new Date();
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const ts = Date.now();
    const newOrders = csvPreview.map((row, index) => ({
      orderId: getRowVal(row, ['orderId', 'ORDER ID', 'Order ID', 'order_id', 'Order Id', 'order_num', 'order number', 'Order Number']) || `ORD-${ts}-${index + 1}`,
      customerName: getRowVal(row, ['customerName', 'CUSTOMER', 'Customer', 'customer name', 'Customer Name', 'customer_name', 'customer']) || 'Customer',
      customerPhone: getRowVal(row, ['customerPhone', 'Customer Phone', 'phone', 'Phone', 'customer_phone', 'Contact']),
      deliveryAddress: getRowVal(row, ['deliveryAddress', 'Delivery Address', 'delivery address', 'address', 'Address', 'delivery_address', 'customer_address', 'customer address', 'Customer Address']),
      geolocation: (() => {
        const lat = getRowNum(row, ['latitude', 'lat', 'Latitude', 'Lat'], null);
        const lng = getRowNum(row, ['longitude', 'long', 'lng', 'Longitude', 'Lng'], null);
        if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
        return { lat: 40.7128, lng: -74.0060 };
      })(),
      status: ORDER_STATUS.PENDING,
      timeWindowStart: now.toISOString(),
      timeWindowEnd: twoHoursFromNow.toISOString(),
      packageWeight: getRowNum(row, ['packageWeight', 'Package Weight', 'package weight', 'package_v', 'package weight (kg)', 'weight'], 1),
      volumetricWeight: getRowNum(row, ['volumetricWeight', 'Volumetric Weight', 'volumetric weight', 'package_v'], 1),
      serviceType: getRowVal(row, ['serviceType', 'Service Type', 'service type'], 'standard'),
      skillRequirement: getRowVal(row, ['skillRequirement', 'Skill Requirement'], 'none'),
      proofOfDelivery: null,
      codAmount: getRowNum(row, ['codAmount', 'COD', 'cod', 'COD Amount', 'cod amount'], 0),
      deliveryCost: getRowNum(row, ['deliveryCost', 'Delivery Cost', 'delivery cost'], 0),
      hubId: getRowVal(row, ['hubId', 'Hub ID', 'hub_id'], 'HUB-NYC-01'),
      driverPayout: getRowNum(row, ['driverPayout', 'Driver Payout', 'driver payout'], 0),
      assignedDriver: null,
      assignedRoute: getRowVal(row, ['assignedRoute', 'Assigned Route', 'route'], null) || null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      priority: getRowVal(row, ['priority', 'Priority'], 'normal'),
      attempts: 0,
    }));
    const completedStatuses = [
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.FAILED,
      ORDER_STATUS.RTO,
      ORDER_STATUS.ARRIVED,
    ];
    const previousDayOrders = (orders || []).filter((o) => completedStatuses.includes(o.status));
    const { assignedOrders, totalDrivers, activeDrivers: activeCount } = planFairAssignments({
      previousDayOrders,
      todayOrders: newOrders,
      drivers: drivers || [],
      options: {
        hubLat: 11.0168,
        hubLng: 76.9558,
        clusterByArea: true,
      },
    });
    onCreateOrders(assignedOrders);
    closeNewOrderModal();
    setManualOrder({
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      codAmount: '',
      serviceType: 'standard',
    });
  };
  const handleCreateSingleOrder = () => {
    if (!onCreateOrders) return;
    if (!manualOrder.customerName || !manualOrder.deliveryAddress) return;
    const now = new Date();
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const newOrder = {
      orderId: `ORD-${now.getTime()}`,
      customerName: manualOrder.customerName,
      customerPhone: manualOrder.customerPhone,
      deliveryAddress: manualOrder.deliveryAddress,
      geolocation: { lat: 40.7128, lng: -74.0060 },
      status: ORDER_STATUS.PENDING,
      timeWindowStart: now.toISOString(),
      timeWindowEnd: twoHoursFromNow.toISOString(),
      packageWeight: 1,
      volumetricWeight: 1,
      serviceType: manualOrder.serviceType,
      skillRequirement: 'none',
      proofOfDelivery: null,
      codAmount: Number(manualOrder.codAmount || 0),
      deliveryCost: 0,
      hubId: 'HUB-NYC-01',
      driverPayout: 0,
      assignedDriver: null,
      assignedRoute: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      priority: 'normal',
      attempts: 0,
    };
    onCreateOrders([newOrder]);
    setManualOrder({
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      codAmount: '',
      serviceType: 'standard',
    });
    closeNewOrderModal();
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Management</CardTitle>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasPermission('canUploadOrders') && (
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Order
                </button>
              )}
              <button
                type="button"
                onClick={handleExportAssignedOrders}
                disabled={!sortedOrders.some((o) => o.assignedDriver)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export assigned (CSV)
              </button>
            </div>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by Order ID, Customer, Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Status</option>
              <option value={ORDER_STATUS.PENDING}>Pending</option>
              <option value={ORDER_STATUS.ASSIGNED}>Assigned</option>
              <option value={ORDER_STATUS.IN_TRANSIT}>In Transit</option>
              <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
              <option value={ORDER_STATUS.FAILED}>Failed</option>
              <option value={ORDER_STATUS.RE_ATTEMPT_SCHEDULED}>Re-attempt Scheduled</option>
              <option value={ORDER_STATUS.RETURNED_TO_HUB}>Returned to Hub</option>
            </Select>
            <Select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Services</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="same_day">Same Day</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1F4FD8] border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading orders…</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No orders yet"
              description="Upload a CSV/Excel file or add a single order to get started"
            />
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('orderId')}
                    >
                      Order ID <SortIcon column="orderId" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('customerName')}
                    >
                      Customer <SortIcon column="customerName" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('deliveryAddress')}
                    >
                      Address <SortIcon column="deliveryAddress" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('status')}
                    >
                      Status <SortIcon column="status" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      SLA
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('serviceType')}
                    >
                      Service <SortIcon column="serviceType" />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('assignedDriver')}
                    >
                      Driver <SortIcon column="assignedDriver" />
                    </th>
                    {hasFinancialAccess && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          COD
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                          Payment Status
                        </th>
                      </>
                    )}
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      Created <SortIcon column="createdAt" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedOrders.map((order) => {
                    const paymentStatus = getPaymentStatus(order);
                    const driverInfo = driverCodInfo[order.assignedDriver];
                    const codLimitReached =
                      driverInfo && driverInfo.limitReached && isCODOrder(order);
                    const isClosed =
                      order.status === ORDER_STATUS.DELIVERED ||
                      order.status === ORDER_STATUS.RETURNED_TO_HUB;
                    return (
                      <tr
                        key={order.orderId}
                        onClick={() => onOrderSelect && onOrderSelect(order)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono font-semibold text-slate-900">
                            {order.orderId}
                          </span>
                          {order.priority === 'urgent' && (
                            <AlertTriangle className="w-3 h-3 text-danger-600 inline ml-1" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium text-slate-900">{order.customerName}</div>
                            <div className="text-slate-500 text-xs">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="text-sm text-slate-700 min-w-[200px] max-w-[380px] break-words whitespace-normal"
                            title={getOrderAddress(order) || undefined}
                          >
                            {getOrderAddress(order) || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex px-2 py-1 rounded-md text-xs font-medium',
                              getStatusColor(order.status)
                            )}
                          >
                            {formatOrderStatus(order)}
                          </span>
                        </td>
                        <td className="px-4 py-3">{getSLABadge(order)}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-600 capitalize">
                            {order.serviceType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">
                              {order.assignedDriver || (
                                <span className="text-slate-400">Unassigned</span>
                              )}
                            </span>
                            {codLimitReached && (
                              <Badge
                                variant="warning"
                                className="text-[10px] uppercase tracking-wide"
                                dot
                                title="Driver COD balance exceeds configured limit. No new COD orders can be assigned until cash is deposited at the hub."
                              >
                                COD Limit Reached
                              </Badge>
                            )}
                          </div>
                        </td>
                        {hasFinancialAccess && (
                          <>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-slate-900">
                                ₹{order.codAmount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={cn(
                                    'inline-flex px-2 py-1 rounded-md text-[11px] font-medium',
                                    getPaymentStatusClasses(paymentStatus)
                                  )}
                                >
                                  {paymentStatus}
                                </span>
                              </div>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-500">
                            {formatRelativeTime(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 relative">
                          {!isClosed && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionOrderId((current) =>
                                  current === order.orderId ? null : order.orderId
                                );
                              }}
                              className="p-2 rounded-md transition-colors !bg-transparent border-none shadow-none"
                              style={{ color: '#64748b' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#0f172a';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#64748b';
                              }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                          {activeActionOrderId === order.orderId && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-10 border border-slate-200 overflow-hidden" style={{ background: '#ffffff' }}>
                              <div className="py-1" style={{ background: '#ffffff' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleScheduleReattempt(order);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs text-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ background: '#ffffff' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                                  disabled={order.attempts >= 2}
                                >
                                  Schedule Re-attempt
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkReturnedToHub(order);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs flex items-center gap-2"
                                  style={{ background: '#ffffff', color: '#0f172a' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#0f172a'; }}
                                >
                                  Mark as Returned to Hub
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* New Order + CSV Upload Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">New Orders Intake</h2>
                <p className="text-xs text-slate-500">
                  Enter details for a single order below, or upload a CSV or Excel file for bulk orders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowNewOrderModal(false);
                  setCsvPreview([]);
                  setCsvError('');
                  setCsvFileName('');
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Helper text */}
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                For bulk upload, use <span className="font-mono font-semibold">.csv</span> or{' '}
                <span className="font-mono font-semibold">.xlsx</span> with headers like{' '}
                <span className="font-mono">
                  orderId, customerName, customerPhone, deliveryAddress, codAmount, serviceType
                </span>
                . Orders are <strong>automatically assigned</strong> across all active drivers (total drivers calculated; only active, non–on-leave drivers receive tasks).
              </div>
              {/* Single order form */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Single order – enter details
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="Customer name"
                    value={manualOrder.customerName}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Customer phone"
                    value={manualOrder.customerPhone}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, customerPhone: e.target.value }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Delivery address"
                    className="md:col-span-2"
                    value={manualOrder.deliveryAddress}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, deliveryAddress: e.target.value }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="COD amount (optional)"
                    value={manualOrder.codAmount}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, codAmount: e.target.value }))
                    }
                  />
                  <Select
                    value={manualOrder.serviceType}
                    onChange={(e) =>
                      setManualOrder((prev) => ({ ...prev, serviceType: e.target.value }))
                    }
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="same_day">Same Day</option>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 border-t border-slate-200" />
                <span className="text-sm font-medium text-slate-500">or</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>
              {/* Bulk upload: CSV or Excel */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Bulk orders – upload CSV or Excel
                </label>
                <div
                  className="border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 text-center cursor-pointer hover:border-primary-400 hover:bg-slate-50 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                  onClick={() => {
                    const input = document.getElementById('order-file-input');
                    if (input) input.click();
                  }}
                >
                  <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    Drag and drop a <span className="font-mono">.csv</span> or <span className="font-mono">.xlsx</span> file here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500 mt-1">.csv and .xlsx files are accepted</p>
                  {csvFileName && (
                    <p className="text-xs text-slate-600 mt-2">
                      Selected file:{' '}
                      <span className="font-mono font-semibold text-slate-800">{csvFileName}</span>
                    </p>
                  )}
                  <input
                    id="order-file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>
                {csvError && <p className="mt-2 text-xs text-danger-600">{csvError}</p>}
              </div>
              {/* CSV Preview */}
              {csvPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Preview</p>
                    <p className="text-xs text-slate-500">
                      Showing first {Math.min(csvPreview.length, 5)} of {csvPreview.length} rows
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            {Object.keys(csvPreview[0] || {}).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 text-left font-semibold text-slate-700 uppercase"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.slice(0, 5).map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-100">
                              {Object.keys(csvPreview[0] || {}).map((key) => (
                                <td key={key} className="px-3 py-1 text-slate-700">
                                  {row[key]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                COD orders from file will respect driver COD limits and will not count toward driver
                balances once returned to hub.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeNewOrderModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    !(manualOrder.customerName && manualOrder.deliveryAddress) &&
                    !(csvPreview.length > 0 && !csvError)
                  }
                  onClick={handleAddOrder}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}