import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const recommendedSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Django', 'Java', 'Ruby on Rails', 
  'SQL', 'NoSQL', 'DevOps', 'AWS', 'Docker', 'Kubernetes', 'UI/UX Design', 'Project Management'
];

const allSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Django', 'Java', 'Ruby on Rails', 
  'SQL', 'NoSQL', 'DevOps', 'AWS', 'Docker', 'Kubernetes', 'UI/UX Design', 'Project Management',
  'PHP', 'C++', 'Swift', 'TypeScript', 'GraphQL', 'Microservices', 'Machine Learning', 
  'Cloud Computing', 'Agile', 'Scrum', 'Business Analysis'
];

const Skills = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const results = allSkills.filter(skill =>
        skill.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSkills(results);
    } else {
      setFilteredSkills([]);
    }
  };

  const handleSkillAdd = (skill) => {
    setSelectedSkills((prevSelected) =>
      prevSelected.includes(skill)
        ? prevSelected
        : [...prevSelected, skill]
    );
    setSearchTerm('');
    setFilteredSkills([]);
  };

  const handleRecommendedSkillAdd = (skill) => {
    setSelectedSkills((prevSelected) =>
      prevSelected.includes(skill)
        ? prevSelected
        : [...prevSelected, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to the next step
    navigate('/hire-talent/finalize');
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          What skills would you like to see in your new hire?
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search for skills..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 border border-gray-300 rounded-lg"
          />
          {filteredSkills.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg shadow-md max-h-64 overflow-y-auto mt-0">
              <ul className="list-none p-0 m-0">
                {filteredSkills.map((skill) => (
                  <li key={skill} className="hover:bg-gray-100">
                    <button
                      type="button"
                      onClick={() => handleSkillAdd(skill)}
                      className="w-full text-left p-3 bg-white border-b border-gray-300 hover:bg-brand-blue hover:text-white transition"
                    >
                      {skill}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedSkills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-medium text-brand-blue mb-4">
                Selected Skills
              </h3>
              <div className="flex flex-wrap gap-4">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-gray-200 text-brand-gray-dark p-2 rounded-lg flex items-center"
                  >
                    <span className="mr-2">{skill}</span>
                    <button
                      onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-brand-blue mb-4">
              Recommended Skills
            </h3>
            <div className="flex flex-wrap gap-4">
              {recommendedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleRecommendedSkillAdd(skill)}
                  className="bg-brand-blue text-white p-2 rounded-lg hover:bg-brand-dark-blue transition"
                >
                  <span className="mr-2">{skill}</span>
                  <span className="text-white text-lg">+</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Next
          </button>
        </form>
      </section>
    </div>
  );
};

export default Skills;
