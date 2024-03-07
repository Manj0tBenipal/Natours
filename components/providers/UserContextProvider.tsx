import { createContext, useState, useContext, SetStateAction } from "react";
interface User {
  name: string;
  email: string;
}
interface ContextType {
  user: User;
  setUser: React.Dispatch<SetStateAction<User>>;
}
export const UserContext = createContext({} as ContextType);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({} as User);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
