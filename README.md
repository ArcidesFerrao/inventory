# Contela V1

Contela V1 is a multi-service operational platform designed for small and medium businesses to manage stock, supplier orders, deliveries, and service operations in real time.

The system supports service-based businesses (restaurants, retail, providers) and suppliers inside a structured operational flow.

---

## 🎯 Purpose

Contela enables businesses to:

- Track stock usage automatically
- Create and manage supplier orders
- Monitor delivery status
- Maintain real-time inventory visibility
- Record operational sales and services

Contela V1 focuses strictly on operational workflows — not accounting or financial analytics.

---

## 🧱 Core Concept

Contela operates around a stock-driven loop:

1. A sale or service consumes stock
2. Stock quantity updates automatically
3. Low stock triggers supplier ordering
4. Supplier confirms and prepares order
5. Delivery is scheduled and completed
6. Stock increases upon delivery

Everything revolves around inventory movement.

---

## 👥 Supported Roles

### Service Owner

- Manage service profile
- Add and manage stock items
- Record sales or services
- Create supplier orders
- Confirm deliveries
- View stock movement history

### Supplier

- Manage supplier profile
- Create and manage stock catalog
- Receive and confirm service orders
- Schedule and record deliveries

### System Administrator

- Manage users
- Manage services and suppliers
- Monitor system activity

---

## 🚀 Features (V1 Scope)

### Inventory

- Stock tracking per service
- Automatic stock deduction on sale
- Stock increase on delivery confirmation
- Stock movement history
- Critical stock levels

### Orders & Deliveries

- Supplier order creation
- Order status tracking
- Delivery scheduling
- Delivery confirmation logic
- Transaction-safe stock updates

### Catalog

- Product management
- Quantity control
- Price management

### Authentication

- Email & password authentication
- Google OAuth
- Password reset flow
- Session protection
- Role-based access control

---

## 🏗 Architecture

### Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma ORM
- NextAuth
- PostgreSQL
- next-intl (i18n routing)
- Server Components + Server Actions

### Routing Structure

Role-based route separation:

    /[locale]/admin/*

    /[locale]/service/*

    /[locale]/supply/*

    /api/*

Locale-based routing ensures multi-language support.

---

## 📦 Core Domain Models

- User
- Service
- Supplier
- Stock Item
- Service Stock Item
- Order
- Delivery
- Stock Movement
- Sale

---

## ❌ Not Included in V1

- Accounting & bookkeeping
- Financial reporting
- Payroll
- Advanced analytics
- Multi-warehouse management
- Automated pricing logic
- Full payment processing

Contela V1 is strictly operational.

---

## 🛠 Installation

```bash
git clone <repository-url>
cd contela
npm install
```

---

## 🧪 Development

Run development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
npm start
```

---

## 📈 Success Criteria

Contela V1 is successful when:

- Services actively record sales
- Stock updates automatically and reliably
- Supplier orders flow through the system
- Deliveries correctly adjust stock
- Users clearly see operational status
- The system performs reliably under real usage

---

## 📄 License

Private / Proprietary (unless specified otherwise).

---

## Author

Arcides Ferrao  
Maputo, Mozambique
