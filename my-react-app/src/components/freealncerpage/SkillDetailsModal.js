import React from 'react';
import { motion } from 'framer-motion';

const SkillDetailsModal = ({ skill, codingTests, theoreticalTests, freelancerSkills, onClose, onStartTest }) => {
  // Check if the skill is already in the freelancer's skills
  const isPracticalSkillTaken = freelancerSkills.some(freelancerSkill => {
    return freelancerSkill.skills.some(skillItem => 
      skillItem.title.toLowerCase() === skill.name.toLowerCase() && skillItem.types.includes('practical')
    );
  });
  
  const isTheoreticalSkillTaken = freelancerSkills.some(freelancerSkill => {
    return freelancerSkill.skills.some(skillItem => 
      skillItem.title.toLowerCase() === skill.name.toLowerCase() && skillItem.types.includes('theoretical')
    );
  });
  
  // console.log("freelancer skill is ",freelancerSkills.)
  // freelancerSkills.forEach(category => {
  //   category.skills.forEach(skillItem => {
  //     console.log("Skill Item Title:", skillItem.title);
  //     console.log("Skill Types:", skillItem.types);
  //   });
  // });

  // console.log("skill is ",skill)

  
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
          <h2 className="text-xl font-normal text-brand-dark-blue">
            {skill.name.replace(/\b\w/g, (char) => char.toUpperCase())} Test
          </h2>
          <button onClick={onClose} className="text-brand-orange font-bold text-2xl">
            &times;
          </button>
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
                  <p className="text-brand-gray-dark">{test.skill_type} Practical Test</p>
                  <button
                    onClick={() => onStartTest(test.id, 'practical')}
                    disabled={isPracticalSkillTaken}
                    className={`py-2 px-4 rounded ${isPracticalSkillTaken ? 'bg-gray-400' : 'bg-brand-green'} text-white ${!isPracticalSkillTaken ? 'hover:bg-brand-dark-green':''} transition-transform duration-300 transform hover:scale-105`}
                  >
                    {isPracticalSkillTaken ? 'Already Taken' : 'Start Test'}
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
                    disabled={isTheoreticalSkillTaken}
                    className={`py-2 px-4 rounded ${isTheoreticalSkillTaken ? 'bg-gray-400' : 'bg-brand-green'} text-white ${!isTheoreticalSkillTaken ? 'hover:bg-brand-dark-green' : '' } transition-transform duration-300 transform hover:scale-105`}
                  >
                    {isTheoreticalSkillTaken ? 'Already Taken' : 'Start Test'}
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
