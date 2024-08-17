import React, { useState, useEffect } from 'react';

// Mock function to simulate updating settings
const updateSettings = (settings) => {
  // Replace with actual API call to update settings
  console.log('Updating settings:', settings);
};

const FreelancerSettingsPage = () => {
  const [settings, setSettings] = useState({
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
    privacySettings: {
      profileVisibility: 'Public',
      hideProfileFromSearch: false,
    },
    accountPreferences: {
      preferredLanguage: 'English',
      timeZone: 'UTC',
      status: 'Available',
      paymentMethod: 'PayPal', // Example default value
      bankDetails: '',
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      accountPreferences: {
        ...prevSettings.accountPreferences,
        [name]: value,
      },
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

  const handlePrivacyChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      privacySettings: {
        ...prevSettings.privacySettings,
        [name]: type === 'checkbox' ? checked : value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(settings);
    // Show a confirmation message or redirect
  };

  useEffect(() => {
    // Example to fetch available time zones from an API
    // Replace this with actual API call if needed
  }, []);

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
              checked={settings.notificationPreferences.emailNotifications}
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
              checked={settings.notificationPreferences.smsNotifications}
              onChange={handleNotificationChange}
              className="mr-2"
            />
            <label htmlFor="smsNotifications" className="text-lg font-normal text-brand-blue">
              SMS Notifications
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Privacy Settings</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="hideProfileFromSearch"
              name="hideProfileFromSearch"
              checked={settings.privacySettings.hideProfileFromSearch}
              onChange={handlePrivacyChange}
              className="mr-2"
            />
            <label htmlFor="hideProfileFromSearch" className="text-lg font-normal text-brand-blue">
              Hide profile from search engines
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
              value={settings.accountPreferences.preferredLanguage}
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
              value={settings.accountPreferences.timeZone}
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
          <div className="mb-4">
            <label htmlFor="status" className="block text-lg font-normal text-brand-blue mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={settings.accountPreferences.status}
              onChange={handleAccountPreferencesChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-lg font-normal text-brand-blue mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={settings.accountPreferences.paymentMethod}
              onChange={handleAccountPreferencesChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              {/* Add more payment methods as needed */}
            </select>
          </div>
          {settings.accountPreferences.paymentMethod === 'Bank Transfer' && (
            <div className="mb-4">
              <label htmlFor="bankDetails" className="block text-lg font-normal text-brand-blue mb-2">
                Bank Details
              </label>
              <input
                type="text"
                id="bankDetails"
                name="bankDetails"
                value={settings.accountPreferences.bankDetails}
                onChange={handleAccountPreferencesChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your bank details"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default FreelancerSettingsPage;
