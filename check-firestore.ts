import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

async function checkFirestore() {
    console.log("Checking Firestore collections...");
    const collections = ['users', 'companies', 'menuItems', 'orders', 'recurringOrders'];
    
    for (const colName of collections) {
        try {
            const snap = await getDocs(collection(db, colName));
            console.log(`Collection '${colName}': ${snap.size} documents.`);
            if (snap.size > 0) {
                console.log(`  Sample ID: ${snap.docs[0].id}`);
            }
        } catch (e: any) {
            console.error(`Error checking '${colName}':`, e.message);
        }
    }
    process.exit(0);
}

checkFirestore();
