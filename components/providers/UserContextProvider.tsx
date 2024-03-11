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
      try {
        const { status, error, data } = await authUsingCookie();
        if (status === "fail" || error) return;
        const { user } = data;
        if (!user) return;
        setUser(() => ({ ...user }));
        if (Object.keys(user).length === 0) {
          fetchUser();
        }
      } catch (err) {
        console.log(err);
      }
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
