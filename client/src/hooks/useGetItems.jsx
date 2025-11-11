import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const useGetItems = (apiUrl, queryKey) => {
  const location = useLocation();
  const searchParams = location.search;

  const { data, error, isPending } = useQuery({
    queryKey: [queryKey, apiUrl, searchParams],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}${searchParams}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
  return { data, error, isPending };
};
export default useGetItems;
