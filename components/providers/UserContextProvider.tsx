import { authUsingCookie } from "@/utils/serverActions";
import { createContext, useState, SetStateAction, useEffect } from "react";

interface ContextType {
  user: User;
  setUser: React.Dispatch<SetStateAction<User>>;
}
export const UserContext = createContext({} as ContextType);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({} as User);
  useEffect(() => {
    async function fetchUser() {
      const { status, error, data } = await authUsingCookie();
      if (status === "fail" || error) return;
      const { name, email, photo } = data?.user;
      if (!user) return;
      setUser(() => ({
        name,
        email,
        photo,
      }));
    }

    if (Object.keys(user).length === 0) {
      fetchUser();
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
