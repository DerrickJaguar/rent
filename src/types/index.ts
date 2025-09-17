export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  
  squareFootage: Float32Array;
  type: 'apartment' | 'house' | 'commercial';
  rentAmount: number;
  isAvailable: boolean;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  firstName: string,
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  securityDeposit: number;
  emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    },
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: true;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'online' | 'credit_card';
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  notes?: string;
  receiptNumber: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'landlord' | 'manager' | 'assistant';
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'rent_due' | 'lease_expiry' | 'overdue_payment' | 'maintenance' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  recipientId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  type: 'income' | 'occupancy' | 'tenant' | 'property';
  period: 'monthly' | 'quarterly' | 'yearly';
  data: Record<string, unknown>;
  generatedAt: Date;
}