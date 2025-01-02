import { useUserState } from "./useUserState";

export const useAdminCheck = () => {
  const { user } = useUserState();
  const isAdmin = user?.email === "mendar.bouchali@gmail.com";

  console.log("Admin check:", {
    isAdmin,
    userEmail: user?.email
  });

  return { isAdmin };
};