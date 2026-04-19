import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { ShoppingBag, User, Utensils, Store, Menu, X, LogOut, ChevronRight, Star, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary font-black text-2xl">H</div>
            <span className="text-2xl font-black tracking-tighter text-secondary">Hungers</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/restaurantes" className="text-sm font-medium hover:text-primary transition-colors">Restaurantes</Link>
            <Link to="/nosotros" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={`/dashboard/${user.role}`} className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/90 transition-all">
                  <User size={16} />
                  Mi Perfil
                </Link>
                <button onClick={onLogout} className="p-2 text-secondary/60 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Iniciar Sesión</Link>
                <Link to="/register" className="bg-primary text-secondary px-6 py-2 rounded-full text-sm font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-black/5 px-4 py-6 space-y-4"
          >
            <Link to="/restaurantes" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Restaurantes</Link>
            <Link to="/nosotros" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Nosotros</Link>
            {user ? (
              <>
                <Link to={`/dashboard/${user.role}`} className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block text-lg font-medium text-red-500">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                <Link to="/register" className="block w-full bg-primary text-white text-center py-3 rounded-xl font-medium" onClick={() => setIsOpen(false)}>Registrarse</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/food/1920/1080" 
            className="w-full h-full object-cover" 
            alt="Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Almuerzos con <span className="text-primary italic">Propósito</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              La plataforma que conecta a las mejores cocinas con empresas y personas que buscan impacto social y calidad gastronómica.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/restaurantes" className="bg-primary text-secondary px-8 py-4 rounded-full text-lg font-bold hover:bg-accent transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
                Explorar Menú <ChevronRight size={20} />
              </Link>
              <Link to="/register?role=company" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all">
                Soy una Empresa
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        {[
          { icon: <Utensils className="text-primary" size={32} />, title: "Calidad Gourmet", desc: "Platos preparados por chefs expertos con ingredientes frescos y locales." },
          { icon: <ShoppingBag className="text-primary" size={32} />, title: "Impacto Social", desc: "Cada pedido contribuye a programas de alimentación para comunidades vulnerables." },
          { icon: <Store className="text-primary" size={32} />, title: "Para Empresas", desc: "Soluciones corporativas de alimentación con facturación centralizada y logística eficiente." }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-black/5 hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-secondary/60 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Impact Section */}
      <section className="bg-secondary py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src="https://picsum.photos/seed/impact/800/800" className="w-full h-full object-cover rounded-l-full" alt="Impact" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Más que comida, es <span className="text-primary italic">impacto</span></h2>
            <p className="text-lg text-white/60 leading-relaxed">
              En Hungers, creemos que cada almuerzo puede cambiar una vida. Trabajamos con fundaciones locales para asegurar que por cada plato vendido, una porción de comida llegue a quien más lo necesita.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-primary">+50k</p>
                <p className="text-sm text-white/40 uppercase font-bold tracking-widest">Platos Donados</p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">120</p>
                <p className="text-sm text-white/40 uppercase font-bold tracking-widest">Cocinas Aliadas</p>
              </div>
            </div>
            <button className="bg-white text-secondary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
              Conoce nuestro modelo
            </button>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">Restaurantes Destacados</h2>
            <p className="text-secondary/60">Las cocinas más queridas de nuestra comunidad</p>
          </div>
          <Link to="/restaurantes" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <motion.div 
              key={id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm"
            >
              <div className="h-48 relative">
                <img 
                  src={`https://picsum.photos/seed/rest${id}/600/400`} 
                  className="w-full h-full object-cover" 
                  alt="Restaurant"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" /> 4.8
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h4 className="text-lg font-bold">Cocina de Origen {id}</h4>
                <div className="flex items-center gap-4 text-xs text-secondary/50 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14} /> 25-35 min</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> 2.4 km</span>
                </div>
                <button className="w-full bg-secondary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary transition-colors">
                  Ver Menú
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const user = await res.json();
      onLogin(user);
      navigate(`/dashboard/${user.role}`);
    } else {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-secondary/60">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-secondary py-4 rounded-2xl font-bold text-lg hover:bg-accent transition-all shadow-lg shadow-primary/20">
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-sm text-secondary/60">
          ¿No tienes cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Regístrate aquí</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Register = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "client",
    phone: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const user = await res.json();
      onLogin(user);
      navigate(`/dashboard/${user.role}`);
    } else {
      alert("Error al registrarse");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5 w-full max-w-lg space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h2>
          <p className="text-secondary/60">Únete a la comunidad de Hungers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold px-1">Nombre Completo</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Juan Perez"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold px-1">Teléfono</label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="300 123 4567"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl bg-secondary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold px-1">Tipo de Perfil</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "client", label: "Cliente", icon: <User size={16} /> },
                { id: "company", label: "Empresa", icon: <Store size={16} /> },
                { id: "cook", label: "Cocinero", icon: <Utensils size={16} /> }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({...formData, role: role.id})}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                    formData.role === role.id 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-transparent bg-secondary/5 text-secondary/40 hover:bg-secondary/10"
                  )}
                >
                  {role.icon}
                  <span className="text-xs font-bold">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-secondary py-4 rounded-2xl font-bold text-lg hover:bg-accent transition-all shadow-lg shadow-primary/20">
            Crear Cuenta
          </button>
        </form>

        <p className="text-center text-sm text-secondary/60">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- Dashboards ---

const DashboardLayout = ({ title, children, user }: { title: string; children: React.ReactNode; user: any }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-secondary/60">Bienvenido, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-black/5 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Estado: Activo</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

const ClientDashboard = ({ user }: { user: any }) => {
  return (
    <DashboardLayout title="Panel de Cliente" user={user}>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Pedidos Recientes</h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <ShoppingBag className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Almuerzo Ejecutivo #00{i}</p>
                      <p className="text-xs text-secondary/50">24 Feb, 2026 • Cocina de Origen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">$25.000</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-600 px-2 py-1 rounded-full">Entregado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-primary text-secondary p-8 rounded-[2rem] shadow-xl shadow-primary/20 space-y-4">
            <h3 className="text-xl font-bold">Puntos Hungers</h3>
            <p className="text-4xl font-black">1.250</p>
            <p className="text-sm text-secondary/80">¡Te faltan 250 puntos para tu próximo almuerzo gratis!</p>
            <button className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm">Canjear Puntos</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const CompanyDashboard = ({ user }: { user: any }) => {
  return (
    <DashboardLayout title="Panel de Empresa" user={user}>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Ventas Hoy", value: "$450.000", trend: "+12%" },
          { label: "Pedidos", value: "18", trend: "+5" },
          { label: "Calificación", value: "4.9", trend: "★" },
          { label: "Puntos Impacto", value: "850", trend: "Social" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-2">
            <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-black">{stat.value}</p>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Gestión de Menú</h3>
          <button className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-bold">+ Nuevo Plato</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden border border-black/5">
              <img src={`https://picsum.photos/seed/dish${i}/400/300`} className="w-full h-40 object-cover" alt="Dish" referrerPolicy="no-referrer" />
              <div className="p-4 space-y-2">
                <p className="font-bold">Menú del Día {i}</p>
                <p className="text-xs text-secondary/60">Proteína, 2 acompañamientos y bebida.</p>
                <p className="text-primary font-black">$18.500</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const CookDashboard = ({ user }: { user: any }) => {
  return (
    <DashboardLayout title="Panel de Cocinero" user={user}>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Pedidos en Cocina</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl border-2 border-dashed border-secondary/10">
                  <div className="space-y-1">
                    <p className="font-bold text-lg">Pedido #45{i}</p>
                    <p className="text-sm text-secondary/60">2x Almuerzo Ejecutivo • Sin cebolla</p>
                  </div>
                  <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-all">
                    Marcar como Listo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-secondary text-white p-8 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-bold">Tu Desempeño</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Eficiencia</span>
                  <span>94%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[94%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calidad</span>
                  <span>4.8/5.0</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[96%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Nuestras Cocinas</h1>
        <p className="text-secondary/60 max-w-2xl mx-auto">Descubre una variedad de sabores preparados con amor y propósito social.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {restaurants.map((res) => (
          <Link 
            key={res.id} 
            to={`/restaurantes/${res.id}`}
            className="bg-white rounded-[2rem] overflow-hidden border border-black/5 hover:shadow-2xl transition-all group"
          >
            <div className="h-64 relative overflow-hidden">
              <img 
                src={res.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt={res.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Star size={16} className="text-yellow-500 fill-yellow-500" /> 4.9
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-bold">{res.name}</h3>
              <p className="text-secondary/60 text-sm line-clamp-2 leading-relaxed">{res.description}</p>
              <div className="flex items-center gap-6 text-xs text-secondary/40 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Clock size={16} /> 30-45 min</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> Bogotá</span>
              </div>
              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-primary font-bold">Ver Menú</span>
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const RestaurantDetail = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data));

    fetch(`/api/restaurants/${id}/menu`)
      .then(res => res.json())
      .then(data => setMenu(data));
  }, [id]);

  if (!restaurant) return <div className="h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="pb-20">
      <div className="h-[40vh] relative">
        <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4 space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">{restaurant.name}</h1>
            <p className="text-xl text-white/80">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-black/5 p-8 md:p-12 space-y-12">
          <div className="flex flex-wrap gap-8 items-center justify-center md:justify-start border-b border-black/5 pb-8">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-1">Calificación</p>
              <p className="text-2xl font-black flex items-center gap-2 justify-center md:justify-start">
                4.9 <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </p>
            </div>
            <div className="w-px h-10 bg-black/5 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-1">Tiempo Entrega</p>
              <p className="text-2xl font-black flex items-center gap-2 justify-center md:justify-start">
                35-45 <span className="text-sm font-medium text-secondary/60">min</span>
              </p>
            </div>
            <div className="w-px h-10 bg-black/5 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-1">Costo Envío</p>
              <p className="text-2xl font-black text-green-500">Gratis</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Menú del Día</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {menu.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 rounded-3xl border border-black/5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold">{item.name}</h4>
                      <p className="text-primary font-black">${item.price.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-secondary/60 leading-relaxed">{item.description}</p>
                    <button className="bg-secondary text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-primary transition-colors">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("hungers_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("hungers_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("hungers_user");
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/restaurantes" element={<RestaurantList />} />
            <Route path="/restaurantes/:id" element={<RestaurantDetail />} />
            
            {/* Protected Dashboards */}
            <Route path="/dashboard/client" element={user?.role === 'client' ? <ClientDashboard user={user} /> : <Login onLogin={handleLogin} />} />
            <Route path="/dashboard/company" element={user?.role === 'company' ? <CompanyDashboard user={user} /> : <Login onLogin={handleLogin} />} />
            <Route path="/dashboard/cook" element={user?.role === 'cook' ? <CookDashboard user={user} /> : <Login onLogin={handleLogin} />} />
          </Routes>
        </main>

        <footer className="bg-secondary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary font-black text-2xl">H</div>
                <span className="text-2xl font-black tracking-tighter">Hungers</span>
              </div>
              <p className="text-white/60 leading-relaxed">
                Transformando la forma en que las empresas y personas se alimentan, generando impacto social en cada bocado.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><Link to="/restaurantes" className="hover:text-primary transition-colors">Restaurantes</Link></li>
                <li><Link to="/nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/impacto" className="hover:text-primary transition-colors">Impacto Social</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Soporte</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><Link to="/ayuda" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
                <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
                <li><Link to="/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Newsletter</h4>
              <p className="text-white/60 text-sm mb-4">Recibe las mejores ofertas y noticias de impacto.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="tu@email.com" className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-primary" />
                <button className="bg-primary px-4 py-2 rounded-xl font-bold text-sm">Unirse</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/10 text-center text-white/40 text-xs">
            © 2026 Hungers Colombia. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </Router>
  );
}
