import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hungers.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT, -- 'client', 'company', 'cook'
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    name TEXT,
    description TEXT,
    address TEXT,
    image TEXT,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    category TEXT,
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    restaurant_id INTEGER,
    status TEXT, -- 'pending', 'preparing', 'delivered', 'cancelled'
    total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
  );
`);

// Seed Mock Data
const seedData = () => {
  const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  if (usersCount.count === 0) {
    // Create some users
    db.prepare("INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)").run("cliente@test.com", "123456", "Juan Cliente", "client", "3001112233");
    db.prepare("INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)").run("empresa@test.com", "123456", "Restaurante Central", "company", "3004445566");
    db.prepare("INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)").run("cocinero@test.com", "123456", "Chef Mario", "cook", "3007778899");

    // Create a restaurant
    const resInfo = db.prepare("INSERT INTO restaurants (owner_id, name, description, address, image) VALUES (?, ?, ?, ?, ?)").run(2, "Cocina de Origen", "Sabores auténticos de nuestra tierra con un toque moderno.", "Calle 100 #15-20, Bogotá", "https://picsum.photos/seed/res1/800/600");
    const restaurantId = resInfo.lastInsertRowid;

    // Create menu items
    db.prepare("INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)").run(restaurantId, "Almuerzo Ejecutivo", "Proteína a elección, arroz, ensalada, principio y jugo natural.", 18500, "https://picsum.photos/seed/food1/400/300", "Almuerzos");
    db.prepare("INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)").run(restaurantId, "Bowl Saludable", "Mix de verdes, quinoa, pollo a la plancha, aguacate y aderezo de la casa.", 22000, "https://picsum.photos/seed/food2/400/300", "Saludable");
    db.prepare("INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)").run(restaurantId, "Hamburguesa Artesanal", "Carne 100% res, queso cheddar, tocineta, cebolla caramelizada y papas.", 28000, "https://picsum.photos/seed/food3/400/300", "Rápida");
  }
};
seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development (MOVED TO TOP)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Simple Auth (Mock for now, but real DB)
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role, phone } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(email, password, name, role, phone);
      res.json({ id: info.lastInsertRowid, email, name, role });
    } catch (e) {
      res.status(400).json({ error: "User already exists or invalid data" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/restaurants", (req, res) => {
    const restaurants = db.prepare("SELECT * FROM restaurants").all();
    res.json(restaurants);
  });

  app.get("/api/restaurants/:id", (req, res) => {
    const restaurant = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  });

  app.get("/api/restaurants/:id/menu", (req, res) => {
    const menu = db.prepare("SELECT * FROM menu_items WHERE restaurant_id = ?").all(req.params.id);
    res.json(menu);
  });

  // Production static serving
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
