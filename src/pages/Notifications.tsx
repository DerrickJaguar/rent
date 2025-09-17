import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { Notification, Tenant, Property } from '@/types';
import { storage, generateId } from '@/lib/storage';
import { format, differenceInDays, addDays } from 'date-fns';
import { toast } from 'sonner';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadNotifications();
    setTenants(storage.getTenants());
    setProperties(storage.getProperties());
  }, []);

  const loadNotifications = () => {
    const stored = storage.getNotifications();
    const generated = generateSystemNotifications();
    const allNotifications = [...stored, ...generated].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotifications(allNotifications);
  };

  const generateSystemNotifications = (): Notification[] => {
    const systemNotifications: Notification[] = [];
    const today = new Date();
    const tenants = storage.getTenants();
    const payments = storage.getPayments();

    // Generate rent due notifications
    tenants.filter(t => t.isActive).forEach(tenant => {
      const nextDue = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const daysUntilDue = differenceInDays(nextDue, today);
      
      if (daysUntilDue <= 7 && daysUntilDue >= 0) {
        systemNotifications.push({
          id: `rent-due-${tenant.id}`,
          type: 'rent_due',
          title: 'Rent Due Soon',
          message: `Rent payment for ${tenant.fullName} is due in ${daysUntilDue} days`,
          isRead: false,
          recipientId: 'landlord',
          createdAt: today,
        });
      }
    });

    // Generate lease expiry notifications
    tenants.filter(t => t.isActive).forEach(tenant => {
      const expiryDate = new Date(tenant.leaseEndDate);
      const daysUntilExpiry = differenceInDays(expiryDate, today);
      
      if (daysUntilExpiry <= 60 && daysUntilExpiry >= 0) {
        systemNotifications.push({
          id: `lease-expiry-${tenant.id}`,
          type: 'lease_expiry',
          title: 'Lease Expiring Soon',
          message: `Lease for ${tenant.fullName} expires in ${daysUntilExpiry} days`,
          isRead: false,
          recipientId: 'landlord',
          createdAt: today,
        });
      }
    });

    // Generate overdue payment notifications
    payments.filter(p => p.status === 'overdue').forEach(payment => {
      const tenant = tenants.find(t => t.id === payment.tenantId);
      if (tenant) {
        systemNotifications.push({
          id: `overdue-${payment.id}`,
          type: 'overdue_payment',
          title: 'Overdue Payment',
          message: `Payment of $${payment.amount.toLocaleString()} from ${tenant.fullName} is overdue`,
          isRead: false,
          recipientId: 'landlord',
          createdAt: new Date(payment.dueDate),
        });
      }
    });

    return systemNotifications;
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Only save non-system notifications to storage
    const userNotifications = updatedNotifications.filter(n => 
      !n.id.startsWith('rent-due-') && 
      !n.id.startsWith('lease-expiry-') && 
      !n.id.startsWith('overdue-')
    );
    storage.saveNotifications(userNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      isRead: true 
    }));
    setNotifications(updatedNotifications);
    
    const userNotifications = updatedNotifications.filter(n => 
      !n.id.startsWith('rent-due-') && 
      !n.id.startsWith('lease-expiry-') && 
      !n.id.startsWith('overdue-')
    );
    storage.saveNotifications(userNotifications);
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    
    const userNotifications = updatedNotifications.filter(n => 
      !n.id.startsWith('rent-due-') && 
      !n.id.startsWith('lease-expiry-') && 
      !n.id.startsWith('overdue-')
    );
    storage.saveNotifications(userNotifications);
    toast.success('Notification deleted');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'rent_due':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'lease_expiry':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'overdue_payment':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'maintenance':
        return <Info className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'rent_due':
        return 'border-l-blue-600';
      case 'lease_expiry':
        return 'border-l-orange-600';
      case 'overdue_payment':
        return 'border-l-red-600';
      case 'maintenance':
        return 'border-l-purple-600';
      default:
        return 'border-l-gray-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with important reminders and alerts
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="secondary">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notification Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { type: 'rent_due', label: 'Rent Due', color: 'text-blue-600' },
          { type: 'lease_expiry', label: 'Lease Expiry', color: 'text-orange-600' },
          { type: 'overdue_payment', label: 'Overdue', color: 'text-red-600' },
          { type: 'general', label: 'General', color: 'text-gray-600' },
        ].map(category => {
          const count = notifications.filter(n => n.type === category.type && !n.isRead).length;
          return (
            <Card key={category.type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{category.label}</p>
                    <p className={`text-2xl font-bold ${category.color}`}>{count}</p>
                  </div>
                  {getNotificationIcon(category.type as Notification['type'])}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} ${
                    notification.isRead ? 'bg-gray-50' : 'bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy at h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}