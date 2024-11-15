"use client";
import { User } from "@prisma/client";
import { createContext, useState } from "react";

export const UserContext = createContext<UserContextType | null>(null);

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

type UserContextProviderProps = {
  initialUser: User;
  children: React.ReactNode;
};
export function UserContextProvider({
  initialUser,
  children,
}: UserContextProviderProps) {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
