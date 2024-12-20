import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTalents = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/freelancers/search/", { params });
  return response.data.freelancers;
};

const TalentListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const blurlimit = 3;
  const isClientAuthenticated = !location.pathname.startsWith('/hire-talent')
  // Fetch talents using useQuery
  const { data: talents = [], isLoading, isError } = useQuery({
    queryKey: [
      "talents",
      {
        tech_stack: JSON.stringify(JSON.parse(localStorage.getItem("selectedSkills") || "[]")),
        working_preference: localStorage.getItem("timeCommitment"),
        project_duration: localStorage.getItem("projectDuration"),
        project_budget: localStorage.getItem("projectBudget"),
        project_description: localStorage.getItem("projectDescription"),
      },
    ],
    queryFn: fetchTalents,
  });

  
  const handleRedirectToSignup = (id) => {
    if (location.pathname.startsWith('/hire-talent')) {      
      navigate("/hire-talent/finalize");
    } else {
      if (location.pathname.startsWith('/create-project/talent-list')){      
      navigate(`/create-project/talent-list/${id}`);
      }
      else{
        navigate(`/hire-talent/talent-list/${id}`);        
      }
    }
  };

  const handleCardClick = (e, id) => {
    e.stopPropagation();
    handleRedirectToSignup(id);
  };

  const handleContactClick = (e, id) => {
    e.stopPropagation();
    navigate(`/contact-freelancer/${id}`);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Failed to fetch talent data.</div>;

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-6xl mx-auto">
        {talents.length > 0 && !isClientAuthenticated && (
          <h2 className="text-3xl font-normal text-brand-blue mb-6">
            Here are some freelancers matched based on your project needs.
            <br />
            <span
              className="text-brand-blue underline hover:text-brand-dark-blue cursor-pointer"
              onClick={handleRedirectToSignup}
            >
              Sign up
            </span>{" "}
            <span>to see the full list.</span>
          </h2>
        )}
        {talents.length <= 0 && (
          <h2 className="text-center">No freelancer found based on your requirement</h2>
        )}
        {talents.length > 0 && isClientAuthenticated && (
          <h2 className="text-lg text-center mb-6">
            Here are some freelancers matched based on your project needs.
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {talents.map((talent, index) => (
            <div
              key={talent.id}
              onClick={(e) => handleCardClick(e, talent.id)}
              className={`relative bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                !isClientAuthenticated && index >= blurlimit
                  ? "opacity-50 grayscale-[20%] blur-sm pointer-events-none"
                  : ""
              }`}
              style={{
                transition: "filter 0.3s ease, opacity 0.3s ease",
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={`http://127.0.0.1:8000/${talent.profile_picture}`}
                  alt={`${talent.full_name}'s profile`}
                  className="w-32 h-32 object-cover rounded-full border-4 border-brand-blue mb-2"
                />
                <h3
                  className={`text-2xl font-semibold text-brand-blue mb-2 ${
                    !isClientAuthenticated && index >= blurlimit ? "select-none" : ""
                  }`}
                  style={{
                    maxWidth: "200px",
                    textAlign: "center",
                  }}
                >
                  {talent.professional_title}
                </h3>
                <div className="text-left w-full max-w-xs ml-40 md:ml-24 lg:ml-8">
                  <div className="flex justify-between mb-1">
                    <span className="font-normal text-brand-blue">
                      <strong>Name:</strong> {talent.full_name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-normal text-brand-blue">
                      <strong>Skills:</strong>{" "}
                      {talent.skills
                        ? Array.from(
                            new Set(
                              JSON.parse(talent.skills).map(
                                (skillObj) => skillObj.skill
                              )
                            )
                          ).join(", ")
                        : "No skills available"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-normal text-brand-blue">
                      <strong>Experience:</strong> {talent.experience} years
                    </span>
                  </div>
                  {talent.hourly_rate && (
                    <div className="flex justify-between mb-2">
                      <span className="font-normal text-brand-blue">
                        <strong>Hourly Rate:</strong> {talent.hourly_rate}
                      </span>
                    </div>
                  )}
                  {talent.languages_spoken.length > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="font-normal text-brand-blue">
                        <strong>Languages Spoken:</strong>{" "}
                        {talent.languages_spoken.join(", ")}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex items-center mb-4 ${
                      index >= blurlimit && !isClientAuthenticated ? "select-none" : ""
                    }`}
                  >
                    <FaStar className="text-yellow-500" />
                    <span className="ml-2 text-lg text-brand-gray-dark">
                      {talent.rating || "Not rated Yet!"}
                    </span>
                  </div>
                </div>


                  <button
                    onClick={(e) => handleContactClick(e, talent.id)}
                    className="absolute pt-1 left-0 bottom-1 w-full bg-brand-blue text-white py-2 px-4 hover:bg-brand-dark-blue transition flex items-center justify-center gap-2"
                    disabled={!isClientAuthenticated}
                  >
                    <FaEnvelope />
                    <span>Contact Freelancer</span>
                  </button>
              
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentListPage;
