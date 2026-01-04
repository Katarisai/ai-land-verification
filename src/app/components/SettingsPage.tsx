import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Save, Bell, Shield, Palette, Clock } from 'lucide-react';
import { User as UserType } from '../App';

interface Setting {
  id: string;
  category: string;
  key: string;
  label: string;
  value: any;
  type: 'boolean' | 'string' | 'number' | 'select';
  options?: string[];
  description?: string;
}

interface SettingsPageProps {
  user: UserType;
  onLogout: () => void;
  onBack: () => void;
  onToggleAI: () => void;
}

export function SettingsPage({ user, onLogout, onBack, onToggleAI }: SettingsPageProps) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Mock settings data - replace with actual API call
      const mockSettings: Setting[] = [
        // General Settings
        {
          id: '1',
          category: 'general',
          key: 'defaultWorkStartTime',
          label: 'Default Work Start Time',
          value: '09:00',
          type: 'string',
          description: 'Default start time for work schedules'
        },
        {
          id: '2',
          category: 'general',
          key: 'defaultWorkEndTime',
          label: 'Default Work End Time',
          value: '17:00',
          type: 'string',
          description: 'Default end time for work schedules'
        },

        // Notifications
        {
          id: '3',
          category: 'notifications',
          key: 'emailNotifications',
          label: 'Email Notifications',
          value: true,
          type: 'boolean',
          description: 'Receive email notifications for important updates'
        },
        {
          id: '4',
          category: 'notifications',
          key: 'projectDeadlineAlerts',
          label: 'Project Deadline Alerts',
          value: true,
          type: 'boolean',
          description: 'Get notified about upcoming project deadlines'
        },
        {
          id: '5',
          category: 'notifications',
          key: 'dailyReportReminders',
          label: 'Daily Report Reminders',
          value: false,
          type: 'boolean',
          description: 'Remind workers to submit daily reports'
        },
        {
          id: '6',
          category: 'notifications',
          key: 'materialStockAlerts',
          label: 'Material Stock Alerts',
          value: true,
          type: 'boolean',
          description: 'Alert when materials are running low'
        },

        // Security
        {
          id: '7',
          category: 'security',
          key: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          value: 30,
          type: 'number',
          description: 'Auto-logout after inactivity'
        },
        {
          id: '8',
          category: 'security',
          key: 'minPasswordLength',
          label: 'Minimum Password Length',
          value: 8,
          type: 'number',
          description: 'Minimum characters required for passwords'
        },
        {
          id: '9',
          category: 'security',
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          value: false,
          type: 'boolean',
          description: 'Enable 2FA for enhanced security'
        },

        // Appearance
        {
          id: '10',
          category: 'appearance',
          key: 'theme',
          label: 'Theme',
          value: 'light',
          type: 'select',
          options: ['light', 'dark', 'auto'],
          description: 'Choose your preferred theme'
        },
        {
          id: '11',
          category: 'appearance',
          key: 'language',
          label: 'Language',
          value: 'en',
          type: 'select',
          options: ['en', 'es', 'fr', 'de'],
          description: 'Select your language'
        },
        {
          id: '12',
          category: 'appearance',
          key: 'dateFormat',
          label: 'Date Format',
          value: 'MM/DD/YYYY',
          type: 'select',
          options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
          description: 'Choose how dates are displayed'
        }
      ];
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(settings.map(setting =>
      setting.id === settingId ? { ...setting, value } : setting
    ));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Mock save operation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
          />
        );
      case 'string':
        return (
          <Input
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="max-w-xs"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
            className="max-w-xs"
          />
        );
      case 'select':
        return (
          <Select value={setting.value} onValueChange={(value) => handleSettingChange(setting.id, value)}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Settings className="w-5 h-5" />;
      case 'notifications': return <Bell className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'appearance': return <Palette className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'general': return 'General';
      case 'notifications': return 'Notifications';
      case 'security': return 'Security';
      case 'appearance': return 'Appearance';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  const categories = ['general', 'notifications', 'security', 'appearance'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <span className="text-xl font-bold">Construction Manager</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div>{user.name}</div>
                <div className="text-gray-500 text-xs capitalize">{user.role}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Configure your application preferences</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categorySettings = getSettingsByCategory(category);
            if (categorySettings.length === 0) return null;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900">
                          {setting.label}
                        </Label>
                        {setting.description && (
                          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {renderSettingInput(setting)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Save Button at Bottom */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
