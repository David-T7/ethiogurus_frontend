import React from 'react';
import { motion } from 'framer-motion';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-10/12 sm:w-3/4 md:w-2/3 lg:w-1/3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-normal text-brand-dark-blue">Confirmation</h2>
          <button onClick={onCancel} className="text-brand-orange font-bold text-2xl">&times;</button>
        </div>

        <div className="mb-4">
          <p className="text-brand-gray-dark">{message}</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded bg-brand-green text-white hover:bg-brand-dark-green transition-transform duration-300 transform hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
