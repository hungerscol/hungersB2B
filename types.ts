export enum Page {
  Home = 'Home',
  Empresas = 'Empresas',
  Cocineros = 'Cocineros',
  Menus = 'Menús',
  Nosotros = 'Nosotros',
  Contacto = 'Contacto',
  LoginCliente = 'Acceso Cliente',
  LoginEmpresa = 'Acceso Empresa',
  LoginCocinero = 'Acceso Cocinero',
  Dashboard = 'Dashboard',
  Checkout = 'Checkout',
  Registro = 'Registro',
  APIDocs = 'Documentación API',
  ImageGeneration = 'Generador de Imágenes IA',
  Terminos = 'Términos y Condiciones'
}

export enum UserRole {
  SuperAdmin = 'Super Admin',
  AdminEmpresa = 'Admin Empresa',
  Cocinero = 'Cocinero',
  Cliente = 'Cliente',
}

export type VerificationStatus = 'pendiente_verificacion' | 'aprobado' | 'rechazado';

export interface Document {
  type: 'identidad' | 'manipulacion_alimentos' | 'perfil';
  file: File;
}

export interface PaymentMethod {
  id: string;
  brand: string; // e.g., 'Visa', 'Mastercard'
  last4: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string; // Full name for individuals, admin name for company
  email: string;
  password?: string;
  role: UserRole;
  verificationStatus?: VerificationStatus; // Critical for Cocinero B2B lifecycle
  registrationDate: string;
  companyId?: string; // Links Cliente and AdminEmpresa to a Company
  cookId?: string; // Global reference for cooks
  location?: LocationCode;
  imageUrl?: string;
  
  // Role-specific extensions
  companyName?: string;
  nit?: string;
  phone?: string;
  city?: string;
  specialty?: string;
  documents?: Document[];
  accountNumber?: string;
  credits?: number; // Corporate benefit balance
  paymentMethods?: PaymentMethod[];
}

export interface Company {
  id: string;
  name: string;
  totalCredits?: number; // Company's shared wallet
  nit?: string;
  location?: string;
}

export type LocationCode = 'BOG' | 'MDE';

export interface Location {
  code: LocationCode;
  name: string;
  flag: string;
  country: 'CO';
}

export interface Cook {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cookId: string;
  cookName?: string;
  price: number;
  currency: 'COP';
  location: LocationCode;
  rating: number;
  ingredients: string[];
  availableDate?: string; // Format: YYYY-MM-DD
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pagado' | 'rechazado' | 'pendiente';
}

export interface Invoice {
  id: string;
  companyId: string;
  date: string;
  amount: number;
  status: 'Pagada' | 'Pendiente';
}

export interface RecurringOrder {
  id: string;
  companyId: string;
  description: string;
  startDate: string;
  frequency: 'Semanal' | 'Quincenal' | 'Mensual';
  daysOfWeek?: ('L' | 'M' | 'X' | 'J' | 'V')[];
  employeeIds: string[];
  amountPerLunch: number;
}

export interface Payout {
  id: string;
  cookId: string;
  date: string;
  grossAmount: number;
  commission: number; // Plataform fee
  netAmount: number;
  currency: 'COP';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}
