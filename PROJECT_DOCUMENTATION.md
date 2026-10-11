# Multi-Channel Product Listing Platform — Master Project Documentation

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Core Value Proposition](#2-problem-statement--core-value-proposition)
3. [System Architecture & Port Topology](#3-system-architecture--port-topology)
4. [Core Architectural Design Patterns](#4-core-architectural-design-patterns)
5. [Database Architecture & Migrations](#5-database-architecture--migrations)
6. [Feature Breakdown & Module Implementation](#6-feature-breakdown--module-implementation)
   - [6.1 Authentication & Multi-Tenant Security](#61-authentication--multi-tenant-security)
   - [6.2 Canonical Product Catalog & Bulk Ingestion](#62-canonical-product-catalog--bulk-ingestion)
   - [6.3 Binary Magic-Byte & Dimension Image Pipeline](#63-binary-magic-byte--dimension-image-pipeline)
   - [6.4 Dynamic Channel Extensions (EAV Architecture)](#64-dynamic-channel-extensions-eav-architecture)
   - [6.5 Pre-Publish Multi-Stage Validation Engine](#65-pre-publish-multi-stage-validation-engine)
   - [6.6 Asynchronous Batch Publishing & Status Tracking](#66-asynchronous-batch-publishing--status-tracking)
   - [6.7 Self-Healing Batch Reconciliation Background Job](#67-self-healing-batch-reconciliation-background-job)
   - [6.8 Inbound Order Webhooks & Cross-Channel Inventory Sync](#68-inbound-order-webhooks--cross-channel-inventory-sync)
   - [6.9 React Seller Dashboard Frontend](#69-react-seller-dashboard-frontend)
   - [6.10 Mock Marketplace Microservices (Flipkart & Amazon)](#610-mock-marketplace-microservices-flipkart--amazon)
7. [Comprehensive REST API Reference](#7-comprehensive-rest-api-reference)
8. [End-to-End Data Flow Diagrams](#8-end-to-end-data-flow-diagrams)
9. [Project Directory & File Structure](#9-project-directory--file-structure)
10. [Step-by-Step Installation & Run Guide](#10-step-by-step-installation--run-guide)
11. [Verification & Presentation Walkthrough](#11-verification--presentation-walkthrough)

---

## 1. Executive Summary

The **Multi-Channel Product Listing Platform** is an enterprise-grade e-commerce catalog ingestion, transformation, and marketplace publishing platform designed for multi-channel and D2C brands.

Built as a high-performance **Modular Monolith** in **Spring Boot 3.3.2** with a modern **React 18 (Vite + Tailwind CSS)** seller dashboard, the platform enables sellers to manage their entire inventory centrally in a canonical format, enrich products with marketplace-specific metadata, validate listing readiness locally, and asynchronously publish products to external marketplaces such as **Flipkart** and **Amazon**, while synchronizing stock in real time across channels via inbound webhooks.

---

## 2. Problem Statement & Core Value Proposition

### The Problem
E-commerce sellers selling across Flipkart, Amazon, Myntra, and Meesho face significant friction:
* **Fragmented Schemas**: Every marketplace enforces distinct schemas, validation rules, taxonomies, and mandatory attributes (e.g., Flipkart requires `hsn` and `procurement_type`, while Amazon requires `standard_product_id_type` and `bullet_points`).
* **High Rate of Rejections**: Submitting invalid catalogs directly to marketplaces triggers rate limits, delays, and complex error resolution cycles.
* **Inventory Desynchronization**: Selling an item on one marketplace risks overselling on another if stock is not immediately adjusted across all active channels.
* **Catalog Duplication**: Maintaining separate spreadsheets or listings for each marketplace creates immense operational overhead.

### The Solution: "Ingest Once, Publish Anywhere"
1. **Canonical Catalog Ingestion**: Sellers upload their core product attributes once via web UI or bulk CSV.
2. **Channel-Agnostic Extensibility**: Marketplace-specific attributes are dynamically mapped using an EAV (Entity-Attribute-Value) extension layer without altering database schemas.
3. **Local Pre-Publish Verification**: Products undergo deep validation (image dimensions, required fields, business constraints) locally before hitting external endpoints.
4. **Asynchronous Batch Publishing**: Batches are processed in background worker threads with real-time polling and self-healing reconciliation.
5. **Real-Time Cross-Channel Stock Sync**: Inbound webhooks process orders and automatically propagate updated stock quantities to all active marketplace channels.

---

## 3. System Architecture & Port Topology

The platform operates as a coordinated 4-service ecosystem with PostgreSQL as the relational persistence tier:

```
                            ┌───────────────────────────────────────────┐
                            │       React 18 + Vite Seller Dashboard    │
                            │           Port 5174 (Tailwind CSS)        │
                            └─────────────────────┬─────────────────────┘
                                                  │
                                                  │ HTTP REST (JWT Bearer Token)
                                                  ▼
                            ┌───────────────────────────────────────────┐
                            │       Main Listing Platform Backend       │
                            │          Port 8080 (Spring Boot)          │
                            └───────┬─────────────┬─────────────┬───────┘
                                    │             │             │
        PostgreSQL JDBC / Flyway    │             │ WebClient   │ WebClient
                                    ▼             │             ▼
    ┌──────────────────────────────────┐          │    ┌──────────────────────────────────┐
    │       PostgreSQL Database        │          │    │      Mock Amazon Service         │
    │      Port 5432 (listing_db)      │          │    │       Port 8082 (Tomcat)         │
    └──────────────────────────────────┘          │    └──────────────────────────────────┘
                                                  ▼
                                       ┌──────────────────────────────────┐
                                       │      Mock Flipkart Service       │
                                       │       Port 8081 (Tomcat)         │
                                       └──────────────────────────────────┘
```

### Port Allocation
| Service / Component | Port | Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **React Seller Dashboard** | `5174` | React 18, Vite, Tailwind CSS | Web UI for sellers |
| **Main Listing Platform** | `8080` | Spring Boot 3.3.2, Java 17 | Core business logic, APIs, background jobs |
| **Mock Flipkart Service** | `8081` | Spring Boot (Standalone) | Flipkart Listing API v3 mock & inventory sink |
| **Mock Amazon Service** | `8082` | Spring Boot (Standalone) | Amazon SP-API mock & inventory sink |
| **PostgreSQL Database** | `5432` | PostgreSQL 15+ | Relational persistence & Flyway schema management |

---

## 4. Core Architectural Design Patterns

```
   ┌──────────────────────────────────────────────────────────────────────────────────┐
   │                          ARCHITECTURAL PATTERNS MATRIX                           │
   ├──────────────────────────────┬───────────────────────────────────────────────────┤
   │ Pattern                      │ Concrete Implementation in Codebase               │
   ├──────────────────────────────┼───────────────────────────────────────────────────┤
   │ Adapter Pattern              │ FlipkartAdapter, AmazonAdapter                    │
   │ Mapper Pattern (Pure DTO)    │ FlipkartMapper                                    │
   │ EAV (Extension Layer)        │ ProductChannelExtension & ChannelRequiredField    │
   │ Asynchronous Task Queue      │ AsyncPublishService with @Async & TaskExecutor   │
   │ Optimistic Concurrency Lock  │ JPA @Version on Product and PublishBatch entities │
   │ Publisher-Subscriber (EDA)   │ ApplicationEventPublisher -> InventorySyncListener│
   │ Idempotent Reconciliation    │ BatchReconciliationJob with status recovery       │
   │ Multi-Tenant Guard (IDOR)    │ ProductAccessService seller ownership validation  │
   │ Secure Binary Magic Bytes    │ ProductImageService in-memory stream inspection   │
   └──────────────────────────────┴───────────────────────────────────────────────────┘
```

1. **Adapter Pattern**: Decouples marketplace integration protocols from core business logic (`FlipkartAdapter`, `AmazonAdapter`).
2. **Pure Data Mapping**: Maps internal entities to external API contracts cleanly (`FlipkartMapper`).
3. **EAV Schema Isolation**: Preserves canonical catalog purity while allowing arbitrary marketplace fields.
4. **Event-Driven Architecture (EDA)**: Order decrement events trigger Spring Application Events (`InventoryChangedEvent`) to broadcast stock updates across all connected marketplace adapters.
5. **Self-Healing Background Jobs**: Scheduled tasks discover stuck batches and reconcile their statuses automatically.

---

## 5. Database Architecture & Migrations

Database evolution is managed sequentially through **Flyway**:

```
 [V1__init_schema.sql] ──► [V2__publish_batches.sql] ──► [V3__publish_batches_version.sql]
```

### Entity Relationship Diagram (ERD)

```
 ┌───────────────────────────────┐
 │            sellers            │
 ├───────────────────────────────┤
 │ id (PK, BIGSERIAL)            │
 │ business_name (VARCHAR)       │
 │ email (VARCHAR, UNIQUE)       │
 │ password_hash (VARCHAR)       │
 │ created_at (TIMESTAMP)        │
 └──────────────┬────────────────┘
                │ 1
                │
                │ N
 ┌──────────────▼─────────────────────────────────────────────────────────────┐
 │                                  products                                  │
 ├────────────────────────────────────────────────────────────────────────────┤
 │ id (PK, BIGSERIAL)                                                         │
 │ seller_id (FK -> sellers.id)                                               │
 │ sku (VARCHAR)  ───► [UNIQUE(seller_id, sku)]                               │
 │ title (VARCHAR), description (TEXT), category (VARCHAR), brand (VARCHAR)   │
 │ mrp (NUMERIC 10,2), selling_price (NUMERIC 10,2)                           │
 │ stock (INT)                                                                │
 │ length_cm (NUMERIC), breadth_cm (NUMERIC), height_cm (NUMERIC), weight_kg  │
 │ version (BIGINT, @Version)                                                 │
 │ created_at (TIMESTAMP), updated_at (TIMESTAMP)                             │
 └───────┬──────────────────────────┬───────────────────────────┬─────────────┘
         │ 1                        │ 1                         │ 1
         │                          │                           │
         │ N                        │ N                         │ N
 ┌───────▼───────────────┐  ┌───────▼──────────────────────┐  ┌─▼───────────────────────────┐
 │    product_images     │  │ product_channel_extensions   │  │       listing_status        │
 ├───────────────────────┤  ├──────────────────────────────┤  ├─────────────────────────────┤
 │ id (PK, BIGSERIAL)    │  │ id (PK, BIGSERIAL)           │  │ id (PK, BIGSERIAL)          │
 │ product_id (FK)       │  │ product_id (FK)              │  │ product_id (FK)             │
 │ image_url (VARCHAR)   │  │ channel (VARCHAR)            │  │ channel (VARCHAR)           │
 │ display_order (INT)   │  │ field_key (VARCHAR)          │  │ status (VARCHAR)            │
 │ width_px (INT)        │  │ field_value (TEXT)           │  │ error_message (TEXT)        │
 │ height_px (INT)       │  │ [UNIQUE(prod, chan, key)]    │  │ batch_id (FK -> batches.id) │
 │ created_at (TIMESTAMP)│  └──────────────────────────────┘  │ last_synced_at (TIMESTAMP)  │
 └───────────────────────┘                                    └──────────────▲──────────────┘
                                                                             │ N
                                                                             │ 1
 ┌───────────────────────────────────────────────────────────────────────────┴──────────────┐
 │                                     publish_batches                                      │
 ├──────────────────────────────────────────────────────────────────────────────────────────┤
 │ id (PK, VARCHAR UUID)                                                                    │
 │ seller_id (FK -> sellers.id)                                                             │
 │ channel (VARCHAR)                                                                        │
 │ status (VARCHAR: PENDING, IN_PROGRESS, COMPLETED, FAILED)                                │
 │ total_items (INT), completed_items (INT), successful_items (INT), failed_items (INT)     │
 │ error_message (TEXT), version (BIGINT, @Version)                                         │
 │ created_at (TIMESTAMP), updated_at (TIMESTAMP)                                           │
 └──────────────────────────────────────────────────────────────────────────────────────────┘

 ┌───────────────────────────────────────────────┐
 │            channel_required_fields            │
 ├───────────────────────────────────────────────┤
 │ id (PK, BIGSERIAL)                            │
 │ channel (VARCHAR: FLIPKART, AMAZON)           │
 │ category (VARCHAR: Clothing, Footwear, etc.)  │
 │ required_field (VARCHAR: hsn, procurement...) │
 └───────────────────────────────────────────────┘
```

---

## 6. Feature Breakdown & Module Implementation

### 6.1 Authentication & Multi-Tenant Security
* **Stateless JWT Flow**: Authenticates requests using `JwtAuthFilter` reading the `Authorization: Bearer <token>` header.
* **BCrypt Hashing**: Passwords are encrypted before database insertion.
* **IDOR Protection (`ProductAccessService`)**: Validates that every product ID accessed via API belongs to the authenticated seller (`seller_id`).
* **Multi-Tenant SKU Isolation**: Database uniqueness is enforced per seller (`CONSTRAINT uq_seller_sku UNIQUE (seller_id, sku)`), allowing multiple sellers to maintain their own SKU numbering schemes independently.

### 6.2 Canonical Product Catalog & Bulk Ingestion
* **High-Precision Pricing**: Currency fields use `BigDecimal` / `NUMERIC(10,2)` to prevent floating-point rounding anomalies.
* **Optimistic Locking**: `@Version` column prevents race conditions during concurrent modifications.
* **Bulk CSV Engine (`ProductService.processBulkCsv`)**:
  * Ingests thousands of SKUs in a single stream.
  * Validates row headers, required columns, numeric formats, and business constraints (`selling_price <= mrp`, dimensions > 0).
  * Returns detailed row-level error reports with exact line numbers and error descriptions without aborting valid rows.
  * Sample CSV template available directly through the seller UI.

### 6.3 Binary Magic-Byte & Dimension Image Pipeline
* **Security Inspection**: Uploaded images are checked in-memory for binary magic bytes:
  * JPEG: `FF D8 FF`
  * PNG: `89 50 4E 47`
  * Rejects disguised executables, scripts, or non-image payloads.
* **Dimension Rule Enforcement**: Uses `ImageIO.read` in-memory to verify minimum resolution of `500x500` pixels.
* **Thresholds & Storage**:
  * Maximum 8 images per product.
  * Stored on disk under `uploads/{productId}/{uuid}.{ext}` and served via Spring Resource Handlers.

### 6.4 Dynamic Channel Extensions (EAV Architecture)
* **Zero-Migration Channel Support**: Attributes required by specific marketplaces are stored as key-value pairs in `product_channel_extensions`.
* **Configurable Rules Matrix**: `channel_required_fields` defines required fields per channel and category (e.g., `FLIPKART` + `Clothing` requires `hsn`, `procurement_type`, `shipping_provider`).
* **Upsert Semantics**: Supports dynamic updates and additions without requiring DDL alterations.

### 6.5 Pre-Publish Multi-Stage Validation Engine
Before any external API call is initiated, products pass through local rule validation:
1. **Canonical Attributes**: Checks `title`, `brand`, `selling_price > 0`, `mrp >= selling_price`, dimensions (`length`, `breadth`, `height`, `weight`).
2. **Channel-Specific Extensions**: Matches extension records against `channel_required_fields` for the product's category.
3. **Image Constraints**: Ensures at least 1 image uploaded meeting dimension criteria.
4. **Actionable Feedback**: Returns structured missing field lists, preventing unnecessary external marketplace rate-limit consumption.

### 6.6 Asynchronous Batch Publishing & Status Tracking
* **Non-Blocking Architecture**: When publishing a single product or batch of products, `ChannelController` delegates to `AsyncPublishService` (`@Async`).
* **Immediate Batch Token**: Returns a unique `batchId` (UUID) within milliseconds.
* **Status Polling Endpoint**: `/api/products/publish-status/{batchId}` returns real-time batch statistics (`totalItems`, `completedItems`, `successfulItems`, `failedItems`, `status`).
* **Atomic Batch Updates (`PublishBatchUpdateService`)**: Employs `@Transactional(REQUIRES_NEW)` to record item-by-item progress safely without rollbacks affecting batch progress.

### 6.7 Self-Healing Batch Reconciliation Background Job
* **Automated Failure Recovery (`BatchReconciliationJob`)**: Runs every 2 minutes (`@Scheduled`).
* **Orphan Batch Discovery**: Locates batches stuck in `PENDING` or `IN_PROGRESS` for longer than 5 minutes (e.g., due to JVM crash or network timeout).
* **Automated Recovery**: Re-evaluates item states from `listing_status` and transitions the batch to `COMPLETED` or `FAILED` with descriptive reconciliation logs.

### 6.8 Inbound Order Webhooks & Cross-Channel Inventory Sync
* **Secure Webhook Ingestion (`OrderWebhookController`)**:
  * Listens on `POST /api/webhooks/flipkart/order`.
  * Verifies `X-Webhook-Secret` header to reject unauthorized requests.
* **Atomic Stock Decrement (`OrderService`)**:
  * Decrements product stock under JPA optimistic locking.
  * Throws `InsufficientStockException` if stock is exhausted.
* **Cross-Channel Event Broadcast (`InventorySyncListener`)**:
  * Listens for `InventoryChangedEvent`.
  * Asynchronously invokes `AmazonAdapter` and `FlipkartAdapter` stock update APIs (`POST /amazon/inventory/update`, `POST /flipkart/inventory/update`).
  * Prevents overselling across connected channels automatically.

### 6.9 React Seller Dashboard Frontend
* **Dark Glassmorphism Theme**: Built with Tailwind CSS, featuring backdrop blur, glowing borders, and smooth transitions.
* **Product Ledger Table**: Displays SKU, image preview, title, stock, pricing, readiness badges, and action triggers.
* **Multi-Tab Product Detail Modal**:
  1. *Overview*: Product specifications, dimensions, pricing.
  2. *Images*: Multi-image drag-and-drop uploader with live preview, resolution badge, and deletion.
  3. *Channel Fields*: Interactive form for Flipkart/Amazon specific attributes.
  4. *Readiness & Publish*: Live pre-validation check and 1-click batch publishing with live progress animation.
* **Bulk CSV Importer**: Drag-and-drop file ingestion modal with live progress, downloadable sample CSV, and row-level error tables.
* **In-Memory JWT Storage**: Mitigates XSS token theft risks by storing auth tokens in memory rather than local storage.

### 6.10 Flipkart Self-Access Sandbox & Marketplace Integration
* **Flipkart Self-Access Architecture**:
  * Authenticates as a single seller using the official Flipkart Self-Access OAuth flow (`grant_type=client_credentials`, `scope=Seller_Api`).
  * Managed via [FlipkartTokenService.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/flipkart/FlipkartTokenService.java), which handles thread-safe token acquisition, in-memory caching, and automatic token refresh upon expiry.
  * Encapsulated configuration in [FlipkartConfig.java](file:///d:/ecommerce/src/main/java/com/listingplatform/channel/flipkart/FlipkartConfig.java) with strict sandbox safety guards.
  * Zero exposure of client secrets or access tokens in logs, frontend, or git repositories.
* **Flipkart Adapter Modes**:
  * **SANDBOX Mode (`flipkart.mode=SANDBOX`)**: Dispatches listings and inventory updates directly to the official Flipkart Sandbox API (`https://sandbox-api.flipkart.net`) with bearer token authentication.
  * **MOCK Mode (`flipkart.mode=MOCK`)**: Seamless fallback to the local mock service on port 8081 for offline development and CI environments.
* **Mock Marketplace Microservices**:
  * **Mock Flipkart Service (Port 8081)**: Simulates Flipkart Listing API v3 with ~85% approval and ~15% simulated business rejections.
  * **Mock Amazon Service (Port 8082)**: Simulates Amazon SP-API catalog feeds and real-time inventory updates.


---

## 7. Comprehensive REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new seller account | `{"businessName":"...","email":"...","password":"..."}` | `{"token":"...","email":"...","businessName":"..."}` |
| `POST` | `/api/auth/login` | Authenticate seller & obtain JWT | `{"email":"...","password":"..."}` | `{"token":"...","email":"...","businessName":"..."}` |

### 📦 Product Management (`/api/products`)
| Method | Endpoint | Description | Query / Path Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Paginated product list for authenticated seller | `page=0&size=20&search=...&category=...` | `Page<ProductDTO>` |
| `GET` | `/api/products/{id}` | Get single product details | `id` (Long) | `ProductDTO` |
| `POST` | `/api/products` | Create a single product | `ProductCreateDTO` | `ProductDTO` |
| `PUT` | `/api/products/{id}` | Update product core fields | `id` (Long), `ProductUpdateDTO` | `ProductDTO` |
| `DELETE` | `/api/products/{id}` | Delete product and associated records | `id` (Long) | `204 No Content` |
| `POST` | `/api/products/bulk-upload` | Upload CSV catalog | Multipart `file` | `{"totalRows":10,"successCount":8,"errorCount":2,"errors":[...]}` |

### 🖼️ Product Images (`/api/products/{productId}/images`)
| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/products/{productId}/images` | Upload image (magic byte & dimension validated) | Multipart `file` | `ProductImageDTO` |
| `DELETE` | `/api/products/{productId}/images/{imageId}` | Delete image | Path IDs | `204 No Content` |

### ⚙️ Channel Extensions & Validation (`/api/products/{productId}`)
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products/{productId}/channel-fields/{channel}` | Get channel extension attributes | Channel (`FLIPKART`, `AMAZON`) | `Map<String, String>` |
| `POST` | `/api/products/{productId}/channel-fields/{channel}` | Upsert channel extension attributes | `{"hsn":"61091000","procurement_type":"REGULAR"}` | `Map<String, String>` |
| `GET` | `/api/products/{productId}/validate/{channel}` | Run pre-publish validation rules | Channel (`FLIPKART`, `AMAZON`) | `{"valid":true,"errors":[],"missingFields":[]}` |

### 🚀 Asynchronous Batch Publishing (`/api/products/publish`)
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/products/publish/{channel}` | Trigger async batch publish | `{"productIds":[1, 2, 3]}` | `{"batchId":"uuid","status":"PENDING","totalItems":3}` |
| `GET` | `/api/products/publish-status/{batchId}` | Poll batch publishing progress | `batchId` (UUID) | `{"batchId":"...","status":"COMPLETED","totalItems":3,"successfulItems":3,"failedItems":0}` |
| `GET` | `/api/products/{productId}/status/{channel}` | Get latest listing status for product | Channel | `ListingStatusDTO` |

### 🔔 Order Webhooks & Stock (`/api/webhooks`)
| Method | Endpoint | Description | Headers | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/webhooks/flipkart/order` | Inbound Flipkart order webhook | `X-Webhook-Secret: <secret>` | `{"channelOrderId":"OD123","sku":"TSHIRT-01","quantity":1}` |

---

## 8. End-to-End Data Flow Diagrams

### A. Asynchronous Batch Publishing Flow
```
Seller Dashboard           Backend Controller          AsyncPublishService        Mock Marketplace (8081)
     │                             │                            │                            │
     │ 1. POST /publish/FLIPKART   │                            │                            │
     │────────────────────────────►│                            │                            │
     │                             │ 2. Create Batch (PENDING)  │                            │
     │                             │    Spawn Background Thread │                            │
     │ 3. Return batchId (202)     │───────────────────────────►│                            │
     │◄────────────────────────────│                            │                            │
     │                             │                            │ 4. Pre-Validate Local Rules│
     │ 5. Poll /publish-status/{id}│                            │    Transform via Mapper    │
     │────────────────────────────►│                            │                            │
     │ 6. Batch Progress (e.g. 50%)│                            │ 5. POST /flipkart/listings │
     │◄────────────────────────────│                            │───────────────────────────►│
     │                             │                            │ 6. Receive Listing ID/Error│
     │                             │                            │◄───────────────────────────│
     │ 7. Poll /publish-status/{id}│                            │ 7. Update Batch Counts     │
     │────────────────────────────►│                            │    Update listing_status   │
     │ 8. Batch Status (COMPLETED) │                            │                            │
     │◄────────────────────────────│                            │                            │
```

### B. Inbound Order Webhook & Cross-Channel Sync Flow
```
Flipkart Marketplace           OrderWebhookController          OrderService             InventorySyncListener       Amazon Mock (8082)
        │                                │                          │                              │                        │
        │ 1. POST /webhooks/flipkart/order│                          │                              │                        │
        │    (with X-Webhook-Secret)     │                          │                              │                        │
        │───────────────────────────────►│                          │                              │                        │
        │                                │ 2. Validate Secret       │                              │                        │
        │                                │    Forward Payload       │                              │                        │
        │                                │─────────────────────────►│                              │                        │
        │                                │                          │ 3. Decrement Stock (@Version)│                        │
        │                                │                          │    Publish InventoryChanged  │                        │
        │                                │                          │─────────────────────────────►│                        │
        │ 4. 200 OK (Stock Decremented)  │                          │                              │ 5. POST /amazon/       │
        │◄───────────────────────────────│                          │                              │    inventory/update    │
        │                                │                          │                              │───────────────────────►│
        │                                │                          │                              │ 6. Stock Synchronized  │
        │                                │                          │                              │◄───────────────────────│
```

---

## 9. Project Directory & File Structure

```
d:\ecommerce/
├── CURRENT_BUILD_SUMMARY.md            # Active build notes & port safety summary
├── PROJECT_DOCUMENTATION.md            # Comprehensive master documentation (this file)
├── pom.xml                             # Backend Maven build configuration
├── start-all.bat                       # Automated 1-click Windows launcher
├── start-all.sh                        # Automated 1-click Linux/macOS launcher
│
├── frontend/                           # React 18 + Vite Frontend (Port 5174)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                     # Top-level view router with auth guards
│       ├── index.css                   # Refined editorial design system & tokens
│       ├── components/
│       │   ├── Navbar.jsx              # Navigation, seller profile & session management
│       │   ├── Sidebar.jsx             # Collapsible seller portal navigation sidebar
│       │   ├── SellerDashboardLayout.jsx # Unified master shell for all 8 dashboard pages
│       │   ├── ProductLedgerTable.jsx  # Primary product table with filters & actions
│       │   ├── ProductDetailModal.jsx  # 4-tab product inspector & publish console
│       │   ├── BulkUploadModal.jsx     # CSV drag-and-drop importer & error reporter
│       │   └── StatusStamp.jsx         # Status pill badge component
│       ├── pages/
│       │   ├── AuthPage.jsx            # Sign In & Registration with demo credentials
│       │   ├── DashboardPage.jsx       # Operational metrics, recent items & marketplace status
│       │   ├── ProductsPage.jsx        # Canonical catalog management & bulk actions
│       │   ├── PublishingPage.jsx      # Batch publishing jobs & live polling progress
│       │   ├── ListingsPage.jsx        # Multi-channel syndication inspector & retry actions
│       │   ├── OrdersPage.jsx          # Inbound orders log & live webhook simulator
│       │   ├── InventoryPage.jsx       # Stock allocation ledger & broadcast sync
│       │   ├── MarketplacesPage.jsx    # Flipkart Self-Access Sandbox & Amazon telemetry
│       │   ├── SettingsPage.jsx        # Seller profile, sync rules & catalog reset
│       │   └── LedgerPage.jsx          # Standalone catalog ledger
│       ├── context/
│       │   └── AuthContext.jsx         # In-memory authentication state provider
│       └── services/
│           └── api.js                  # REST API client with JWT & marketplace endpoints
│
├── mock-flipkart-service/              # Mock Flipkart Listing API v3 (Port 8081)
│   ├── pom.xml
│   └── src/main/java/com/mockflipkart/
│       └── MockFlipkartApplication.java# Listing & inventory endpoints with error simulation
│
├── mock-amazon-service/                # Mock Amazon SP-API Service (Port 8082)
│   ├── pom.xml
│   └── src/main/java/com/mockamazon/
│       └── MockAmazonApplication.java  # Amazon feed & stock update endpoints
│
└── src/                                # Main Listing Platform Backend (Port 8080)
    ├── main/
    │   ├── java/com/listingplatform/
    │   │   ├── ListingPlatformApplication.java
    │   │   ├── seller/                 # Auth, JWT, UserDetailsService, SecurityConfig
    │   │   ├── product/                # Product entity, CRUD, CSV parsing, access control
    │   │   ├── image/                  # Magic byte & dimension validation, file storage
    │   │   ├── channel/                # Validation engine, batch publisher, reconciliation
    │   │   │   ├── flipkart/           # Flipkart API v3 DTOs, Mapper, WebClient Adapter
    │   │   │   └── amazon/             # Amazon SP-API DTOs, Mapper, WebClient Adapter
    │   │   ├── order/                  # Webhook receiver, stock decrement, event dispatch
    │   │   └── common/                 # Global exception handler & error response DTOs
    │   └── resources/
    │       ├── application.properties  # Database, JWT, port & channel configurations
    │       └── db/migration/           # Flyway sequential SQL migrations (V1, V2, V3)
    └── test/                           # Unit & integration test suites
```

---

## 10. Step-by-Step Installation & Run Guide

### Prerequisites
* **Java**: JDK 17 or higher (`java -version`)
* **Node.js**: Node 18+ and npm (`node -v`, `npm -v`)
* **Maven**: Maven 3.8+ (`mvn -v`)
* **PostgreSQL**: PostgreSQL 14+ running locally on port `5432` with database `listing_platform_db` created:
  ```sql
  CREATE DATABASE listing_platform_db;
  ```

---

### Method A: Automated 1-Click Startup (Windows)
Run from the root directory:
```cmd
.\start-all.bat
```
This automatically spins up:
1. Mock Flipkart Service on Port `8081`
2. Mock Amazon Service on Port `8082`
3. React Vite Frontend on Port `5174`
4. Main Listing Platform on Port `8080`

---

### Method B: Manual Step-by-Step Startup

#### 1. Start Mock Flipkart Service (Port 8081)
```powershell
cd d:\ecommerce\mock-flipkart-service
mvn spring-boot:run
```

#### 2. Start Mock Amazon Service (Port 8082)
```powershell
cd d:\ecommerce\mock-amazon-service
mvn spring-boot:run
```

#### 3. Start React Frontend (Port 5174)
```powershell
cd d:\ecommerce\frontend
npm install
npm run dev
```

#### 4. Start Main Backend (Port 8080)
```powershell
cd d:\ecommerce
mvn spring-boot:run
```

---

## 11. Verification & Presentation Walkthrough

Follow these steps for a complete product demonstration:

1. **Access Web Application**: Open [http://localhost:5174](http://localhost:5174) in your browser.
2. **Register a Seller Account**:
   * Click **"Register"**.
   * Enter Business Name: `Acme Retailers`, Email: `seller@acme.com`, Password: `password123`.
   * Login automatically triggers and opens the main product ledger.
3. **Ingest Products via CSV**:
   * Click **"Bulk CSV Upload"**.
   * Click **"Download Sample CSV"** to inspect the canonical structure.
   * Upload the sample CSV file.
   * Observe immediate ingestion confirmation and live ledger population.
4. **Inspect Magic-Byte & Dimension Image Validation**:
   * Click on a product to open the **Product Detail Modal**.
   * Switch to the **"Images"** tab.
   * Upload high-resolution images (>= 500x500px). Magic-byte validation ensures only valid JPEG/PNG files are processed.
5. **Enrich Marketplace Channel Attributes**:
   * Switch to the **"Flipkart Fields"** tab.
   * Enter `HSN Code` (e.g., `61091000`), `Procurement Type` (`REGULAR`), and `Shipping Provider` (`FLIPKART`).
   * Click **"Save Extension Fields"**.
6. **Execute Pre-Publish Readiness Check**:
   * Switch to the **"Readiness & Publish"** tab.
   * Click **"Run Validation"** to verify that all canonical, image, and extension rules are satisfied (`VALIDATED` badge appears).
7. **Trigger Asynchronous Batch Publishing**:
   * Click **"Publish to Flipkart"**.
   * Watch the real-time polling progress bar advance as the backend publishes asynchronously.
   * The status updates to `PUBLISHED` (or displays actionable errors if rejected by the mock marketplace).
8. **Simulate Inbound Order Webhook**:
   * Send a mock order webhook using curl or Postman:
     ```bash
     curl -X POST http://localhost:8080/api/webhooks/flipkart/order \
       -H "Content-Type: application/json" \
       -H "X-Webhook-Secret: flipkart-secret-webhook-key-2026" \
       -d "{\"channelOrderId\": \"OD-99881\", \"sku\": \"TSHIRT-01\", \"quantity\": 1}"
     ```
   * Stock automatically decrements in the database and broadcasts an updated inventory payload to Amazon and Flipkart mock endpoints.
9. **Interactive API Documentation**:
   * Access OpenAPI Swagger UI at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) to inspect and test all endpoints interactively.
