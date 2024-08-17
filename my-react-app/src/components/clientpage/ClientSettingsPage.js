import React, { useState } from 'react';

// Mock function to simulate updating settings
const updateSettings = (settings) => {
  // Replace with actual API call to update settings
  console.log('Updating settings:', settings);
};

const ClientSettingsPage = () => {
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
      accountStatus: 'Available',
    },
    paymentMethod: 'Credit Card',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      routingNumber: '',
    },
    paypalDetails: {
      paypalEmail: '',
    },
    creditCardDetails: {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    },
  });

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

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      bankDetails: {
        ...prevSettings.bankDetails,
        [name]: value,
      },
    }));
  };

  const handlePayPalDetailsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      paypalDetails: {
        ...prevSettings.paypalDetails,
        [name]: value,
      },
    }));
  };

  const handleCreditCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      creditCardDetails: {
        ...prevSettings.creditCardDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(settings);
    // Show a confirmation message or redirect
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="GMT">GMT</option>
              <option value="CET">CET</option>
              {/* Add more time zones as needed */}
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Payment Method</h3>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-lg font-normal text-brand-blue mb-2">
              Select Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={settings.paymentMethod}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {/* Bank Details */}
          {settings.paymentMethod === 'Bank Transfer' && (
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-lg font-normal text-brand-blue mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={settings.bankDetails.bankName}
                  onChange={handleBankDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-lg font-normal text-brand-blue mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={settings.bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="routingNumber" className="block text-lg font-normal text-brand-blue mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  name="routingNumber"
                  value={settings.bankDetails.routingNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* PayPal Details */}
          {settings.paymentMethod === 'PayPal' && (
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="paypalEmail" className="block text-lg font-normal text-brand-blue mb-2">
                  PayPal Email
                </label>
                <input
                  type="email"
                  id="paypalEmail"
                  name="paypalEmail"
                  value={settings.paypalDetails.paypalEmail}
                  onChange={handlePayPalDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Credit Card Details */}
          {settings.paymentMethod === 'Credit Card' && (
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-lg font-normal text-brand-blue mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={settings.creditCardDetails.cardNumber}
                  onChange={handleCreditCardDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="expirationDate" className="block text-lg font-normal text-brand-blue mb-2">
                  Expiration Date (MM/YY)
                </label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={settings.creditCardDetails.expirationDate}
                  onChange={handleCreditCardDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cvv" className="block text-lg font-normal text-brand-blue mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={settings.creditCardDetails.cvv}
                  onChange={handleCreditCardDetailsChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientSettingsPage;
