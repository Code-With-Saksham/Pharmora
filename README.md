# PHARMORA — Smart Medicine Delivery Platform

**Your Local Pharmacy. Delivered.**

PHARMORA is a smart medicine delivery platform that connects customers with verified local pharmacies and delivery partners. It enables users to discover nearby medical stores, check medicine availability, upload prescriptions when required, place orders, and get medicines delivered to their doorstep.

Unlike traditional online pharmacies that may rely on centralized fulfillment and longer shipping times, PHARMORA aims to make better use of existing local pharmacy inventory through a coordinated delivery network.

Our mission is to make medicine ordering more accessible, convenient, transparent, and affordable.

---

## Project Vision

Imagine ordering medicines as easily as ordering food.

With PHARMORA, customers can search for medicines, discover nearby pharmacies that have them in stock, select a suitable store, and arrange doorstep delivery through an available delivery partner.

PHARMORA brings four major participants together in one platform:

- **Customers:** Search and order medicines.
- **Pharmacy Owners:** Manage inventory, process orders, and review prescriptions through authorized pharmacy professionals.
- **Delivery Partners:** Accept delivery requests, collect orders, and deliver them to customers.
- **Administrators:** Manage the platform, verify pharmacies, monitor orders, and oversee operations.

PHARMORA focuses on reliable local fulfillment rather than promising unrealistic 10-minute deliveries.

## Problem Statement

Traditional online medicine ordering can involve long delivery times, while many nearby medical stores already have the required medicines in stock.

Customers may struggle to identify which local pharmacy has a particular medicine available without calling multiple stores.

At the same time, independent pharmacies often lack the technology and delivery infrastructure needed to serve customers online.

PHARMORA aims to solve these problems by creating a unified digital marketplace that connects customers, local pharmacies, and delivery partners.

## Our Solution

PHARMORA provides a centralized platform where:

- Customers can discover nearby pharmacies and available medicines.
- Pharmacies can manage their product inventory and receive online orders.
- Prescriptions can be securely uploaded and reviewed when legally required.
- Delivery partners can accept eligible delivery assignments.
- Customers can follow their orders through different fulfillment stages.
- Administrators can monitor platform activity and manage verification processes.

The goal is to make local pharmacies easier to discover and their services easier to access.

## Key Features

### 1. Customer Interface

The customer dashboard provides a simple and convenient medicine-ordering experience.

Features include:

- User registration and login.
- Location selection and address management.
- Search medicines by name, brand, or active ingredient.
- Discover nearby participating pharmacies.
- View medicine availability and pricing.
- Compare eligible pharmacies.
- View product details and prescription requirements.
- Upload prescriptions in supported image or PDF formats.
- Add medicines to the cart.
- Place and manage orders.
- View itemized prices and delivery charges.
- Track order status.
- View delivery information when available.
- Access order history and payment status.
- Request support for order-related issues.

### 2. Pharmacy Owner Dashboard

The pharmacy dashboard allows verified medical stores to manage their digital storefront and fulfill customer orders.

Features include:

- Pharmacy registration and profile management.
- Submission of applicable pharmacy licence documents.
- Pharmacy verification status.
- Medicine catalog selection.
- Inventory and stock management.
- Medicine pricing management.
- Stock availability updates.
- Low-stock notifications.
- Incoming order notifications.
- Order acceptance and rejection.
- Prescription review by authorized pharmacy professionals.
- Order preparation and pickup status management.
- Sales and order analytics.
- Platform fee and settlement information.

Only appropriately verified pharmacies should be permitted to fulfill orders.

### 3. Delivery Partner Dashboard

The delivery interface is designed to help eligible delivery partners manage local deliveries efficiently.

Features include:

- Delivery partner registration.
- Required identity and eligibility verification.
- Online and offline availability.
- Available delivery requests.
- Pickup and delivery location details.
- Estimated trip distance and delivery time.
- Accept or reject delivery offers.
- Pickup confirmation.
- Order status updates.
- Navigation and location sharing during active deliveries.
- Delivery confirmation.
- Delivery history.
- Earnings and payout information.
- Delivery-related support.

Delivery partners handle transportation and handover. Prescription verification and dispensing decisions remain the responsibility of the appropriate pharmacy professionals.

### 4. Admin Dashboard

The admin panel provides centralized operational control over the PHARMORA platform.

Features include:

- Dashboard analytics.
- Customer account management.
- Pharmacy application review and verification.
- Delivery partner verification.
- Pharmacy suspension and licence-expiry monitoring.
- Product catalog management.
- Order monitoring.
- Delivery assignment monitoring.
- Payment and refund tracking.
- Pharmacy settlement oversight.
- Customer complaint management.
- Support ticket management.
- Platform fee configuration.
- Audit logs for important administrative actions.

Administrative permissions must be restricted according to each administrator's responsibilities.

---

## How PHARMORA Works

The standard order journey follows these steps:

1. **Search:** The customer searches for a medicine or uploads a prescription.
2. **Discover:** PHARMORA identifies eligible nearby pharmacies with matching inventory.
3. **Compare:** The customer reviews availability, prices, pharmacy details, and delivery estimates.
4. **Order:** The customer selects a pharmacy, confirms the order, and completes the applicable checkout process.
5. **Verify:** The pharmacy reviews the order and verifies the prescription when required.
6. **Prepare:** The pharmacy confirms availability and prepares the medicines.
7. **Assign:** The system offers the delivery to an eligible delivery partner.
8. **Pickup:** The delivery partner collects the correct order from the pharmacy.
9. **Deliver:** The partner delivers the package to the customer.
10. **Complete:** PHARMORA updates the order status and records the relevant payment and delivery information.

The order should proceed only when the necessary pharmacy, prescription, inventory, and payment checks have been completed.

Delivery estimates are indicative and depend on stock availability, pharmacy preparation time, traffic, distance, and delivery partner availability.

---

## Core Business Logic

### Nearby Pharmacy Discovery

PHARMORA uses the customer's delivery location and pharmacy coordinates to identify nearby eligible stores.

Search results should consider:

- Distance from the customer.
- Medicine availability.
- Pharmacy verification status.
- Pharmacy operating hours.
- Product price.
- Estimated delivery time.
- Ability to fulfill the complete order.

Road distance and travel-time estimates should use a suitable mapping or routing service where available.

### Inventory Management

Each pharmacy maintains its own inventory.

The system must distinguish between available stock, reserved stock, and unavailable products.

Inventory should be checked again when an order is placed and accepted to reduce the risk of overselling.

Where required, stock and batch records should include relevant expiry and traceability information.

### Prescription Verification

For medicines requiring a prescription, the customer must provide the necessary prescription information.

The prescription should be stored securely and made accessible only to authorized personnel who need it to process the order.

OCR or AI may assist with text extraction, but must not independently approve a prescription or authorize dispensing.

### Delivery Assignment

When an order is ready for pickup, PHARMORA identifies eligible delivery partners based on factors such as availability, distance, workload, and estimated arrival time.

If no partner accepts the request, the system should retry assignment or notify the operations team.

### Order Tracking

Customers should receive accurate status updates as their orders progress through the fulfillment and delivery process.

Only authorized users and services should be able to change order statuses.

---

## Application Architecture

PHARMORA is designed as a role-based, API-driven web application.

The initial version should use a modular backend architecture rather than unnecessarily complex microservices.

The application contains:

- A shared authentication system.
- Four role-specific interfaces.
- A backend API layer.
- A relational database.
- Private document storage.
- Inventory and order management services.
- Prescription workflow services.
- Delivery assignment services.
- Payment and settlement integrations.
- Notification and tracking services.

Each interface should communicate with the backend through validated APIs.

Business-critical operations must be validated on the server rather than trusted to the frontend.

---

## Proposed Technology Stack

The following stack is recommended for the initial implementation. Final choices should be documented before development begins.

| Technology | Purpose |
|---|---|
| React | Frontend user interfaces |
| TypeScript | Type-safe application development |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable and accessible UI components |
| React Router | Frontend navigation and protected routes |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| Supabase | Managed database, authentication integration, and private storage |
| Google Maps Platform or Mapbox | Maps, geolocation, and route estimates |
| Payment gateway | Online payment processing |
| SMS, email, or push service | Notifications |
| Vitest and Supertest | Unit and API testing |
| Playwright | End-to-end testing |

The exact integrations may change during implementation, but their responsibilities should remain clearly separated.

---

## Database Design

The database should support the following core entities:

| Table | Purpose |
|---|---|
| `profiles` | User profiles and account status |
| `pharmacies` | Pharmacy information and verification status |
| `pharmacy_licences` | Private licence documents and review records |
| `products` | Standardized medicine catalog |
| `pharmacy_inventory` | Pharmacy-specific prices and stock |
| `inventory_batches` | Batch and expiry information where required |
| `customer_addresses` | Customer delivery addresses |
| `orders` | Main order information and status |
| `order_items` | Individual products and quantities |
| `prescriptions` | Secure prescription references and metadata |
| `prescription_reviews` | Authorized review decisions and history |
| `delivery_partners` | Delivery partner profiles and eligibility |
| `delivery_assignments` | Order-to-partner assignments |
| `delivery_events` | Pickup, transit, and delivery events |
| `payments` | Payment records and provider references |
| `refunds` | Refund requests and processing status |
| `pharmacy_settlements` | Pharmacy settlement records |
| `partner_payouts` | Delivery partner payout records |
| `notifications` | Notification events and delivery status |
| `support_tickets` | Customer and operational support requests |
| `audit_logs` | Important security and administrative events |

The final schema should include appropriate relationships, foreign keys, constraints, indexes, and database migrations.

Sensitive files must be stored in private object storage rather than publicly accessible database or file URLs.

---

## Security and Compliance

Security and responsible medicine fulfillment are essential parts of PHARMORA.

The platform should implement:

- Authentication and server-side role-based authorization.
- Pharmacy and delivery partner verification.
- Private prescription and licence document storage.
- Secure access controls for medical information.
- Input validation and safe error handling.
- Protection against unauthorized record access.
- Inventory concurrency controls.
- Payment webhook verification.
- Idempotent payment and order operations.
- Audit logs for important actions.
- Appropriate encryption and data-retention policies.
- Restricted access to delivery location information.

PHARMORA is intended for the Indian market. Applicable drug licensing, prescription, pharmacy, payment, consumer protection, and data privacy requirements must be assessed before launch.

Prescription-required medicines must not proceed to dispensing until the legally required checks have been completed by the appropriate authorized pharmacy professional.

The platform must not treat document uploads, AI analysis, or OCR output as substitutes for professional verification.

---

## UI/UX Design Philosophy

PHARMORA should have a modern, clean, and trustworthy healthcare technology identity.

### Brand Identity

- **Brand Name:** PHARMORA
- **Tagline:** Your Local Pharmacy. Delivered.
- **Primary Colors:** Deep teal and white.
- **Accent Color:** Emerald green.
- **Design Style:** Modern, minimal, accessible, and professional.

### Design Principles

- Mobile-first customer and delivery interfaces.
- Desktop-friendly pharmacy and admin dashboards.
- Clear navigation and readable typography.
- Consistent spacing and reusable components.
- Accessible forms and buttons.
- Clear order status indicators.
- Loading states and meaningful empty states.
- Responsive tables and dashboards.
- Understandable validation and error messages.
- Minimal unnecessary animations.

The application should feel like a credible healthcare platform rather than a generic template.

---

## Business Model

PHARMORA may generate revenue through several channels:

- Commission on successfully completed pharmacy orders.
- Customer delivery fees.
- Optional pharmacy subscription plans.
- Premium inventory and analytics tools.
- Business integrations for pharmacy networks.

Pricing must be transparent, and the economics should be evaluated using actual pharmacy agreements, delivery costs, payment fees, support expenses, and customer demand.

The platform aims to maintain competitive total prices without compromising compliant pharmacy fulfillment or reliable delivery.

---

## Development Roadmap

### Phase 1 — MVP Foundation

- Project setup and design system.
- Unified authentication.
- Role-based routing and authorization.
- Customer dashboard.
- Pharmacy onboarding and verification.
- Product catalog.
- Pharmacy inventory management.
- Nearby pharmacy discovery.
- Cart and checkout.
- Prescription upload and review.
- Basic order management.
- Admin dashboard.

### Phase 2 — Delivery Operations

- Delivery partner onboarding.
- Delivery request management.
- Manual and automatic delivery assignment.
- Pickup and delivery confirmation.
- Order tracking.
- Notifications.
- Cancellation and refund workflows.

### Phase 3 — Payments and Reliability

- Payment gateway integration.
- Payment verification and webhook handling.
- Pharmacy settlements.
- Delivery partner payouts.
- Improved inventory reservation.
- Error monitoring.
- Security testing.
- Automated workflow testing.

### Phase 4 — Optimization and Expansion

- Better pharmacy ranking.
- Improved delivery estimates.
- Advanced operational analytics.
- Pharmacy inventory integrations.
- Demand forecasting.
- Additional localities and cities.
- Optional native mobile applications.

The project should progress in tested stages rather than attempting to build every feature simultaneously.

---

## Testing Strategy

The application should be tested across all four roles.

Important test scenarios include:

- Customers cannot access administrator functions.
- Unverified pharmacies cannot fulfill orders.
- Unverified delivery partners cannot accept deliveries.
- Customers cannot access other customers' orders or prescriptions.
- Prescription-required orders cannot proceed to dispensing before required review.
- Inventory cannot become negative through concurrent orders.
- Duplicate requests cannot create duplicate orders or payment records.
- Multiple delivery partners cannot claim the same assignment.
- Invalid order status transitions are rejected.
- Failed payments are handled correctly.
- Refunds and settlements are accurately recorded.
- Private documents cannot be accessed by unauthorized users.

Use synthetic data and payment sandbox environments during development.

---

## Getting Started

The exact setup instructions will depend on the final repository structure.

A typical development setup will require:

1. Installing Node.js and the package manager selected for the project.
2. Cloning the repository.
3. Installing project dependencies.
4. Creating a development Supabase project or configuring a local PostgreSQL database.
5. Applying database migrations.
6. Configuring authentication and private storage.
7. Creating the required environment variables.
8. Configuring optional map, payment, and notification integrations.
9. Starting the frontend and backend development servers.
10. Running tests before verifying the complete order journey.

Create a `.env.example` file with placeholder values for required configuration.

Never commit API keys, database passwords, service-role keys, payment secrets, or other credentials to version control.

Complete installation commands and scripts should be documented after the actual project structure has been established.

---

## Project Status

**Status:** In Development

PHARMORA is being developed as a healthcare-commerce and local medicine delivery platform. Features, integrations, and workflows will be implemented incrementally.

The initial focus is on reliable pharmacy discovery, accurate inventory, compliant prescription processing, secure order management, and dependable local delivery.

---

## Future Vision

The long-term vision for PHARMORA is to build a scalable local pharmacy network that helps customers discover available medicines while enabling independent pharmacies to participate in digital commerce.

Potential future improvements include advanced inventory integrations, smarter delivery assignment, pharmacy analytics, demand forecasting, and expansion into additional localities.

The priority will remain reliable fulfillment, customer trust, competitive pricing, and responsible handling of medicine orders.

---

## Contributing

Contributions and suggestions are welcome.

Before contributing:

1. Understand the project's architecture and development conventions.
2. Keep business logic separate from presentation components.
3. Validate inputs and enforce permissions on the backend.
4. Add tests for important business rules.
5. Avoid committing secrets or real prescription data.
6. Document changes that affect APIs, database schemas, or workflows.

---

## Disclaimer

PHARMORA is a medicine marketplace and delivery platform concept. It is not a substitute for professional medical advice, diagnosis, or treatment.

Medicine availability, prescription verification, dispensing, and delivery must comply with applicable laws and professional requirements. Actual service availability and delivery estimates depend on operational conditions.

The platform must not launch real medicine fulfillment until the necessary legal, pharmacy, security, and operational requirements have been addressed.

---

**PHARMORA — Your Local Pharmacy. Delivered.**