import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginWithEmail,
  loginWithGooglePopup,
  logoutUser,
  signupWithEmail,
  subscribeToAuthState,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => signupWithEmail(email, password);
  const login = (email, password) => loginWithEmail(email, password);
  const loginWithGoogle = () => loginWithGooglePopup();
  const logout = () => logoutUser();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
