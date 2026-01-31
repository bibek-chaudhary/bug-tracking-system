import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export const useDevelopers = () => {
  return useQuery({
    queryKey: ["developers"],
    queryFn: userService.getDevelopers,
  });
};
