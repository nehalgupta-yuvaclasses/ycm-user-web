export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserSettings {
  language: string;
  notifications: NotificationPreferences;
}

export interface SettingsProfile {
  id: string;
  name: string;
  email: string;
  settings: UserSettings;
  rawSettings: Record<string, unknown>;
}
