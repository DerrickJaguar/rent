import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tenant, Property } from '@/types';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyId: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentAmount: 0,
    securityDeposit: 0,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    notes: '',
  });

  useEffect(() => {
    loadTenants();
    loadProperties();
  }, []);

  useEffect(() => {
    const filtered = tenants.filter(tenant =>
      tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(filtered);
  }, [tenants, searchTerm]);

  const loadTenants = () => {
    const data = storage.getTenants();
    setTenants(data);
  };

  const loadProperties = () => {
    const data = storage.getProperties();
    setProperties(data);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyId: '',
      leaseStartDate: '',
      leaseEndDate: '',
      rentAmount: 0,
      securityDeposit: 0,
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      notes: '',
    });
    setEditingTenant(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.propertyId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingTenant) {
      // Update existing tenant
      const updatedTenant: Tenant = {
        ...editingTenant,

        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        propertyId: formData.propertyId,
        leaseStartDate: new Date(formData.leaseStartDate),
        leaseEndDate: new Date(formData.leaseEndDate),
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        emergencyContact: formData.emergencyContact,
        notes: formData.notes,
        updatedAt: new Date(),
      };

      const updatedTenants = tenants.map(t => 
        t.id === editingTenant.id ? updatedTenant : t
      );
      
      storage.saveTenants(updatedTenants);
      setTenants(updatedTenants);

      // Update property status if property changed
      if (editingTenant.propertyId !== formData.propertyId) {
        updatePropertyStatuses(editingTenant.propertyId, formData.propertyId);
      }

      toast.success('Tenant updated successfully');
    } else {
      // Add new tenant
      const newTenant: Tenant = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        propertyId: formData.propertyId,
        leaseStartDate: new Date(formData.leaseStartDate),
        leaseEndDate: new Date(formData.leaseEndDate),
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        emergencyContact: formData.emergencyContact,
        notes: formData.notes,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTenants = [...tenants, newTenant];
      storage.saveTenants(updatedTenants);
      setTenants(updatedTenants);

      // Update property status to occupied
      updatePropertyStatuses(null, formData.propertyId);
      
      toast.success('Tenant added successfully');
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const updatePropertyStatuses = (oldPropertyId: string | null, newPropertyId: string) => {
    const updatedProperties = properties.map(property => {
      if (oldPropertyId && property.id === oldPropertyId) {
        return { ...property, status: 'available' as const, tenantId: null };
      }
      if (property.id === newPropertyId) {
        return { ...property, status: 'occupied' as const, tenantId: newPropertyId };
      }
      return property;
    });

    storage.saveProperties(updatedProperties);
    setProperties(updatedProperties);
  };

  const handleEdit = (tenant: Tenant) => {
    setFormData({
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      propertyId: tenant.propertyId,
      leaseStartDate: format(tenant.leaseStartDate, 'yyyy-MM-dd'),
      leaseEndDate: format(tenant.leaseEndDate, 'yyyy-MM-dd'),
      rentAmount: tenant.rentAmount,
      securityDeposit: tenant.securityDeposit,
      emergencyContact: tenant.emergencyContact,
      notes: tenant.notes,
    });
    setEditingTenant(tenant);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
        // Update property status to available
        updatePropertyStatuses(tenant.propertyId, '');
      }

      const updatedTenants = tenants.filter(t => t.id !== tenantId);
      storage.saveTenants(updatedTenants);
      setTenants(updatedTenants);
      toast.success('Tenant deleted successfully');
    }
  };

  const getPropertyAddress = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? `${property.address}, ${property.city}` : 'Unknown Property';
  };

  const getLeaseStatus = (tenant: Tenant) => {
    const today = new Date();
    const leaseEnd = tenant.leaseEndDate;
    const daysDiff = Math.ceil((leaseEnd.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-800' };
    } else if (daysDiff <= 60) {
      return { status: 'expiring soon', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'active', color: 'bg-green-100 text-green-800' };
    }
  };

  const availableProperties = properties.filter(p => p.status === 'available' || p.id === editingTenant?.propertyId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
              <DialogDescription>
                {editingTenant ? 'Update the tenant information below.' : 'Enter the tenant details below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="propertyId">Property *</Label>
                  <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.address}, {property.city} - ${property.rentAmount}/month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="leaseStartDate">Lease Start Date</Label>
                    <Input
                      id="leaseStartDate"
                      type="date"
                      value={formData.leaseStartDate}
                      onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="leaseEndDate">Lease End Date</Label>
                    <Input
                      id="leaseEndDate"
                      type="date"
                      value={formData.leaseEndDate}
                      onChange={(e) => setFormData({ ...formData, leaseEndDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rentAmount">Monthly Rent</Label>
                    <Input
                      id="rentAmount"
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Contact Name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value } 
                      })}
                    />
                    <Input
                      placeholder="Contact Phone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value } 
                      })}
                    />
                  </div>
                  <Input
                    placeholder="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } 
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTenant ? 'Update Tenant' : 'Add Tenant'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => {
          const leaseStatus = getLeaseStatus(tenant);
          return (
            <Card key={tenant.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {tenant.firstName} {tenant.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {tenant.email}
                    </CardDescription>
                  </div>
                  <Badge className={leaseStatus.color}>
                    {leaseStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenant.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{tenant.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Home className="mr-2 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{getPropertyAddress(tenant.propertyId)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                  <span>Lease: {format(tenant.leaseStartDate, 'MMM dd, yyyy')} - {format(tenant.leaseEndDate, 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-semibold text-green-600">${tenant.rentAmount.toLocaleString()}</span>
                </div>

                {tenant.securityDeposit > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Security Deposit:</span>
                    <span className="font-medium">${tenant.securityDeposit.toLocaleString()}</span>
                  </div>
                )}

                {tenant.emergencyContact?.name && (
                  <div className="text-sm border-t pt-2">
                    <span className="text-muted-foreground text-xs">Emergency Contact:</span>
                    <div className="text-xs">{tenant.emergencyContact.name} ({tenant.emergencyContact.relationship})</div>
                    {tenant.emergencyContact.phone && (
                      <div className="text-xs text-muted-foreground">{tenant.emergencyContact.phone}</div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tenant)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tenant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tenants found.</p>
        </div>
      )}
    </div>
  );
}