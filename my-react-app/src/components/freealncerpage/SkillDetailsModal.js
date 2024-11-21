import React from 'react';
import { motion } from 'framer-motion';

const SkillDetailsModal = ({ skill, codingTests, theoreticalTests, onClose, onStartTest }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-normal text-brand-dark-blue">{skill.name} Test</h2>
          <button onClick={onClose} className="text-brand-orange font-bold text-2xl">&times;</button>
        </div>

        <div className="mb-4">
          {codingTests.length > 0 ? (
            <ul className="space-y-2">
              {codingTests.map((test) => (
                <motion.li
                  key={test.id}
                  className="flex justify-between items-center p-2 border border-brand-gray-light rounded-lg hover:bg-brand-gray-light transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-brand-gray-dark">{test.skill_type} Practical Test </p>
                  <button
                    onClick={() => onStartTest(test.id, 'practical')}
                    className="py-2 px-4 rounded bg-brand-green text-white hover:bg-brand-dark-green transition-transform duration-300 transform hover:scale-105"
                  >
                    Start Test
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-gray-dark">No Practical tests available.</p>
          )}
        </div>

        <div className="mb-4">
          {theoreticalTests.length > 0 ? (
            <ul className="space-y-2">
              {theoreticalTests.map((test) => (
                <motion.li
                  key={test.id}
                  className="flex justify-between items-center p-2 border border-brand-gray-light rounded-lg hover:bg-brand-gray-light transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-brand-gray-dark">{test.title} Theoretical Test</p>
                  <button
                    onClick={() => onStartTest(test.id, 'theoretical')}
                    className="py-2 px-4 rounded bg-brand-green text-white hover:bg-brand-dark-green transition-transform duration-300 transform hover:scale-105"
                  >
                    Start Test
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-gray-dark">No theoretical tests available.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 py-2 px-4 rounded bg-brand-blue text-white hover:bg-brand-dark-blue transition-transform duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SkillDetailsModal;
