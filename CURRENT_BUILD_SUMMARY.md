# Multi-Channel Product Listing Platform — Current Build Summary

## 📌 1. Project Overview & Scope
The **Multi-Channel Product Listing Platform** is an enterprise-grade e-commerce catalog ingestion and marketplace publishing engine tailored for Indian D2C and multi-channel apparel sellers. 

The core design philosophy is **"Ingest Once, Publish Anywhere"**: sellers manage product catalogs in a canonical, channel-agnostic format, attach dynamic marketplace-specific attributes via normalized key-value extensions, validate listing readiness rules locally, and asynchronously publish listings to external marketplaces (initiated with **Flipkart Listing API v3**), complete with real-time batch tracking and race-safe background reconciliation.

---

## 🏛️ 2. System Architecture & Port Topology

The platform operates as a coordinated 3-tier architecture with an isolated mock marketplace service:

```
                          ┌─────────────────────────────────────┐
                          │    React (Vite) Seller Dashboard    │
                          │        Port 5174 (Tailwind CSS)     │
                          └──────────────────┬──────────────────┘
                                             │
                                             │ HTTP REST / JWT Bearer
                                             ▼
                          ┌─────────────────────────────────────┐
                          │    Main Listing Platform Backend    │
                          │       Port 8080 (Spring Boot)       │
                          └──────────┬────────────────┬─────────┘
                                     │                │
            JDBC / Flyway Migrations │                │ WebClient HTTP
                                     ▼                ▼
         ┌───────────────────────────────┐        ┌───────────────────────────────┐
         │      PostgreSQL Database      │        │     Mock Flipkart Service     │
         │     Port 5432 (listing_db)    │        │      Port 8081 (Tomcat)       │
         └───────────────────────────────┘        └───────────────────────────────┘
```

### Active Port Allocation & Safety
To prevent port collisions with other development projects on your machine:
* **Port `5173`**: Preserved untouched for existing external background tasks.
* **Port `5174`**: Dedicated to the React + Vite Frontend ([frontend/vite.config.js](file:///d:/ecommerce/frontend/vite.config.js)).
* **Port `8080`**: Main Spring Boot Listing Platform application.
* **Port `8081`**: Mock Flipkart Marketplace API service.
* **Port `5432`**: PostgreSQL Database (`listing_platform_db`).

---

## 🔑 3. Architectural Highlights Built

### 1. Canonical Schema vs. Channel Extension (Adapter Pattern)
* Core catalog fields (`title`, `description`, `brand`, `category`, `mrp`, `selling_price`, `stock`, dimensions `length`, `breadth`, `height`, `weight`) reside strictly in the canonical `products` table.
* Marketplace-specific attributes (e.g., Flipkart's `hsn`, `procurement_type`, `shipping_provider`) are stored in `product_channel_extensions`.
* **Benefit**: Adding future channels (Amazon, Myntra, Meesho) requires **zero database schema migrations**.

### 2. Pre-Publish Multi-Stage Validation Engine
* Before any external HTTP request is made to a marketplace, products pass through local rule verification in [ChannelService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/ChannelService.java).
* Checks include:
  1. Mandatory canonical attributes (`title`, `brand`, `selling_price > 0`, `mrp >= selling_price`).
  2. Mandatory channel extension keys defined dynamically in `channel_required_fields`.
  3. Image constraints (minimum 1 image, min dimensions 500x500px).
* Any failed constraint produces actionable error messages without hitting external rate limits.

### 3. Asynchronous Batch Publishing & Self-Healing Reconciliation
* Channel publishing is asynchronous via [AsyncPublishService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/AsyncPublishService.java).
* When a seller clicks **"Publish to Flipkart"**, a unique `batch_id` (UUID) is generated, persisted in `publish_batches`, and returned immediately to the frontend.
* The frontend polls `/api/products/publish-status/{batchId}` for live progress.
* **Batch Reconciliation Job** ([BatchReconciliationJob.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/BatchReconciliationJob.java)): A scheduled background process automatically discovers stuck or orphaned batches (`PENDING` or `IN_PROGRESS` older than 5 minutes) and reconciles their statuses safely.

### 4. Binary Magic-Byte & Dimension Image Validation
* In [ProductImageService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/image/ProductImageService.java), uploaded files undergo:
  1. File-type verification via raw magic bytes (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG) to stop disguised executable uploads.
  2. Image decoding using `ImageIO` to enforce minimum 500x500px resolution.
  3. Per-product image threshold enforcement (maximum 8 images).

### 5. Multi-Tenant Seller Isolation & Security
* Security handled by [JwtAuthFilter.java](file:///d:/ecommerce/src/main/java/com/listingplatform/seller/JwtAuthFilter.java) with stateless JWT tokens.
* [ProductAccessService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/product/ProductAccessService.java) validates product ownership on every operation to prevent Insecure Direct Object References (IDOR).
* SKUs are scoped per seller via `CONSTRAINT uq_seller_sku UNIQUE (seller_id, sku)`.

---

## 💻 4. Detailed Component Breakdown

### A. Main Backend (`listing-platform`)
Located in [src/main/java/com/listingplatform](file:///d:/ecommerce/src/main/java/com/listingplatform):

1. **Authentication & Identity (`seller/`)**:
   * [AuthController.java](file:///d:/ecommerce/src/main/java/com/listingplatform/seller/AuthController.java) & [AuthService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/seller/AuthService.java): Seller signup and login with BCrypt password hashing.
   * [JwtUtils.java](file:///d:/ecommerce/src/main/java/com/listingplatform/seller/JwtUtils.java): Token signing and verification.
2. **Product Catalog (`product/`)**:
   * [ProductController.java](file:///d:/ecommerce/src/main/java/com/listingplatform/product/ProductController.java) & [ProductService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/product/ProductService.java): Paginated listing, full-text category and title search, row-level transactional bulk CSV parsing.
   * [Product.java](file:///d:/ecommerce/src/main/java/com/listingplatform/product/Product.java): Entity with `@Version` optimistic locking and `BigDecimal` financial precision.
3. **Image Subsystem (`image/`)**:
   * [ProductImageController.java](file:///d:/ecommerce/src/main/java/com/listingplatform/image/ProductImageController.java) & [ProductImageService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/image/ProductImageService.java): Magic byte and dimension validation, unique disk storage under `uploads/{productId}/`.
4. **Marketplace Channel Engine (`channel/`)**:
   * [ChannelController.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/ChannelController.java): Extension field upserting, pre-validation checks, asynchronous batch publish trigger, and batch polling.
   * [FlipkartMapper.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/flipkart/FlipkartMapper.java): Pure mapping function converting internal canonical products to Flipkart Listing API v3 payload format.
   * [FlipkartAdapter.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/flipkart/FlipkartAdapter.java): Reactive WebClient communicating with the mock Flipkart service.
   * [BatchReconciliationJob.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/BatchReconciliationJob.java): `@Scheduled` job recovering stuck batches.

---

### B. Mock Flipkart Service (`mock-flipkart-service`)
Located in [mock-flipkart-service](file:///d:/ecommerce/mock-flipkart-service):
* Standalone Spring Boot application running on port **8081**.
* Exposes `POST /flipkart/listings` adhering to Flipkart API v3 contract.
* Simulates real-world marketplace behavior:
  * ~85% approval rate with generated `listing_id` and status `PUBLISHED`.
  * ~15% rejection rate with marketplace error codes (e.g., `ERR_HSN_INVALID`, `ERR_DIMENSION_MISMATCH`).

---

### C. React Seller Dashboard (`frontend`)
Located in [frontend](file:///d:/ecommerce/frontend):
* **Technology**: React 18, Vite, Tailwind CSS.
* **Key Components**:
  1. [Navbar.jsx](file:///d:/ecommerce/frontend/src/components/Navbar.jsx): Seller profile, authentication state, and session controls.
  2. [ProductLedgerTable.jsx](file:///d:/ecommerce/frontend/src/components/ProductLedgerTable.jsx): Master table featuring SKU, title, pricing, stock, readiness badges, and action triggers.
  3. [ProductDetailModal.jsx](file:///d:/ecommerce/frontend/src/components/ProductDetailModal.jsx): Multi-tab product inspector:
     * *Overview*: Core specifications, dimensions, and pricing.
     * *Images*: Drag-and-drop uploader with live preview and dimension indicator.
     * *Channel Fields*: Interactive form for Flipkart attributes (`hsn`, `procurement_type`, etc.).
     * *Readiness & Publish*: Live pre-validation report and 1-click publishing.
  4. [BulkUploadModal.jsx](file:///d:/ecommerce/frontend/src/components/BulkUploadModal.jsx): Drag-and-drop CSV importer with downloadable sample CSV template and detailed error reports.
  5. [StatusStamp.jsx](file:///d:/ecommerce/frontend/src/components/StatusStamp.jsx): Status pill indicators (`DRAFT`, `VALIDATED`, `PUBLISHED`, `FAILED`).
  6. [api.js](file:///d:/ecommerce/frontend/src/services/api.js): Centralized API client utilizing in-memory token storage (mitigating XSS/token extraction risks).

---

## 🗄️ 5. Database Schema & Flyway Migrations

* **Migration V1** ([V1__init_schema.sql](file:///d:/ecommerce/src/main/resources/db/migration/V1__init_schema.sql)):
  * `sellers`: User credentials and business identities.
  * `products`: Canonical product catalog with dimensional attributes and optimistic lock versioning.
  * `product_images`: Image URLs, display orders, and validated pixel dimensions.
  * `product_channel_extensions`: EAV extension table for channel-specific keys and values.
  * `channel_required_fields`: Rules matrix defining mandatory fields per channel and category.
  * `listing_status`: Synchronization history, error messages, and marketplace timestamps.

* **Migration V2** ([V2__publish_batches.sql](file:///d:/ecommerce/src/main/resources/db/migration/V2__publish_batches.sql)):
  * `publish_batches`: Tracks UUID batch lifecycle (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`), completed counts, total items, and error messages.
  * `listing_status.batch_id`: Foreign link to the associated batch.

---

## 🚀 6. How to Start and Verify the System

### Running Services
1. **Mock Flipkart Service** (Port 8081):
   ```powershell
   cd d:\ecommerce\mock-flipkart-service
   mvn spring-boot:run
   ```
2. **Main Listing Platform** (Port 8080):
   ```powershell
   cd d:\ecommerce
   mvn spring-boot:run
   ```
3. **Frontend Dashboard** (Port 5174):
   ```powershell
   cd d:\ecommerce\frontend
   npm run dev
   ```
*(Alternatively, execute [start-all.bat](file:///d:/ecommerce/start-all.bat) which automates the sequence).*

### Quick Verification Checklist
* [x] **Frontend Access**: Open [http://localhost:5174](http://localhost:5174) in your browser.
* [x] **Backend Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health) returns `{"status":"UP"}`.
* [x] **API Documentation (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).
* [x] **Mock Marketplace Status**: [http://localhost:8081](http://localhost:8081) listening on port 8081.
* [x] **Port Isolation**: External task on port 5173 remains untouched.
