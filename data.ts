import { User, UserRole, Order, Company, MenuItem } from './types';
import {
    collection, getDocs, getDoc, addDoc, setDoc, deleteDoc,
    doc, query, where, onSnapshot, updateDoc, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth, storage } from './firebase';

// --------------------
// TYPES
// --------------------
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    location?: string;
    imageUrl?: string;
    cookId?: string;
    description?: string;
    category?: string;
    availableDate?: string;
    ingredients?: string[];
    rating?: number;
}

export interface Order {
    id: string;
    userId: string;
    items: { menuItem: MenuItem; quantity: number }[];
    total: number;
    date: string;
    status: string;
    cookId?: string;
    companyId?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    companyId?: string;
    companyName?: string;
    credits?: number;
    imageUrl?: string;
    specialty?: string;
    verificationStatus?: string;
    registrationDate?: string;
    location?: string;
    cookId?: string;
    [key: string]: any;
}

export interface Company {
    id: string;
    name: string;
    nit?: string;
    address?: string;
    contactEmail?: string;
    plan?: string;
    credits?: number;
}

export interface RecurringOrder {
    id: string;
    companyId: string;
    employeeIds: string[];
    menuItemId: string;
    schedule: string;
    status: string;
}

export interface Invoice {
    id: string;
    companyId: string;
    amount: number;
    date: string;
    status: string;
}

export interface Payout {
    id: string;
    cookId: string;
    amount: number;
    date: string;
    status: string;
}

export interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percent' | 'fixed';
    active: boolean;
}

export interface Category {
    id: string;
    name: string;
}

export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    message: string;
    date?: string;
}

// --------------------
// STATIC DATA
// --------------------
export const LOCATIONS = ['BOG', 'MED', 'MTY', 'CLO'];

export const teamMembers = [
    { id: '1', name: 'Federico Villa', role: 'CEO & Fundador', imageUrl: '' },
];

export const aboutUsContent = {
    mission: 'Conectar hogares y empresas con cocineros locales que preparan comida casera de calidad.',
    vision: 'Ser la plataforma líder de comida casera en Latinoamérica.',
};

export const mockMenuItems: MenuItem[] = [
    { id: 'menu_1', name: 'Almuerzo Ejecutivo', price: 18000, currency: 'COP', location: 'BOG' },
    { id: 'menu_2', name: 'Bowl Saludable', price: 22000, currency: 'COP', location: 'BOG' },
];

export const cooks: User[] = [];

// --------------------
// HELPERS
// --------------------
const getFutureDate = (daysAhead: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
};

// --------------------
// USERS
// --------------------
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as User;
};

export const registerUser = async (user: User): Promise<void> => {
    const { id, ...userData } = user;
    await setDoc(doc(db, 'users', id), userData);
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), data);
};
export const getAllClients = async (): Promise<User[]> => {
    const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'Cliente'))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'cliente'))),
    ]);
    const docs = [...snap1.docs, ...snap2.docs];
    return docs.map(d => ({ id: d.id, ...d.data() })) as User[];
};

export const deductUserCredits = async (userId: string, amount: number): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        const current = (snap.data().credits || 0) as number;
        await updateDoc(userRef, { credits: current - amount });
    }
};

export const sendPasswordRecoveryEmail = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};

// --------------------
// EMPLOYEES
// --------------------
export const getEmployeesByCompanyId = async (companyId: string): Promise<User[]> => {
    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[];
};

export const addEmployee = async (employee: Omit<User, 'id'>): Promise<User> => {
    const docRef = await addDoc(collection(db, 'users'), employee);
    return { id: docRef.id, ...employee };
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', employeeId));
};

// --------------------
// COOKS
// --------------------
export const getAllCooks = async (): Promise<User[]> => {
    const [snap1, snap2] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'Cocinero'))),
        getDocs(query(collection(db, 'users'), where('role', '==', 'cocinero'))),
    ]);
    return [...snap1.docs, ...snap2.docs].map(d => ({ id: d.id, ...d.data() })) as User[];
};

export const updateCook = async (cookId: string, data: Partial<User>): Promise<void> => {
    await updateDoc(doc(db, 'users', cookId), data);
};

export const resubmitForVerification = async (cookId: string): Promise<void> => {
    await updateDoc(doc(db, 'users', cookId), { verificationStatus: 'pendiente_verificacion' });
};

export const getSalesByCookId = async (cookId: string): Promise<Order[]> => {
    const q = query(collection(db, 'orders'), where('cookId', '==', cookId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
};

// --------------------
// MENU ITEMS
// --------------------
export const getMenuItemsByLocation = async (location: string): Promise<MenuItem[]> => {
    const q = query(
        collection(db, 'menuItems'),
        where('location', '==', location),
        orderBy('availableDate', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const docRef = await addDoc(collection(db, 'menuItems'), item);
    return { id: docRef.id, ...item };
};

export const updateMenuItem = async (itemId: string, data: Partial<MenuItem>): Promise<void> => {
    await updateDoc(doc(db, 'menuItems', itemId), data);
};

export const deleteMenuItem = async (itemId: string): Promise<void> => {
    await deleteDoc(doc(db, 'menuItems', itemId));
};

export const uploadProductImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

// --------------------
// REAL-TIME SUBSCRIPTIONS
// --------------------
export const subscribeToMenuItemsByLocation = (
    location: string,
    callback: (items: MenuItem[]) => void
): (() => void) => {
    const q = query(
        collection(db, 'menuItems'),
        where('location', '==', location),
        orderBy('availableDate', 'asc')
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[]);
    });
};

export const subscribeToMenuItemsByCook = (
    cookId: string,
    callback: (items: MenuItem[]) => void
): (() => void) => {
    const q = query(collection(db, 'menuItems'), where('cookId', '==', cookId));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[]);
    });
};

// --------------------
// ORDERS
// --------------------
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
};

export const addOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
    const docRef = await addDoc(collection(db, 'orders'), order);
    return { id: docRef.id, ...order };
};

export const sendOrderConfirmationEmail = async (order: Order, user: User): Promise<void> => {
    try {
        const cookEmail = order.items[0]?.menuItem?.cookId 
            ? (await findUserByEmail('')) // placeholder
            : null;

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Hungers <sales@hungers.lat>',
                to: [user.email],
                subject: `✅ Pedido confirmado #${order.id.slice(-6).toUpperCase()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2c5234;">¡Tu pedido está confirmado!</h1>
                        <p>Hola ${user.name},</p>
                        <p>Tu pedido <strong>#${order.id.slice(-6).toUpperCase()}</strong> ha sido recibido exitosamente.</p>
                        <h3>Detalle del pedido:</h3>
                        <ul>
                            ${order.items.map(item => `<li>${item.quantity}x ${item.menuItem.name} — $${item.menuItem.price * item.quantity}</li>`).join('')}
                        </ul>
                        <p><strong>Total: $${order.total.toLocaleString('es-CO')}</strong></p>
                        <p>¡Buen provecho!</p>
                        <p>El equipo de Hungers 🥗</p>
                    </div>
                `
            }),
        });
    } catch (error) {
        console.error('Error enviando email:', error);
    }
};

// --------------------
// RECURRING ORDERS
// --------------------
export const getRecurringOrdersByCompanyId = async (companyId: string): Promise<RecurringOrder[]> => {
    const q = query(collection(db, 'recurringOrders'), where('companyId', '==', companyId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as RecurringOrder[];
};

export const addRecurringOrder = async (order: Omit<RecurringOrder, 'id'>): Promise<RecurringOrder> => {
    const docRef = await addDoc(collection(db, 'recurringOrders'), order);
    return { id: docRef.id, ...order };
};

export const deleteRecurringOrder = async (orderId: string): Promise<void> => {
    await deleteDoc(doc(db, 'recurringOrders', orderId));
};

// --------------------
// COMPANIES
// --------------------
export const getAllCompanies = async (): Promise<Company[]> => {
    const snap = await getDocs(collection(db, 'companies'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Company[];
};

export const getCompanyById = async (companyId: string): Promise<Company | null> => {
    const snap = await getDoc(doc(db, 'companies', companyId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Company;
};

// --------------------
// INVOICES
// --------------------
export const getInvoicesByCompanyId = async (companyId: string): Promise<Invoice[]> => {
    const q = query(collection(db, 'invoices'), where('companyId', '==', companyId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Invoice[];
};

// --------------------
// PAYOUTS
// --------------------
export const getPayoutsByCookId = async (cookId: string): Promise<Payout[]> => {
    const q = query(collection(db, 'payouts'), where('cookId', '==', cookId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Payout[];
};

// --------------------
// COUPONS
// --------------------
export const getCoupons = async (): Promise<Coupon[]> => {
    const snap = await getDocs(collection(db, 'coupons'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Coupon[];
};

export const addCoupon = async (coupon: Omit<Coupon, 'id'>): Promise<Coupon> => {
    const docRef = await addDoc(collection(db, 'coupons'), coupon);
    return { id: docRef.id, ...coupon };
};

export const deleteCoupon = async (couponId: string): Promise<void> => {
    await deleteDoc(doc(db, 'coupons', couponId));
};

// --------------------
// CATEGORIES
// --------------------
export const getCategories = async (): Promise<Category[]> => {
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Category[];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
    const docRef = await addDoc(collection(db, 'categories'), category);
    return { id: docRef.id, ...category };
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    await deleteDoc(doc(db, 'categories', categoryId));
};

// --------------------
// CONTACT
// --------------------
export const addContactSubmission = async (submission: ContactSubmission): Promise<void> => {
    await addDoc(collection(db, 'contactSubmissions'), {
        ...submission,
        date: new Date().toISOString()
    });
};

// --------------------
export const getAllOrders = async (): Promise<Order[]> => {
    const snap = await getDocs(collection(db, 'orders'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
};

export const getMenuItemsByCookId = async (cookId: string): Promise<MenuItem[]> => {
    const q = query(collection(db, 'menuItems'), where('cookId', '==', cookId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
};

// --------------------
// SEED DATABASE
// --------------------
export const seedDatabase = async (): Promise<void> => {
    for (const item of mockMenuItems) {
        const { id, ...data } = item;
        await setDoc(doc(db, 'menuItems', id), data);
    }
};
export const approveCook = async (cookId: string): Promise<void> => {
    await updateDoc(doc(db, 'users', cookId), { verificationStatus: 'aprobado' });
};

export const rejectCook = async (cookId: string): Promise<void> => {
    await updateDoc(doc(db, 'users', cookId), { verificationStatus: 'rechazado' });
};

export const uploadInvoicePDF = async (companyId: string, file: File): Promise<string> => {
    const storageRef = ref(storage, `invoices/${companyId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const docRef = await addDoc(collection(db, 'invoices'), invoice);
    return { id: docRef.id, ...invoice };
};

export const getAllUsers = async (): Promise<User[]> => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[];
};