import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Bell, Shield, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Ngabirano Derrick',
    email: 'derrickngabirano1@gmai;.com@example.com',
    phone: '0754239020',
    company: 'Makyene Properties',
    address: 'Andrews Cell, Mbarara City North',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    rentReminders: true,
    leaseExpiry: true,
    maintenanceAlerts: true,
    paymentConfirmations: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '1',
    passwordExpiry: '10',
  });

  const handleProfileSave = () => {
    toast.success('Profile updated successfully');
  };

  const handleNotificationSave = () => {
    toast.success('Notification preferences updated');
  };

  const handleSecuritySave = () => {
    toast.success('Security settings updated');
  };

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      profile,
      notifications,
      security,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rental-system-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleProfileSave}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, smsNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rentReminders">Rent Payment Reminders</Label>
                <p className="text-sm text-gray-500">Notify about upcoming rent payments</p>
              </div>
              <Switch
                id="rentReminders"
                checked={notifications.rentReminders}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, rentReminders: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="leaseExpiry">Lease Expiry Alerts</Label>
                <p className="text-sm text-gray-500">Notify about expiring leases</p>
              </div>
              <Switch
                id="leaseExpiry"
                checked={notifications.leaseExpiry}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, leaseExpiry: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceAlerts">Maintenance Alerts</Label>
                <p className="text-sm text-gray-500">Notify about maintenance requests</p>
              </div>
              <Switch
                id="maintenanceAlerts"
                checked={notifications.maintenanceAlerts}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, maintenanceAlerts: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="paymentConfirmations">Payment Confirmations</Label>
                <p className="text-sm text-gray-500">Notify about received payments</p>
              </div>
              <Switch
                id="paymentConfirmations"
                checked={notifications.paymentConfirmations}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, paymentConfirmations: checked })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleNotificationSave}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) => 
                  setSecurity({ ...security, twoFactorAuth: checked })
                }
              />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={security.passwordExpiry}
                  onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSecuritySave}>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-gray-500">Download all your data as JSON</p>
              </div>
              <Button onClick={exportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Import Data</Label>
                <p className="text-sm text-gray-500">Import data from backup file</p>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-600">Reset All Data</Label>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
              <Button variant="destructive">
                Reset Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}