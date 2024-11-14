import React, { useState , useEffect } from 'react';
import axios from 'axios';
const DrcSettingsPage = () =>{
  const [settings, setSettings] = useState({
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
    accountPreferences: {
      preferredLanguage: 'English',
      timeZone: 'UTC',
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const localSettings = JSON.parse(localStorage.getItem('settings')) || {};

        setSettings({
          notificationPreferences: localSettings.notificationPreferences || {
            emailNotifications: true,
            smsNotifications: false,
          },
          privacySettings: localSettings.privacySettings || {},
          accountPreferences: localSettings.accountPreferences || {
            preferredLanguage: 'English',
            timeZone: 'UTC',
          },
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      notificationPreferences: {
        ...prevSettings.notificationPreferences,
        [name]: checked,
      },
    }));
  };


  const handleAccountPreferencesChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      accountPreferences: {
        ...prevSettings.accountPreferences,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'settings',
        JSON.stringify({
          notificationPreferences: settings.notificationPreferences,
          privacySettings: settings.privacySettings,
          accountPreferences: settings.accountPreferences,
        })
      );

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <form onSubmit={handleSubmit}>
        {/* Notification Preferences */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Notification Preferences</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.notificationPreferences?.emailNotifications || false}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="emailNotifications" className="text-lg font-normal text-brand-blue">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smsNotifications"
              name="smsNotifications"
              checked={settings.notificationPreferences?.smsNotifications || false}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="smsNotifications" className="text-lg font-normal text-brand-blue">
              SMS Notifications
            </label>
          </div>
        </div>

        {/* Account Preferences */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Account Preferences</h3>
          <div className="mb-4">
            <label htmlFor="preferredLanguage" className="block text-lg font-normal text-brand-blue mb-2">
              Preferred Language
            </label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={settings.accountPreferences?.preferredLanguage || 'English'}
              onChange={handleAccountPreferencesChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              {/* Add more language options as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="timeZone" className="block text-lg font-normal text-brand-blue mb-2">
              Time Zone
            </label>
            <select
              id="timeZone"
              name="timeZone"
              value={settings.accountPreferences?.timeZone || 'UTC'}
              onChange={handleAccountPreferencesChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {/* Replace with dynamic options */}
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              {/* Add more time zone options as needed */}
            </select>
          </div>
        </div>    
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default DrcSettingsPage;
