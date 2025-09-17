import { Property, Tenant, Payment, User, Notification } from '@/types';

// Mock data storage using localStorage
const STORAGE_KEYS = {
  PROPERTIES: 'rental_properties',
  TENANTS: 'rental_tenants',
  PAYMENTS: 'rental_payments',
  USER: 'rental_user',
  NOTIFICATIONS: 'rental_notifications',
};

// Initialize with sample data if empty
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    const sampleProperties: Property[] = [
      {
        id: '1',
        address: 'Andrews St, Kakiika Mbarara',
        type: 'apartment',
        rentAmount: 250,
        isAvailable: false,
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 900,
        description: 'Beautiful 2-bedroom apartment in downtown',
        images: [],
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: '2',
        address: '456 Oak Ave, Brooklyn, NY 11201',
        type: 'house',
        rentAmount: 3500,
        isAvailable: true,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        description: 'Spacious house with garden',
        images: [],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(sampleProperties));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TENANTS)) {
    const sampleTenants: Tenant[] = [
      {
        id: '1',
        fullName: 'Mutamba Sheenah',
        email: 'sheenamutamba@email.com',
        phone: '0791111665',
        propertyId: '1',
        leaseStartDate: new Date('2025-07-03'),
        leaseEndDate: new Date('2025-09-03'),
        rentAmount: 60,
        securityDeposit: 30,
        isActive: true,
        emergencyContact: {
          name: 'Jane Smith',
          phone: '(555) 987-6543',
          relationship: 'Spouse',
        },
        createdAt: new Date('2025-07-03'),
        updatedAt: new Date('2025-08-25'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(sampleTenants));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    const samplePayments: Payment[] = [
      {
        id: '1',
        tenantId: '1',
        propertyId: '1',
        amount: 2500,
        paymentDate: new Date('2024-08-01'),
        dueDate: new Date('2024-08-01'),
        paymentMethod: 'bank_transfer',
        status: 'paid',
        receiptNumber: 'RCP-001',
        createdAt: new Date('2024-08-01'),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(samplePayments));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const user: User = {
      id: '1',
      email: 'landlord@example.com',
      name: 'Ngabirano Derrick',
      role: 'landlord',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

// Storage utilities
export const storage = {
  getProperties: (): Property[] => {
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return data ? JSON.parse(data).map((p: Property) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    })) : [];
  },

  saveProperties: (properties: Property[]) => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  },

  getTenants: (): Tenant[] => {
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.TENANTS);
    return data ? JSON.parse(data).map((t: Tenant) => ({
      ...t,
      leaseStartDate: new Date(t.leaseStartDate),
      leaseEndDate: new Date(t.leaseEndDate),
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    })) : [];
  },

  saveTenants: (tenants: Tenant[]) => {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  },

  getPayments: (): Payment[] => {
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data).map((p: Payment) => ({
      ...p,
      paymentDate: new Date(p.paymentDate),
      dueDate: new Date(p.dueDate),
      createdAt: new Date(p.createdAt),
    })) : [];
  },

  savePayments: (payments: Payment[]) => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getUser: (): User | null => {
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? {
      ...JSON.parse(data),
      createdAt: new Date(JSON.parse(data).createdAt),
    } : null;
  },

  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};