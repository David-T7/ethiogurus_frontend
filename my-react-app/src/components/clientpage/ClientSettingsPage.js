import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ClientSettingsPage = () => {
  const queryClient = useQueryClient();

  // Fetch client settings
  const fetchSettings = async () => {
    const token = localStorage.getItem("access");
    const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { availability_status: status, selected_payment_method: paymentMethods } = response.data;

    return {
      status: status || "",
      paymentMethods: paymentMethods || [],
    };
  };

  // Update client settings mutation
  const updateSettingsOnServer = async (settings) => {
    const token = localStorage.getItem("access");
    const updateData = {
      selected_payment_method: settings.paymentMethods.map((method) => ({
        name: method.name,
        details: method.details,
      })),
    };

    await axios.patch("http://127.0.0.1:8000/api/user/client/manage/", updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // React Query `useQuery` to fetch data
  const { data: settings = {}, isLoading, isError, error } = useQuery({
    queryKey: ["clientSettings"],
    queryFn: fetchSettings,
  });

  // React Query mutation for updating settings
  const mutation = useMutation({
    mutationFn: updateSettingsOnServer,
    onSuccess: () => {
      queryClient.invalidateQueries(["clientSettings"]);
      alert("Settings saved successfully!");
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    },
  });

  const handlePaymentMethodChange = (index, field, value) => {
    const updatedPaymentMethods = settings.paymentMethods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    );

    queryClient.setQueryData(["clientSettings"], (oldData) => ({
      ...oldData,
      paymentMethods: updatedPaymentMethods,
    }));
  };

  const handleAddPaymentMethod = () => {
    queryClient.setQueryData(["clientSettings"], (oldData) => ({
      ...oldData,
      paymentMethods: [...oldData.paymentMethods, { name: "", details: "" }],
    }));
  };

  const handleRemovePaymentMethod = (index) => {
    queryClient.setQueryData(["clientSettings"], (oldData) => ({
      ...oldData,
      paymentMethods: oldData.paymentMethods.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(settings);
  };

  if (isLoading) return <div>Loading settings...</div>;
  if (isError) return <div>Error loading settings: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Payment Methods</h3>
          {settings.paymentMethods?.map((method, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Payment Method"
                value={method.name}
                onChange={(e) => handlePaymentMethodChange(index, "name", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Details"
                value={method.details}
                onChange={(e) => handlePaymentMethodChange(index, "details", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemovePaymentMethod(index)}
                className="text-red-500 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddPaymentMethod} className="text-blue-500">
            Add Payment Method
          </button>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default ClientSettingsPage;
