import React, { createContext } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const SkillTestContext = createContext();
const queryClient = new QueryClient();

const fetchSkillTest = async ({ queryKey }) => {
  const [{ id, type }] = queryKey;
  let url = "";
  if (type === "theoretical") {
    url = `http://127.0.0.1:8001/api/skilltests/${id}/`;
  } else if (type === "practical") {
    url = `http://127.0.0.1:8002/api/practical-test/${id}/`;
  } else {
    throw new Error("Invalid test type");
  }

  const token = localStorage.getItem("access"); // Get the access token from localStorage
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the headers
    },
  });

  return response.data;
};

const SkillTestProvider = ({ children }) => {
  const useFetchSkillTest = (id, type) =>
    useQuery({
      queryKey: [{ id, type }],
      queryFn: fetchSkillTest,
      enabled: !!id && !!type, // Only fetch when both id and type are defined
    });

  return (
    <QueryClientProvider client={queryClient}>
      <SkillTestContext.Provider value={{ useFetchSkillTest }}>
        {children}
      </SkillTestContext.Provider>
    </QueryClientProvider>
  );
};

export { SkillTestProvider, SkillTestContext };
