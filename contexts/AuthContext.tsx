import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { User, UserRole } from "../types";
import {
  findUserByEmail,
  registerUser as registerUserInFirestore,
} from "../data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  updateAuthUser: (updatedUserData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const spinStyle = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const savedSession = localStorage.getItem('hungers_user_session');
    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);
        setUser(parsedUser);
        if (parsedUser.isBypass) setLoading(false);
      } catch (e) {
        console.error("Auth: Error restaurando sesión local:", e);
      }
    }

    const safetyTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;
      clearTimeout(safetyTimer);
      setLoading(false);

      if (!firebaseUser) {
        const localSession = localStorage.getItem('hungers_user_session');
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            if (parsed.isBypass) return;
          } catch (e) {}
        }
        setUser(null);
        return;
      }

      const localSession = localStorage.getItem('hungers_user_session');
      if (localSession) {
        try {
          setUser(JSON.parse(localSession));
          return;
        } catch (e) {}
      }

      findUserByEmail(firebaseUser.email!)
        .then((profile) => {
          if (!mounted) return;
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        })
        .catch((error) => {
          console.error("Auth: Error cargando perfil:", error);
          setUser(null);
        });
    }, (error) => {
      console.error("Auth: Error en observador Firebase:", error);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; message?: string }> => {

    const loginPromise = (async (): Promise<{ success: boolean; message?: string }> => {
      try {
        const emailLower = email.toLowerCase().trim();
        const isDemoPassword = password === "demo123";

        if (isDemoPassword) {
          let profile: User | null = null;

          if (emailLower === "b2c@demo.com") {
            profile = { id: 'user_demo_client', name: 'Cliente Demo', email: emailLower, role: UserRole.Cliente, registrationDate: new Date().toISOString(), credits: 50000 };
          } else if (emailLower === "b2b@demo.com") {
            profile = { id: 'user_demo_admin', name: 'Admin Demo', email: emailLower, role: UserRole.AdminEmpresa, companyId: 'company_demo', companyName: 'Empresa Demo S.A.S', registrationDate: new Date().toISOString() };
          } else if (emailLower === "cocinero@demo.com") {
            profile = { id: 'cook_demo', name: 'Maria Rodriguez', email: emailLower, role: UserRole.Cocinero, specialty: 'Comida Casera', verificationStatus: 'aprobado', registrationDate: new Date().toISOString() };
          }

          if (profile) {
            if (profile.role !== role) {
              const roleNames: Record<string, string> = {
                [UserRole.Cliente]: 'Cliente',
                [UserRole.Cocinero]: 'Cocinero',
                [UserRole.AdminEmpresa]: 'Empresa',
                [UserRole.SuperAdmin]: 'Administrador'
              };
              return { success: false, message: `Esta cuenta está registrada como ${roleNames[profile.role]}. Por favor selecciona el rol correcto.` };
            }
            const bypassProfile = { ...profile, isBypass: true };
            setUser(bypassProfile as User);
            localStorage.setItem('hungers_user_session', JSON.stringify(bypassProfile));
            return { success: true };
          }
        }

        try {
          await signInWithEmailAndPassword(auth, emailLower, password);
        } catch (authError: any) {
          let message = "Error al iniciar sesión.";
          if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(authError.code)) {
            message = "Correo o contraseña incorrectos.";
          } else if (authError.code === 'auth/too-many-requests') {
            message = "Demasiados intentos. Intenta más tarde.";
          } else if (authError.code === 'auth/network-request-failed') {
            message = "Error de red o conexión.";
          }
          return { success: false, message };
        }

        const profile = await findUserByEmail(emailLower);

        if (!profile) {
          await signOut(auth);
          return { success: false, message: "No se encontró un perfil asociado a esta cuenta." };
        }

        if (profile.role !== role) {
          await signOut(auth);
          const roleNames: Record<string, string> = {
            [UserRole.Cliente]: 'Cliente',
            [UserRole.Cocinero]: 'Cocinero',
            [UserRole.AdminEmpresa]: 'Empresa',
            [UserRole.SuperAdmin]: 'Administrador'
          };
          return { success: false, message: `Esta cuenta está registrada como ${roleNames[profile.role]}. Por favor selecciona el rol correcto.` };
        }

        setUser(profile);
        localStorage.setItem('hungers_user_session', JSON.stringify(profile));
        return { success: true };

      } catch (error: any) {
        console.error("Auth: Login Error:", error);
        return { success: false, message: "Ocurrió un error inesperado." };
      }
    })();

    const timeoutPromise = new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => resolve({ success: false, message: "El servidor está tardando demasiado. Intenta de nuevo." }), 20000);
    });

    return Promise.race([loginPromise, timeoutPromise]);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem('hungers_user_session');
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Auth: Logout Error:", error);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const { email, password, role } = userData;
      const emailLower = email.toLowerCase().trim();

      const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
      const firebaseUser = userCredential.user;

      const newProfile: User = {
        ...userData,
        email: emailLower,
        id: firebaseUser.uid,
        role,
        ...(role === UserRole.Cocinero && { cookId: firebaseUser.uid }),
        verificationStatus: role === UserRole.Cocinero ? "pendiente_verificacion" : "aprobado",
        registrationDate: new Date().toISOString(),
      };

      delete (newProfile as any).password;
      await registerUserInFirestore(newProfile);
      setUser(newProfile);
      localStorage.setItem('hungers_user_session', JSON.stringify(newProfile));

      return { success: true, message: "Registro exitoso" };
    } catch (error: any) {
      console.error("Auth: Register Error:", error);
      return { success: false, message: error?.message || "Error en el registro." };
    }
  }, []);

  const updateAuthUser = useCallback((data: Partial<User>) => {
    setUser((curr) => (curr ? { ...curr, ...data } : null));
  }, []);

  const authValue = React.useMemo(() => ({
    user, login, logout, register, updateAuthUser, loading,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={authValue}>
      {loading ? (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
          <div style={{ border: "3px solid #eee", borderTop: "3px solid #2c5234", borderRadius: "50%", width: "30px", height: "30px", animation: "spin 1s linear infinite" }}></div>
          <p style={{ marginTop: "15px", color: "#2c5234", fontWeight: "bold", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
            Cocinando tu experiencia...
          </p>
          <style dangerouslySetInnerHTML={{ __html: spinStyle }} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};