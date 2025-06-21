
import { v4 as uuidv4 } from 'uuid';
import { Estimate, EstimateItem, Client } from '@/types';

// Generate unique ID
export const generateId = (): string => {
  return uuidv4();
};

// Generate a formatted estimate number (EST-YYYYMMDD-XXXX)
export const generateEstimateNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `EST-${year}${month}${day}-${random}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate subtotal
export const calculateSubTotal = (items: EstimateItem[]): number => {
  return items.reduce((total, item) => total + item.quantity * item.rate, 0);
};

// Calculate tax amount
export const calculateTaxAmount = (items: EstimateItem[]): number => {
  return items.reduce((total, item) => {
    const itemAmount = item.quantity * item.rate;
    const taxAmount = (itemAmount * item.tax) / 100;
    return total + taxAmount;
  }, 0);
};

// Calculate total amount
export const calculateTotal = (
  subTotal: number,
  taxAmount: number,
  discount: number
): number => {
  return subTotal + taxAmount - discount;
};

// Get appropriate color for status
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'estimate-pending';
    case 'approved':
      return 'estimate-approved';
    case 'converted':
      return 'estimate-converted';
    case 'cancelled':
      return 'estimate-cancelled';
    default:
      return 'estimate-pending';
  }
};

// Save data to local storage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Get data from local storage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) as T : defaultValue;
};

// Save estimate to local storage
export const saveEstimate = (estimate: Estimate): void => {
  const estimates = getFromLocalStorage<Estimate[]>('estimates', []);
  
  // Check if estimate exists, if so update it, otherwise add it
  const index = estimates.findIndex(e => e.id === estimate.id);
  
  if (index !== -1) {
    estimates[index] = estimate;
  } else {
    estimates.push(estimate);
  }
  
  saveToLocalStorage('estimates', estimates);
};

// Save client to local storage
export const saveClient = (client: Client): void => {
  const clients = getFromLocalStorage<Client[]>('clients', []);
  
  // Check if client exists, if so update it, otherwise add it
  const index = clients.findIndex(c => c.id === client.id);
  
  if (index !== -1) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  
  saveToLocalStorage('clients', clients);
};

// Get all estimates from local storage
export const getAllEstimates = (): Estimate[] => {
  return getFromLocalStorage<Estimate[]>('estimates', []);
};

// Get all clients from local storage
export const getAllClients = (): Client[] => {
  return getFromLocalStorage<Client[]>('clients', []);
};

// Get estimate by ID
export const getEstimateById = (id: string): Estimate | undefined => {
  const estimates = getAllEstimates();
  return estimates.find(estimate => estimate.id === id);
};

// Get client by ID
export const getClientById = (id: string): Client | undefined => {
  const clients = getAllClients();
  return clients.find(client => client.id === id);
};

// Delete estimate by ID
export const deleteEstimate = (id: string): void => {
  const estimates = getAllEstimates();
  const filteredEstimates = estimates.filter(estimate => estimate.id !== id);
  saveToLocalStorage('estimates', filteredEstimates);
};

// Delete client by ID
export const deleteClient = (id: string): void => {
  const clients = getAllClients();
  const filteredClients = clients.filter(client => client.id !== id);
  saveToLocalStorage('clients', filteredClients);
};

// Convert base64 to file
export const base64ToFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

// Filter estimates by status
export const filterEstimatesByStatus = (estimates: Estimate[], status: string): Estimate[] => {
  if (status === 'all') return estimates;
  return estimates.filter(estimate => estimate.status.toLowerCase() === status.toLowerCase());
};

// Filter estimates by client
export const filterEstimatesByClient = (estimates: Estimate[], clientId: string): Estimate[] => {
  if (!clientId) return estimates;
  return estimates.filter(estimate => estimate.client.id === clientId);
};

// Filter estimates by date range
export const filterEstimatesByDateRange = (
  estimates: Estimate[],
  startDate: string,
  endDate: string
): Estimate[] => {
  if (!startDate || !endDate) return estimates;
  
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return estimates.filter(estimate => {
    const estimateDate = new Date(estimate.date).getTime();
    return estimateDate >= start && estimateDate <= end;
  });
};

// Sort estimates by date (newest first)
export const sortEstimatesByDate = (estimates: Estimate[]): Estimate[] => {
  return [...estimates].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Export estimates to CSV
export const exportEstimatesToCSV = (estimates: Estimate[]): void => {
  const header = [
    'Estimate Number',
    'Client Name',
    'Date',
    'Due Date',
    'Total',
    'Status',
  ];
  
  const rows = estimates.map(estimate => [
    estimate.estimateNumber,
    estimate.client.name,
    estimate.date,
    estimate.dueDate,
    estimate.total.toString(),
    estimate.status,
  ]);
  
  const csvContent = 
    [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `estimates-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Create a sample client for testing
export const createSampleClient = (): Client => {
  return {
    id: generateId(),
    name: 'Sample Client',
    email: 'client@example.com',
    phone: '9876543210',
    address: '123 Main Street, Mumbai, India',
    gstNumber: 'GST12345678',
    createdAt: new Date().toISOString(),
  };
};

// Create a sample estimate item for testing
export const createSampleEstimateItem = (): EstimateItem => {
  return {
    id: generateId(),
    description: 'Web Design Services',
    quantity: 1,
    rate: 10000,
    tax: 18,
    amount: 10000,
  };
};

// Create a sample estimate for testing
export const createSampleEstimate = (client: Client): Estimate => {
  const items = [createSampleEstimateItem()];
  const subTotal = calculateSubTotal(items);
  const tax = calculateTaxAmount(items);
  const discount = 0;
  const total = calculateTotal(subTotal, tax, discount);
  
  return {
    id: generateId(),
    estimateNumber: generateEstimateNumber(),
    client,
    items,
    subTotal,
    tax,
    discount,
    total,
    status: 'pending',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    terms: 'Payment due within 7 days of receipt.',
    notes: 'Thank you for your business!',
    createdAt: new Date().toISOString(),
  };
};
