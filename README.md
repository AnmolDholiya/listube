# Multi-Channel Product Listing Platform

A high-performance e-commerce catalog ingestion and marketplace publishing platform for Indian D2C and apparel sellers. The system enables sellers to ingest product catalogs once in a canonical, channel-agnostic format, validate marketplace readiness rules locally, and asynchronously publish listings to Flipkart Listing API v3 with real-time batch polling and race-safe background reconciliation.

---

## 🏛️ Architectural Decisions & Rationale

1. **Canonical Schema Separated from Channel-Specific Data (Adapter Pattern)**
   - *Why*: Direct marketplace columns (e.g. `hsn`, `procurement_type`, `shipping_provider`) are intentionally excluded from the core `products` table. All channel attributes are stored in a normalized key-value extension table (`product_channel_extensions`).
   - *Advantage*: Adding future channels (Amazon, Myntra, Meesho) requires zero database schema migrations or core product table mutations.

2. **Flipkart-First Prototype Scope**
   - *Why*: Channel adapter logic (`FlipkartMapper`, `FlipkartAdapter`) and validation rules are encapsulated behind pure mapping functions and modular service boundaries, providing full end-to-end integration without premature multi-marketplace complexity.

3. **Asynchronous Publish Engine with Dedicated Bounded Thread Pool**
   - *Why*: Synchronous HTTP calls to marketplace APIs during bulk publishing cause thread starvation, high latency, and request timeouts.
   - *Implementation*: Uses a dedicated `ThreadPoolTaskExecutor` bean (`publishExecutor`, core=4, max=8, queue=50) invoked via a dedicated `@Async` service bean (`AsyncPublishService`) to prevent self-invocation proxy bypass.

4. **Upsert-Safe Status Updates & Batch Tracking**
   - *Why*: Batch operations tag every product outcome with a `batch_id` in `listing_status`, allowing callers to poll batch progress live via `GET /api/products/publish-status/{batchId}` without auxiliary join tables.

5. **Centralized Ownership Security Enforcement**
   - *Why*: All catalog read, write, upload, and publish actions enforce strict seller-level data isolation through `ProductAccessService`. Monospaced SKUs are constrained as unique per seller (`CONSTRAINT uq_seller_sku UNIQUE (seller_id, sku)`).

6. **Race-Safe Scheduled Reconciliation with Optimistic Concurrency Control**
   - *Why*: If a worker fails or terminates mid-batch, background `BatchReconciliationJob` scans for stale batches (`> 10 mins old`). It updates state strictly through JPA-managed entities governed by `@Version`. If an async worker completes concurrently, the job catches `OptimisticLockException`, backs off cleanly, and avoids overwriting successful completions.

---

## 🚫 Out of Scope for this Prototype

The following features were deliberately scoped out of this prototype to prioritize high-fidelity catalog ingestion, image validation, and async publishing:

1. **Order Ingestion & Fulfillment**: No checkout, cart, customer orders, or payment gateway integration. The platform's scope is strictly catalog ingestion and marketplace publishing.
2. **Real-Time Stock Decrement / Inventory Sync**: Real-time multi-channel inventory locking and decrement callbacks are omitted.
3. **Additional Marketplaces (Amazon SP-API, Myntra, Meesho)**: While the canonical schema and extension tables fully support new channels, only the Flipkart channel adapter is implemented in this prototype.

---

## 🚀 Setup & Launch Instructions

### Prerequisites
- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+ & npm**
- **PostgreSQL 14+** running on `localhost:5432` with database `listing_platform_db` (username: `postgres`, password: `your_password` in `application.properties`)

---

### Automated Launch (All 3 Services)

#### Windows:
```cmd
.\start-all.bat
```

#### macOS / Linux:
```bash
chmod +x ./start-all.sh
./start-all.sh
```

---

### Manual Individual Service Launch

1. **Main Listing Platform Backend** (Port `8080`):
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **React Seller Dashboard Frontend** (Port `5174`):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🚀 Cloud Deployment

### 1. Backend Deployment (Render - Docker Web Service)
Render does not offer a native Java runtime, so it runs Spring Boot via the included multi-stage `Dockerfile`:

* **Platform**: [Render.com](https://render.com) -> **New Web Service** -> Connect `listube` repo
* **Root Directory**: `backend`
* **Runtime**: **Docker** (Render will automatically detect `backend/Dockerfile`)
* **Instance Type**: Free / Starter
* **Environment Variables** (from [backend/.env.example](file:///d:/ecommerce/backend/.env.example)):
  - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://db.<PROJECT-REF>.supabase.co:5432/postgres?sslmode=require`
  - `SPRING_DATASOURCE_USERNAME`: `postgres`
  - `SPRING_DATASOURCE_PASSWORD`: `<your-supabase-db-password>`
  - `SPRING_FLYWAY_ENABLED`: `false`
  - `SUPABASE_URL`: `https://<PROJECT-REF>.supabase.co`
  - `JWT_SECRET`: `<your-jwt-secret>`

*(Render automatically injects the `PORT` environment variable, which the application and Dockerfile bind to dynamically).*

---

### 2. Frontend Deployment (Vercel, Netlify, or Cloudflare Pages)
Deploy directly as a fast static React application:

* **Platform**: [Vercel.com](https://vercel.com) / Netlify
* **Root Directory**: `frontend`
* **Framework Preset**: Vite
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variable**:
  - `VITE_API_BASE_URL`: `https://<your-deployed-backend-url>` (e.g., `https://ecommerce-backend.onrender.com`)

---

## 📡 Service & Documentation URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Seller Dashboard (Frontend)** | [http://localhost:5173](http://localhost:5173) | Vite + React Seller Ledger Dashboard |
| **Main Platform API** | [http://localhost:8080](http://localhost:8080) | Spring Boot REST Backend |
| **Swagger UI / OpenAPI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API documentation with full schemas |
| **Mock Flipkart Service** | [http://localhost:8081](http://localhost:8081) | Mock Flipkart Listing API v3 |
