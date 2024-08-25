import React, { useState , useEffect } from 'react';
import axios from 'axios';
const ClientSettingsPage = () =>{
  const [settings, setSettings] = useState({
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
    privacySettings: {},
    accountPreferences: {
      preferredLanguage: 'English',
      timeZone: 'UTC',
    },
    status: '',
    paymentMethods: [],
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { availability_status: status, selected_payment_method: paymentMethods } = response.data;

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
          status: status || '',
          paymentMethods: paymentMethods || [],
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

  const handlePaymentMethodChange = (index, field, value) => {
    const updatedPaymentMethods = settings.paymentMethods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    );
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: updatedPaymentMethods,
    }));
  };

  const handleAddPaymentMethod = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: [...prevSettings.paymentMethods, { name: '', details: '' }],
    }));
  };

  const handleRemovePaymentMethod = (index) => {
    const updatedPaymentMethods = settings.paymentMethods.filter((_, i) => i !== index);
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: updatedPaymentMethods,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        selected_payment_method: settings.paymentMethods.map((method) => ({
          name: method.name,
          details: method.details,
        })),
      };

      const token = localStorage.getItem('access');
      await axios.patch('http://127.0.0.1:8000/api/user/client/manage/', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

       {/* Payment Methods Section */}
       <div className="mb-6">
       <h3 className="text-xl font-normal text-brand-blue mb-4">Payment Methods</h3>
          {settings.paymentMethods.map((method, index) => (
            <div key={index} className="mb-4">
              <label htmlFor="paymentmethod" className="block text-lg font-normal text-brand-blue mb-2">
              Payment Method
            </label>
              <input
                type="text"
                name="paymentmethod"
                value={method.name}
                onChange={(e) => handlePaymentMethodChange(index, 'name', e.target.value)}
                className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter payment method name"
              />
             <label htmlFor="details" className="block text-lg font-normal text-brand-blue mb-2">
              Payment Method Detials
            </label>
            <textarea
                type="text"
                name="details"
                value={method.details}
                onChange={(e) => handlePaymentMethodChange(index, 'details', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
                placeholder="Enter payment details separated by commas"
              />
              <button
                type="button"
                onClick={() => handleRemovePaymentMethod(index)}
                className="mt-2 text-red-500 hover:text-red-700 text-md"
              >
                Remove Payment Method
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPaymentMethod}
            className="mt-2 text-blue-500 hover:text-blue-700 text-md"
          >
            Add Payment Method
          </button>
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

export default ClientSettingsPage;
