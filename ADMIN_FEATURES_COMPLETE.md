# Ek-Bhavishya Admin Panel — Complete Features & Operations Guide

> **Purpose:** Based on the complete analysis of all 25+ platform entities, 21 controllers (130+ functions), and 3 user roles, this document defines every operation/feature/functionality an admin **should** have. It maps what currently exists vs. what is missing and prescribes every admin operation needed for a production-ready astrology platform.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Status Legend](#2-feature-status-legend)
3. [User Management](#3-user-management)
4. [Astrologer Management](#4-astrologer-management)
5. [Seller Management](#5-seller-management)
6. [Order & E-Commerce Management](#6-order--e-commerce-management)
7. [Product Management](#7-product-management)
8. [Category Management](#8-category-management)
9. [Call Session Management](#9-call-session-management)
10. [Chat Session Management](#10-chat-session-management)
11. [Live Session Management](#11-live-session-management)
12. [Wallet & Financial Management](#12-wallet--financial-management)
13. [Blog Management](#13-blog-management)
14. [Course Management](#14-course-management)
15. [Book Management](#15-book-management)
16. [Remedy & Booking Management](#16-remedy--booking-management)
17. [Review & Rating Management](#17-review--rating-management)
18. [Notice & Notification Management](#18-notice--notification-management)
19. [Interview & Onboarding Management](#19-interview--onboarding-management)
20. [Dashboard & Analytics](#20-dashboard--analytics)
21. [Reports & Exports](#21-reports--exports)
22. [System Configuration](#22-system-configuration)
23. [Referral & Promotion Management](#23-referral--promotion-management)
24. [Content Moderation](#24-content-moderation)
25. [Audit & Security](#25-audit--security)
26. [Gap Analysis Summary](#26-gap-analysis-summary)
27. [Priority Implementation Roadmap](#27-priority-implementation-roadmap)

---

## 1. Executive Summary

### Platform Entities (25 Mongoose Models)

| # | Entity | Collection | Module | Admin Coverage |
|---|--------|-----------|--------|---------------|
| 1 | User | `User` | user | ✅ Partial |
| 2 | CallSession | `CallSession` | user | ✅ Good |
| 3 | ChatSession | `ChatSession` | user | ❌ None |
| 4 | UserWalletTransaction | `UserWalletTransaction` | user | ❌ None |
| 5 | Cart | `Cart` | user | ❌ None |
| 6 | Order | `Order` | user | ❌ None |
| 7 | RemedyBooking | `RemedyBooking` | user | ❌ None |
| 8 | Book | `Book` | user | ❌ None |
| 9 | UserBookPurchase | `UserBookPurchase` | user | ❌ None |
| 10 | UserEnrollment | `UserEnrollment` | user | ❌ None |
| 11 | Astrologer | `Astrologer` | astrologer | ✅ Partial |
| 12 | Blog | `Blog` | astrologer | ✅ Good |
| 13 | Course (Astrologer) | `Course` | astrologer | ✅ Partial |
| 14 | Remedy | `Remedy` | astrologer | ❌ None |
| 15 | AstrologerRemedyService | `AstrologerRemedyService` | astrologer | ❌ None |
| 16 | Review | `Review` | astrologer | ❌ None |
| 17 | CallPackage | `CallPackage` | astrologer | ❌ None |
| 18 | LiveSession | `LiveSession` | astrologer | ❌ None |
| 19 | WalletTransaction (Astrologer) | `WalletTransaction` | astrologer | ❌ None |
| 20 | WithdrawalRequest | `WithdrawalRequest` | astrologer | ❌ None |
| 21 | Notepad | `Notepad` | astrologer | ❌ None |
| 22 | Seller | `Seller` | seller | ✅ Good |
| 23 | Product | `Product` | seller | ❌ None |
| 24 | Category | `Category` | seller | ❌ None |
| 25 | AdminCourse | `AdminCourse` | admin | ✅ Full |
| 26 | Admin | `Admin` | admin | ✅ Login only |
| 27 | Interview | `Interview` | admin | ✅ Good |
| 28 | Notice | `Notice` | admin | ✅ Full |
| 29 | Notification | `Notification` | admin | ✅ Full |
| 30 | Lesson | `Lesson` | admin | ✅ Full |

### Score Card

| Metric | Count |
|--------|-------|
| Total platform entities | 30 |
| Entities with admin CRUD/operations | 12 |
| Entities with **zero** admin coverage | 18 |
| Existing admin functions | 62 |
| **Required** admin functions (estimated) | **200+** |
| Coverage percentage | **~31%** |

---

## 2. Feature Status Legend

| Icon | Meaning |
|------|---------|
| ✅ | **EXISTS** — Backend + route implemented |
| 🔶 | **PARTIAL** — Some operations exist, others missing |
| ❌ | **MISSING** — Not implemented at all |
| 🔧 | **BUG/ISSUE** — Exists but has known issues |
| 📋 | **RECOMMENDED** — Nice-to-have for production |

---

## 3. User Management

**Entity:** `User` — Core user accounts for the astrology platform.

### 3.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all users | GET | `/api/v1/admin/users` | ✅ | Paginated list with search & status filter |
| 2 | Get user details | GET | `/api/v1/admin/users/:id` | ❌ | Full profile with activity summary, wallet, orders, enrollments |
| 3 | Block user | PATCH | `/api/v1/admin/users/block` | ✅ | Set user status to "Blocked" |
| 4 | Unblock user | PATCH | `/api/v1/admin/users/unblock` | ✅ | Set user status to "Active" |
| 5 | Edit user profile | PUT | `/api/v1/admin/users/:id` | ❌ | Admin override of user details (name, email, phone, etc.) |
| 6 | Delete user | DELETE | `/api/v1/admin/users/:id` | ❌ | Soft-delete or permanent delete (GDPR compliance) |
| 7 | Reset user password | POST | `/api/v1/admin/users/:id/reset-password` | ❌ | Force password reset, send reset email |
| 8 | Adjust wallet balance | POST | `/api/v1/admin/users/:id/wallet/adjust` | ❌ | Credit/debit wallet with reason and description |
| 9 | Grant free minutes | POST | `/api/v1/admin/users/:id/free-minutes` | ❌ | Allocate free consultation minutes |
| 10 | View user's orders | GET | `/api/v1/admin/users/:id/orders` | ❌ | All orders placed by this user |
| 11 | View user's call history | GET | `/api/v1/admin/users/:id/calls` | ❌ | All call sessions for this user |
| 12 | View user's chat history | GET | `/api/v1/admin/users/:id/chats` | ❌ | All chat sessions for this user |
| 13 | View user's enrollments | GET | `/api/v1/admin/users/:id/enrollments` | ❌ | All course enrollments |
| 14 | View user's wallet transactions | GET | `/api/v1/admin/users/:id/transactions` | ❌ | Complete wallet transaction ledger |
| 15 | View user's book purchases | GET | `/api/v1/admin/users/:id/books` | ❌ | All purchased books |
| 16 | View user's remedy bookings | GET | `/api/v1/admin/users/:id/remedies` | ❌ | All remedy bookings |
| 17 | User activity stats | GET | `/api/v1/admin/reports/user-activity` | ✅ | Monthly active/new user counts |
| 18 | Export users | GET | `/api/v1/admin/users/export` | ❌ | CSV/Excel export of user data |
| 19 | Bulk status update | PATCH | `/api/v1/admin/users/bulk-status` | 📋 | Block/unblock multiple users at once |
| 20 | User KYC verification | PATCH | `/api/v1/admin/users/:id/verify` | 📋 | Verify user identity documents |

### 3.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Users List | ✅ | Table with search, filters, pagination |
| User Detail | ❌ | Comprehensive user profile with tabs (Profile, Orders, Calls, Wallet, Enrollments, Books, Remedies) |
| User Edit | ❌ | Edit form for admin overrides |

### 3.3 Key Fields for Admin Operations

```
User.status: ["Active", "Inactive", "Blocked"]
User.walletBalance: Number (admin can adjust)
User.freeMinutes: { total, used, remaining, expiresAt }
User.is_verified: Boolean
```

---

## 4. Astrologer Management

**Entity:** `Astrologer` — The most complex entity with 80+ fields covering registration, verification, pricing, availability, bank details, suspension.

### 4.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all astrologers | GET | `/api/v1/admin/astrologers` | ✅ | Paginated with search, status filter |
| 2 | Get astrologer details | GET | `/api/v1/admin/astrologers/:id` | ❌ | Full profile, documents, bank details, earnings, ratings, content |
| 3 | Approve astrologer | PATCH | `/api/v1/admin/astrologers/:id/approve` | ❌ | Set status to Approved, isApproved=true |
| 4 | Reject astrologer | PATCH | `/api/v1/admin/astrologers/:id/reject` | 🔶 | Via interview flow (`/reject-interview`) |
| 5 | Suspend astrologer | PATCH | `/api/v1/admin/astrologers/suspend` | ✅ | With reason, duration, notes |
| 6 | Unsuspend astrologer | POST | `/api/v1/admin/astrologers/:id/unsuspend` | ✅ | Via call controller route |
| 7 | View suspension history | GET | `/api/v1/admin/astrologers/:id/suspension-history` | ✅ | Full suspension & report history |
| 8 | Verify documents | PATCH | `/api/v1/admin/astrologers/:id/verify-documents` | ❌ | Verify Aadhar, PAN, certificates → set verificationStatus |
| 9 | Verify bank details | PATCH | `/api/v1/admin/astrologers/:id/verify-bank` | ❌ | Approve/reject bank detail changes (exists in astrologer controller, NOT admin) |
| 10 | Verify address details | PATCH | `/api/v1/admin/astrologers/:id/verify-address` | ❌ | Approve/reject address changes (exists in astrologer controller, NOT admin) |
| 11 | Edit pricing | PATCH | `/api/v1/admin/astrologers/:id/pricing` | ❌ | Admin override of call/chat/video rates |
| 12 | Set commission rate | PATCH | `/api/v1/admin/astrologers/:id/commission` | ❌ | Per-astrologer commission percentage |
| 13 | Toggle availability | PATCH | `/api/v1/admin/astrologers/:id/availability` | ❌ | Force online/offline/busy status |
| 14 | View earnings | GET | `/api/v1/admin/astrologers/:id/earnings` | ❌ | Wallet balance, transaction history, commission details |
| 15 | View withdrawal requests | GET | `/api/v1/admin/astrologers/:id/withdrawals` | ❌ | Pending/processed withdrawal requests |
| 16 | Process withdrawal | PATCH | `/api/v1/admin/withdrawals/:id/process` | ❌ | Approve/reject/process withdrawal |
| 17 | View astrologer's content | GET | `/api/v1/admin/astrologers/:id/content` | ❌ | Blogs, courses, remedies created by astrologer |
| 18 | View astrologer's reviews | GET | `/api/v1/admin/astrologers/:id/reviews` | ❌ | All ratings/reviews received |
| 19 | Top earners | GET | `/api/v1/admin/astrologers/top` | ✅ | Revenue-sorted astrologer list |
| 20 | Set free minutes | PATCH | `/api/v1/admin/astrologers/:id/free-minutes` | ❌ | Configure per-astrologer free minutes |
| 21 | Manage membership plans | GET/PATCH | `/api/v1/admin/astrologers/:id/memberships` | ❌ | View/edit astrologer membership options |
| 22 | Delete astrologer | DELETE | `/api/v1/admin/astrologers/:id` | ❌ | Soft-delete or deactivate permanently |
| 23 | Export astrologers | GET | `/api/v1/admin/astrologers/export` | ❌ | CSV/Excel export |
| 24 | Bulk approve/reject | PATCH | `/api/v1/admin/astrologers/bulk-action` | 📋 | Batch status updates |

### 4.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Astrologers List | ✅ | Table with search, status filter tabs |
| Astrologer Detail | ❌ | Full profile with tabs (Profile, Documents, Bank, Earnings, Content, Reviews, Call History, Interviews) |
| Astrologer Verification | ❌ | Document review & approval flow |
| Withdrawal Requests | ❌ | Pending withdrawal queue with approve/reject |

### 4.3 Status Lifecycle

```
Registration → Pending → [Document Verification] → Verified
→ [Interview Scheduled → Completed → Passed] → Approved
→ (Can be) Suspended → Unsuspended
→ (Can be) Rejected at any step
```

### 4.4 Key Enums

```
Astrologer.status: ["Pending", "Approved", "Rejected", "Suspended"]
Astrologer.verificationStatus: ["Pending", "Verified", "Rejected"]
Astrologer.interviewDetails.status: ["Pending", "Scheduled", "Completed", "Passed", "Failed"]
Astrologer.onboardingStatus: ["Pending", "Assignments_In_Progress", "Completed"]
Astrologer.bankDetails.status: ["Pending", "Verified", "Rejected"]
Astrologer.addressDetails.status: ["Pending", "Verified", "Rejected"]
```

---

## 5. Seller Management

**Entity:** `Seller` — E-commerce seller accounts with KYC and approval workflow.

### 5.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all sellers | GET | `/api/v1/admin/sellers` | ✅ | Paginated seller list |
| 2 | Get seller details | GET | `/api/v1/admin/sellers/:id` | ❌ | Full profile, KYC docs, products, order stats |
| 3 | Approve seller | PATCH | `/api/v1/admin/sellers/approve` | ✅ | Activate seller account |
| 4 | Reject seller | PATCH | `/api/v1/admin/sellers/reject` | ✅ | Block seller |
| 5 | Revert seller | PATCH | `/api/v1/admin/sellers/revert` | ✅ | Revert to Inactive |
| 6 | Verify KYC docs | PATCH | `/api/v1/admin/sellers/:id/verify-kyc` | ❌ | Review Aadhar, GST documents |
| 7 | View seller's products | GET | `/api/v1/admin/sellers/:id/products` | ❌ | All products by this seller |
| 8 | View seller's orders | GET | `/api/v1/admin/sellers/:id/orders` | ❌ | All orders containing seller's products |
| 9 | Seller earnings/payouts | GET | `/api/v1/admin/sellers/:id/earnings` | ❌ | Revenue and payout tracking |
| 10 | Edit seller details | PUT | `/api/v1/admin/sellers/:id` | ❌ | Admin override of seller profile |
| 11 | Delete seller | DELETE | `/api/v1/admin/sellers/:id` | ❌ | Deactivate with product cleanup |
| 12 | Export sellers | GET | `/api/v1/admin/sellers/export` | ❌ | CSV/Excel export |

### 5.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Sellers List | ✅ | Table with approval actions |
| Seller Detail | ❌ | Profile, KYC review, products, order stats |

---

## 6. Order & E-Commerce Management

**Entity:** `Order` — Full order lifecycle management. **COMPLETELY MISSING from admin.**

### 6.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all orders | GET | `/api/v1/admin/orders` | ❌ | Paginated with filters (status, date range, payment method, seller) |
| 2 | Get order details | GET | `/api/v1/admin/orders/:id` | ❌ | Full order with items, shipping, payment, timeline |
| 3 | Update order status | PATCH | `/api/v1/admin/orders/:id/status` | ❌ | Confirm → Processing → Packed → Shipped → Delivered |
| 4 | Cancel order | POST | `/api/v1/admin/orders/:id/cancel` | ❌ | Admin-initiated cancellation with reason |
| 5 | Process refund | POST | `/api/v1/admin/orders/:id/refund` | ❌ | Full or partial refund to user wallet |
| 6 | Update tracking | PATCH | `/api/v1/admin/orders/:id/tracking` | ❌ | Add tracking ID, courier partner, estimated delivery |
| 7 | Update item status | PATCH | `/api/v1/admin/orders/:id/items/:itemId/status` | ❌ | Per-item status updates (split shipments) |
| 8 | Add order notes | PATCH | `/api/v1/admin/orders/:id/notes` | ❌ | Internal admin notes on an order |
| 9 | Generate invoice | GET | `/api/v1/admin/orders/:id/invoice` | ❌ | PDF invoice generation |
| 10 | Order statistics | GET | `/api/v1/admin/orders/stats` | ❌ | Total, by status, revenue, avg order value |
| 11 | Export orders | GET | `/api/v1/admin/orders/export` | ❌ | CSV/Excel/PDF export with filters |
| 12 | Bulk status update | PATCH | `/api/v1/admin/orders/bulk-status` | 📋 | Update multiple orders at once |
| 13 | Refund queue | GET | `/api/v1/admin/orders/refund-queue` | ❌ | All orders with status "Refund Initiated" |
| 14 | Failed orders dashboard | GET | `/api/v1/admin/orders/failed` | ❌ | Failed payments, failed deliveries |

### 6.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Orders List | ❌ | Table with status tabs, filters, search by order ID/user |
| Order Detail | ❌ | Full order view with items, shipping, payment, timeline, actions |
| Refund Queue | ❌ | Dedicated page for processing refunds |
| Order Analytics | ❌ | Charts showing order trends, revenue, popular products |

### 6.3 Order Status Lifecycle (Admin Actions)

```
Pending → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered
    ↓         ↓           ↓                                                 
Cancelled  Cancelled   Cancelled                                          
    ↓         ↓           ↓                                                 
Refund Initiated → Refunded                                                
```

### 6.4 Key Fields

```
Order.order_status: ["Pending", "Confirmed", "Processing", "Packed", "Shipped", 
                     "Out for Delivery", "Delivered", "Cancelled", "Refund Initiated", 
                     "Refunded", "Failed"]
Order.payment_status: ["Pending", "Paid", "Failed", "Refunded"]
Order.payment_method: ["COD", "Online", "UPI", "Card", "Wallet"]
Order.cancelled_by: ["User", "Admin", "Seller", "System"]
```

---

## 7. Product Management

**Entity:** `Product` — Seller-listed products requiring admin verification. **COMPLETELY MISSING from admin.**

### 7.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all products | GET | `/api/v1/admin/products` | ❌ | All products with filters (seller, category, status, verified) |
| 2 | Get product details | GET | `/api/v1/admin/products/:id` | ❌ | Full product info with seller details |
| 3 | Verify product | PATCH | `/api/v1/admin/products/:id/verify` | ❌ | Mark as verified (makes it visible to users) |
| 4 | Reject product | PATCH | `/api/v1/admin/products/:id/reject` | ❌ | Reject with reason |
| 5 | Toggle listing | PATCH | `/api/v1/admin/products/:id/toggle-listing` | ❌ | Show/hide product from marketplace |
| 6 | Update product | PUT | `/api/v1/admin/products/:id` | ❌ | Admin override of product details |
| 7 | Delete product | DELETE | `/api/v1/admin/products/:id` | ❌ | Remove product permanently |
| 8 | Pending verification queue | GET | `/api/v1/admin/products/pending` | ❌ | All products awaiting verification |
| 9 | Product statistics | GET | `/api/v1/admin/products/stats` | ❌ | Total, by status, out of stock, low stock |
| 10 | Bulk verify | PATCH | `/api/v1/admin/products/bulk-verify` | 📋 | Verify multiple products at once |
| 11 | Export products | GET | `/api/v1/admin/products/export` | ❌ | CSV/Excel export |
| 12 | Featured products | PATCH | `/api/v1/admin/products/:id/feature` | 📋 | Mark product as featured |

### 7.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Products List | ❌ | Table with verification queue, filters by seller/category/status |
| Product Detail | ❌ | Full product view with images, verify/reject actions |
| Product Verification Queue | ❌ | Dedicated page for pending verifications |

### 7.3 Key Fields

```
Product.is_verified: Boolean (admin-controlled gate)
Product.is_listed: Boolean (visibility toggle)
Product.status: ["Draft", "Published", "Out of Stock"]
Product.stock_count: Number (low stock monitoring)
```

---

## 8. Category Management

**Entity:** `Category` — Product categories for the marketplace. **COMPLETELY MISSING from admin.**

### 8.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all categories | GET | `/api/v1/admin/categories` | ❌ | All categories with product counts |
| 2 | Create category | POST | `/api/v1/admin/categories` | ❌ | Add new product category |
| 3 | Update category | PUT | `/api/v1/admin/categories/:id` | ❌ | Edit name, description, status |
| 4 | Delete category | DELETE | `/api/v1/admin/categories/:id` | ❌ | Remove (only if no products linked) |
| 5 | Toggle status | PATCH | `/api/v1/admin/categories/:id/toggle` | ❌ | Active/Inactive toggle |
| 6 | Reorder categories | PATCH | `/api/v1/admin/categories/reorder` | 📋 | Set display order |

### 8.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Categories List | ❌ | CRUD table with inline editing |

### 8.3 Key Fields

```
Category.status: ["Active", "Inactive"]
Category.name: String (unique)
```

---

## 9. Call Session Management

**Entity:** `CallSession` — 1-to-1 audio/video calls with billing, reports, admin actions. **Best-covered admin entity.**

### 9.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | Active calls | GET | `/api/v1/admin/calls/active` | ✅ | Real-time list of ongoing calls |
| 2 | Call statistics | GET | `/api/v1/admin/calls/statistics` | ✅ | Counts, revenue, breakdown by type/status |
| 3 | Reported calls | GET | `/api/v1/admin/calls/reported` | ✅ | Calls flagged by users/astrologers |
| 4 | Report details | GET | `/api/v1/admin/calls/reported/:id` | ✅ | Detailed report info |
| 5 | Refund reported call | POST | `/api/v1/admin/calls/reported/:id/refund` | ✅ | Process refund for reported call |
| 6 | Dismiss report | POST | `/api/v1/admin/calls/reported/:id/dismiss` | ✅ | Close report without action |
| 7 | Suspend for call issues | POST | `/api/v1/admin/astrologers/:id/suspend-for-calls` | ✅ | Suspend astrologer due to call issues |
| 8 | Unsuspend | POST | `/api/v1/admin/astrologers/:id/unsuspend` | ✅ | Reverse suspension |
| 9 | Suspension history | GET | `/api/v1/admin/astrologers/:id/suspension-history` | ✅ | Full suspension log |
| 10 | All call sessions list | GET | `/api/v1/admin/calls` | ❌ | Complete call history with filters |
| 11 | Call detail by ID | GET | `/api/v1/admin/calls/:id` | ❌ | Full session details, billing, quality metrics |
| 12 | Force end call | POST | `/api/v1/admin/calls/:id/force-end` | ❌ | Terminate an active call |
| 13 | Call quality dashboard | GET | `/api/v1/admin/calls/quality` | ❌ | Network quality metrics, disconnection rates |
| 14 | Export call data | GET | `/api/v1/admin/calls/export` | ❌ | CSV/Excel export |

### 9.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Calls & Reports | ✅ | Active calls, stats, reported calls |
| All Calls List | ❌ | Combined table of all call sessions |
| Call Detail | ❌ | Full session view with quality metrics, billing, user & astrologer info |

---

## 10. Chat Session Management

**Entity:** `ChatSession` — User-astrologer chat conversations. **COMPLETELY MISSING from admin.**

### 10.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all chat sessions | GET | `/api/v1/admin/chats` | ❌ | Paginated with status filter (active/ended) |
| 2 | Chat session details | GET | `/api/v1/admin/chats/:id` | ❌ | Session info, participants, duration |
| 3 | View chat messages | GET | `/api/v1/admin/chats/:id/messages` | ❌ | Message history (for dispute resolution) |
| 4 | Force end chat | POST | `/api/v1/admin/chats/:id/force-end` | ❌ | Terminate active chat session |
| 5 | Chat statistics | GET | `/api/v1/admin/chats/stats` | ❌ | Active, total, avg duration, billing totals |
| 6 | Active chats | GET | `/api/v1/admin/chats/active` | ❌ | Real-time list of ongoing chats |
| 7 | Export chat data | GET | `/api/v1/admin/chats/export` | ❌ | CSV export |
| 8 | Flag/report chat | POST | `/api/v1/admin/chats/:id/flag` | 📋 | Admin flagging for inappropriate content |

### 10.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Chat Sessions List | ❌ | Table with active/ended tabs, filters |
| Chat Detail | ❌ | Full conversation viewer with participants, duration, billing |

---

## 11. Live Session Management

**Entity:** `LiveSession` — Astrologer live streams with Agora/YouTube. **COMPLETELY MISSING from admin.**

### 11.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all live sessions | GET | `/api/v1/admin/live-sessions` | ❌ | All sessions with status filter |
| 2 | Active live sessions | GET | `/api/v1/admin/live-sessions/active` | ❌ | Currently live sessions with viewer counts |
| 3 | Live session details | GET | `/api/v1/admin/live-sessions/:id` | ❌ | Full session info, stats, viewers, messages |
| 4 | Force end live session | POST | `/api/v1/admin/live-sessions/:id/force-end` | ❌ | Terminate a live stream |
| 5 | Delete live session message | DELETE | `/api/v1/admin/live-sessions/:id/messages/:msgId` | ❌ | Moderate chat messages |
| 6 | Live session statistics | GET | `/api/v1/admin/live-sessions/stats` | ❌ | Total views, peak viewers, engagement |
| 7 | Upcoming sessions | GET | `/api/v1/admin/live-sessions/upcoming` | ❌ | Scheduled sessions calendar |
| 8 | View recording | GET | `/api/v1/admin/live-sessions/:id/recording` | ❌ | Access session recording |
| 9 | Export live session data | GET | `/api/v1/admin/live-sessions/export` | ❌ | CSV export |

### 11.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Live Sessions List | ❌ | Table with live/scheduled/ended tabs |
| Live Session Detail | ❌ | Session view with viewer stats, chat history, recording |
| Live Dashboard | ❌ | Real-time view of active streams |

---

## 12. Wallet & Financial Management

**Entities:** `UserWalletTransaction`, `WalletTransaction` (Astrologer), `WithdrawalRequest` — **COMPLETELY MISSING from admin.**

### 12.1 User Wallet Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all user transactions | GET | `/api/v1/admin/wallet/user-transactions` | ❌ | Paginated with filters (user, type, reason, status) |
| 2 | Credit user wallet | POST | `/api/v1/admin/wallet/credit` | ❌ | Add funds to user's wallet (reason: admin_credit) |
| 3 | Debit user wallet | POST | `/api/v1/admin/wallet/debit` | ❌ | Deduct from user's wallet (reason: admin_debit) |
| 4 | Transaction details | GET | `/api/v1/admin/wallet/transactions/:id` | ❌ | Full transaction record |
| 5 | Wallet overview | GET | `/api/v1/admin/wallet/overview` | ❌ | Total platform balance, credits, debits |

### 12.2 Astrologer Wallet Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 6 | List astrologer transactions | GET | `/api/v1/admin/wallet/astrologer-transactions` | ❌ | All astrologer earnings/debits |
| 7 | Pending withdrawals | GET | `/api/v1/admin/withdrawals/pending` | ❌ | Queue of withdrawal requests |
| 8 | All withdrawals | GET | `/api/v1/admin/withdrawals` | ❌ | Full withdrawal history |
| 9 | Approve withdrawal | PATCH | `/api/v1/admin/withdrawals/:id/approve` | ❌ | Approve and mark for processing |
| 10 | Reject withdrawal | PATCH | `/api/v1/admin/withdrawals/:id/reject` | ❌ | Reject with admin comments |
| 11 | Mark processed | PATCH | `/api/v1/admin/withdrawals/:id/process` | ❌ | Mark as bank transfer completed |
| 12 | Withdrawal statistics | GET | `/api/v1/admin/withdrawals/stats` | ❌ | Total pending, processed, rejected amounts |

### 12.3 Financial Reports

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 13 | Revenue dashboard | GET | `/api/v1/admin/finance/revenue` | 🔶 | Exists partially in dashboard stats |
| 14 | Commission report | GET | `/api/v1/admin/finance/commissions` | ❌ | Platform commission breakdown |
| 15 | Refund report | GET | `/api/v1/admin/finance/refunds` | ❌ | All refunds with reasons |
| 16 | Payment gateway logs | GET | `/api/v1/admin/finance/payments` | ❌ | Payment success/failure tracking |
| 17 | Export financial data | GET | `/api/v1/admin/finance/export` | ❌ | CSV/Excel/PDF export |

### 12.4 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| User Transactions | ❌ | Searchable transaction log with filters |
| Astrologer Earnings | ❌ | Earnings ledger by astrologer |
| Withdrawal Queue | ❌ | Pending withdrawals with approve/reject actions |
| Financial Dashboard | ❌ | Revenue, commissions, refunds, payment health |

---

## 13. Blog Management

**Entity:** `Blog` — Astrologer-written blog posts with admin approval. **Well-covered.**

### 13.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all blogs | GET | `/api/v1/admin/blogs` | ✅ | Paginated with status filter, search |
| 2 | Get blog by ID | POST | `/api/v1/admin/blogs/get-by-id` | ✅ | Full blog content |
| 3 | Approve blog | PATCH | `/api/v1/admin/blogs/approve` | ✅ | Set status to Approved |
| 4 | Reject blog | PATCH | `/api/v1/admin/blogs/reject` | ✅ | Reject with reason |
| 5 | Delete blog | DELETE | `/api/v1/admin/blogs/:id` | ❌ | Remove inappropriate blog |
| 6 | Edit blog | PUT | `/api/v1/admin/blogs/:id` | ❌ | Admin edit of blog content |
| 7 | Blog statistics | GET | `/api/v1/admin/blogs/stats` | ❌ | Total, by status, most viewed, engagement |
| 8 | Featured blogs | PATCH | `/api/v1/admin/blogs/:id/feature` | 📋 | Pin or feature a blog |
| 9 | Export blogs | GET | `/api/v1/admin/blogs/export` | ❌ | CSV export |

### 13.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Blogs List | ❌ | Table with pending/approved/rejected tabs |
| Blog Detail | ❌ | Full blog view with approve/reject actions |
| Blog Editor | ❌ | Admin can edit blog content |

---

## 14. Course Management

**Entities:** `AdminCourse` + `Course` (Astrologer) + `Lesson` + `UserEnrollment` — **Partially covered.**

### 14.1 Admin Course Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List admin courses | GET | `/api/v1/admin/courses` | ✅ | Paginated admin courses |
| 2 | Create admin course | POST | `/api/v1/admin/courses` | ✅ | With thumbnail upload |
| 3 | Get course by ID | GET | `/api/v1/admin/courses/:id` | ✅ | Unified lookup |
| 4 | Update admin course | PATCH | `/api/v1/admin/courses/:id` | ✅ | Edit with thumbnail upload |
| 5 | Delete admin course | DELETE | `/api/v1/admin/courses/:id` | ✅ | Remove course |
| 6 | Get course modules | GET | `/api/v1/admin/courses/:id/modules` | ✅ | Module listing |
| 7 | Unified course list | GET | `/api/v1/admin/courses/unified` | ✅ | Both admin + astrologer courses |

### 14.2 Astrologer Course Approval

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 8 | Approve course | PATCH | `/api/v1/admin/courses/:id/approve` | ✅ | Approve astrologer course |
| 9 | Reject course | PATCH | `/api/v1/admin/courses/:id/reject` | ✅ | Reject with reason |

### 14.3 Lesson Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 10 | Create lesson | POST | `/api/v1/admin/lessons` | ✅ | With file uploads |
| 11 | Get lesson | GET | `/api/v1/admin/lessons/:id` | ✅ | Single lesson |
| 12 | List by module | GET | `/api/v1/admin/lessons/course/:courseId/:moduleId` | ✅ | Module lessons |
| 13 | Update lesson | PATCH | `/api/v1/admin/lessons/:id` | ✅ | Edit with document upload |

### 14.4 Enrollment Operations (MISSING)

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 14 | List all enrollments | GET | `/api/v1/admin/enrollments` | ❌ | All enrollments across courses |
| 15 | Enrollment details | GET | `/api/v1/admin/enrollments/:id` | ❌ | Progress, certificate status |
| 16 | Enrollment by course | GET | `/api/v1/admin/courses/:id/enrollments` | ❌ | Students enrolled in a course |
| 17 | Issue certificate | POST | `/api/v1/admin/enrollments/:id/certificate` | ❌ | Generate and issue certificate |
| 18 | Revoke enrollment | DELETE | `/api/v1/admin/enrollments/:id` | ❌ | Remove student from course |
| 19 | Course analytics | GET | `/api/v1/admin/courses/stats` | ❌ | Enrollment counts, completion rates, revenue |
| 20 | Export enrollment data | GET | `/api/v1/admin/enrollments/export` | ❌ | CSV export |

### 14.5 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Courses List | ✅ | Unified course table |
| Admin Course Form | 🔧 | Exists but uses hardcoded data |
| Course Detail | ❌ | Full course view with modules, lessons, enrollments |
| Enrollments List | ❌ | All student enrollments with progress tracking |
| Lesson Manager | ❌ | Dedicated lesson CRUD interface per course |

---

## 15. Book Management

**Entities:** `Book` + `UserBookPurchase` — Admin creates books, users purchase. **COMPLETELY MISSING from admin.**

### 15.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all books | GET | `/api/v1/admin/books` | ❌ | Paginated with filters (category, type, status, price range) |
| 2 | Create book | POST | `/api/v1/admin/books` | ❌ | Upload digital/audio book with cover, chapters |
| 3 | Get book details | GET | `/api/v1/admin/books/:id` | ❌ | Full book info with purchase stats |
| 4 | Update book | PUT | `/api/v1/admin/books/:id` | ❌ | Edit details, replace files |
| 5 | Delete book | DELETE | `/api/v1/admin/books/:id` | ❌ | Remove book |
| 6 | Toggle status | PATCH | `/api/v1/admin/books/:id/status` | ❌ | Active/Inactive/Coming Soon |
| 7 | Feature book | PATCH | `/api/v1/admin/books/:id/feature` | ❌ | Set/remove featured promotion |
| 8 | Book purchases | GET | `/api/v1/admin/books/:id/purchases` | ❌ | All users who purchased this book |
| 9 | All purchases | GET | `/api/v1/admin/book-purchases` | ❌ | Global purchase log |
| 10 | Book statistics | GET | `/api/v1/admin/books/stats` | ❌ | Total, by category, revenue, popular books |
| 11 | Manage chapters | PATCH | `/api/v1/admin/books/:id/chapters` | ❌ | Add/edit/reorder chapters |
| 12 | Export books/purchases | GET | `/api/v1/admin/books/export` | ❌ | CSV/Excel export |

### 15.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Books List | ❌ | Table with category tabs, search, filters |
| Book Form | ❌ | Create/edit form with file uploads (PDF, audio, cover image) |
| Book Detail | ❌ | Full book view with chapters, purchases, revenue |
| Purchase History | ❌ | Global book purchase log |

### 15.3 Key Fields

```
Book.type: ["Digital", "Audio", "Both"]
Book.category: ["Astrology", "Palmistry", "Vastu", "Numerology", "Tarot", "Spirituality", "Wellness", "Other"]
Book.status: ["Active", "Inactive", "Coming Soon"]
Book.isFree: Boolean
Book.featuredUntil: Date (virtual: isFeatured)
Book.createdBy: Admin (ObjectId ref)
```

---

## 16. Remedy & Booking Management

**Entities:** `Remedy` + `AstrologerRemedyService` + `RemedyBooking` — **COMPLETELY MISSING from admin.**

### 16.1 Remedy Catalog Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all remedies | GET | `/api/v1/admin/remedies` | ❌ | All remedies with category/status filter |
| 2 | Create remedy | POST | `/api/v1/admin/remedies` | ❌ | Create master remedy with specializations, requirements, pricing |
| 3 | Get remedy details | GET | `/api/v1/admin/remedies/:id` | ❌ | Full remedy info with offering astrologers |
| 4 | Update remedy | PUT | `/api/v1/admin/remedies/:id` | ❌ | Edit remedy details, specializations, pricing |
| 5 | Delete remedy | DELETE | `/api/v1/admin/remedies/:id` | ❌ | Remove remedy |
| 6 | Approve/reject remedy | PATCH | `/api/v1/admin/remedies/:id/status` | ❌ | Approve, reject, activate, deactivate |
| 7 | Feature remedy | PATCH | `/api/v1/admin/remedies/:id/feature` | ❌ | Toggle featured status |
| 8 | Remedy statistics | GET | `/api/v1/admin/remedies/stats` | ❌ | By category, popularity, revenue |
| 9 | Remedy categories | GET | `/api/v1/admin/remedies/categories` | ❌ | Category management |

### 16.2 Astrologer Remedy Service Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 10 | List all remedy services | GET | `/api/v1/admin/remedy-services` | ❌ | All astrologer → remedy mappings |
| 11 | Service details | GET | `/api/v1/admin/remedy-services/:id` | ❌ | Pricing, availability, metrics |
| 12 | Deactivate service | PATCH | `/api/v1/admin/remedy-services/:id/deactivate` | ❌ | Force-disable a service |

### 16.3 Booking Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 13 | List all bookings | GET | `/api/v1/admin/remedy-bookings` | ❌ | All bookings with status/date filters |
| 14 | Booking details | GET | `/api/v1/admin/remedy-bookings/:id` | ❌ | Full booking with requirements, payment, delivery |
| 15 | Update booking status | PATCH | `/api/v1/admin/remedy-bookings/:id/status` | ❌ | Admin status override |
| 16 | Process refund | POST | `/api/v1/admin/remedy-bookings/:id/refund` | ❌ | Refund for cancelled/disputed booking |
| 17 | View delivery content | GET | `/api/v1/admin/remedy-bookings/:id/delivery` | ❌ | Access delivered video/report/file |
| 18 | Booking statistics | GET | `/api/v1/admin/remedy-bookings/stats` | ❌ | By status, category, revenue, avg rating |
| 19 | Dispute resolution | PATCH | `/api/v1/admin/remedy-bookings/:id/resolve` | ❌ | Handle user-astrologer disputes |
| 20 | Export bookings | GET | `/api/v1/admin/remedy-bookings/export` | ❌ | CSV/Excel export |

### 16.4 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Remedies List | ❌ | Master remedy catalog management |
| Remedy Form | ❌ | Create/edit with specializations, requirements, pricing |
| Remedy Detail | ❌ | View with offering astrologers, booking history |
| Remedy Bookings | ❌ | All bookings with status tabs, filters |
| Booking Detail | ❌ | Full booking view with actions |

### 16.5 Key Enums

```
Remedy.category: ["VIP E-Pooja", "Palmistry", "Career", "Name Correction", "Face Reading", "Problem Solving", "Remedy Combos"]
Remedy.status: ["Pending", "Approved", "Rejected", "Active", "Inactive"]
Remedy.delivery_type: ["live_video", "recorded_video", "report", "consultation", "physical_item"]
RemedyBooking.status: ["pending", "confirmed", "in_progress", "completed", "cancelled"]
```

---

## 17. Review & Rating Management

**Entity:** `Review` — User reviews of astrologers. **COMPLETELY MISSING from admin.**

### 17.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | List all reviews | GET | `/api/v1/admin/reviews` | ❌ | Paginated with filters (astrologer, rating range, visibility) |
| 2 | Review details | GET | `/api/v1/admin/reviews/:id` | ❌ | Full review with user and astrologer info |
| 3 | Hide review | PATCH | `/api/v1/admin/reviews/:id/hide` | ❌ | Set isVisible=false (inappropriate content) |
| 4 | Show review | PATCH | `/api/v1/admin/reviews/:id/show` | ❌ | Restore visibility |
| 5 | Delete review | DELETE | `/api/v1/admin/reviews/:id` | ❌ | Permanent removal |
| 6 | Review statistics | GET | `/api/v1/admin/reviews/stats` | ❌ | Avg rating by astrologer, distribution, flagged reviews |
| 7 | Flagged reviews | GET | `/api/v1/admin/reviews/flagged` | 📋 | Reviews flagged by users/astrologers |
| 8 | Bulk moderation | PATCH | `/api/v1/admin/reviews/bulk-moderate` | 📋 | Hide/delete multiple reviews |

### 17.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Reviews List | ❌ | Table with rating filter, astrologer filter |
| Review Moderation | ❌ | Queue of reviews needing attention |

---

## 18. Notice & Notification Management

**Entities:** `Notice` + `Notification` — **Fully covered.**

### 18.1 Existing Operations

| # | Operation | Method | Endpoint | Status |
|---|-----------|--------|----------|--------|
| 1 | Create notice | POST | `/api/v1/admin/notices` | ✅ |
| 2 | List notices | GET | `/api/v1/admin/notices` | ✅ |
| 3 | Get notice by ID | POST | `/api/v1/admin/notices/get-by-id` | ✅ |
| 4 | Update notice | PATCH | `/api/v1/admin/notices/update` | ✅ |
| 5 | Delete notice | DELETE | `/api/v1/admin/notices/delete` | ✅ |
| 6 | Get notifications by notice | POST | `/api/v1/admin/notices/get-notifications` | ✅ |

### 18.2 Additional Operations Needed

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 7 | Push notification | POST | `/api/v1/admin/notifications/push` | ❌ | Send push notification to specific users |
| 8 | Notification templates | GET/POST | `/api/v1/admin/notification-templates` | 📋 | Reusable notification templates |
| 9 | Notification analytics | GET | `/api/v1/admin/notifications/stats` | ❌ | Read rates, delivery rates |

### 18.3 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Notices List | ✅ | Full CRUD interface |
| Notice Detail | ❌ | View recipients, read status |

---

## 19. Interview & Onboarding Management

**Entity:** `Interview` + Astrologer onboarding fields. **Good coverage but missing protectAdmin middleware.**

### 19.1 Existing Operations

| # | Operation | Method | Endpoint | Status | Notes |
|---|-----------|--------|----------|--------|-------|
| 1 | Schedule interview | POST | `/api/v1/admin/schedule-interview` | 🔧 | No protectAdmin middleware! |
| 2 | Reschedule | PUT | `/api/v1/admin/reschedule-interview` | 🔧 | No protectAdmin middleware! |
| 3 | Cancel interview | PUT | `/api/v1/admin/cancel-interview` | 🔧 | No protectAdmin middleware! |
| 4 | Complete interview | PUT | `/api/v1/admin/complete-interview` | 🔧 | No protectAdmin middleware! |
| 5 | Reject astrologer | PUT | `/api/v1/admin/reject-interview` | 🔧 | No protectAdmin middleware! |

### 19.2 Missing Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 6 | List by status | GET | `/api/v1/admin/interviews` | ❌ | `getAstrologersByStatus` exists but NO route |
| 7 | Interview calendar | GET | `/api/v1/admin/interviews/calendar` | ❌ | Calendar view of upcoming interviews |
| 8 | Interview history | GET | `/api/v1/admin/interviews/history` | ❌ | Past completed/cancelled interviews |
| 9 | Onboarding pipeline | GET | `/api/v1/admin/onboarding/pipeline` | ❌ | Astrologers at each onboarding stage |
| 10 | Update onboarding | PATCH | `/api/v1/admin/onboarding/:id/status` | ❌ | Move astrologer through onboarding stages |

### 19.3 Critical Issues

- **SECURITY:** All 5 interview routes lack `protectAdmin` middleware — anyone can access them!
- **MISSING ROUTE:** `getAstrologersByStatus` is exported but never wired to a route

### 19.4 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Interview Calendar | ❌ | Scheduled interviews with actions |
| Onboarding Pipeline | ❌ | Kanban-style pipeline view |

---

## 20. Dashboard & Analytics

### 20.1 Existing Operations

| # | Operation | Endpoint | Status |
|---|-----------|----------|--------|
| 1 | Platform stats | `/api/v1/admin/dashboard/stats` | ✅ |
| 2 | Consultation stats | `/api/v1/admin/dashboard/consultation-stats` | ✅ |
| 3 | Revenue stats | `/api/v1/admin/dashboard/revenue-stats` | ✅ |
| 4 | Engagement stats | `/api/v1/admin/dashboard/engagement-stats` | ✅ |
| 5 | User analytics | `getUserAnalytics` in dashboard controller | 🔶 (no route) |

### 20.2 Missing Analytics

| # | Operation | Endpoint | Status | Description |
|---|-----------|----------|--------|-------------|
| 6 | Product sales analytics | `/api/v1/admin/analytics/products` | ❌ | Top sellers, categories, trends |
| 7 | Book sales analytics | `/api/v1/admin/analytics/books` | ❌ | Top books, categories, revenue |
| 8 | Remedy analytics | `/api/v1/admin/analytics/remedies` | ❌ | Booking trends, popular categories |
| 9 | Course analytics | `/api/v1/admin/analytics/courses` | ❌ | Enrollment trends, completion rates |
| 10 | Live session analytics | `/api/v1/admin/analytics/live-sessions` | ❌ | Viewership trends, engagement |
| 11 | Platform health | `/api/v1/admin/analytics/health` | ❌ | Uptime, error rates, API latency |
| 12 | Geographic analytics | `/api/v1/admin/analytics/geo` | 📋 | User/astrologer distribution by location |
| 13 | Retention analytics | `/api/v1/admin/analytics/retention` | 📋 | User retention rates, churn |

### 20.3 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Main Dashboard | ✅ | Overview with key metrics |
| Revenue Dashboard | ❌ | Detailed revenue breakdown |
| Product Analytics | ❌ | Sales charts and trends |
| Consultation Analytics | ❌ | Call/chat/live session metrics |
| User Retention | ❌ | Cohort analysis, funnel visualization |

---

## 21. Reports & Exports

### 21.1 Existing Reports

| # | Report | Endpoint | Formats | Status |
|---|--------|----------|---------|--------|
| 1 | Daily usage analytics | `/api/v1/admin/reports/daily-usage` | JSON/CSV/PDF | ✅ |
| 2 | User activity stats | `/api/v1/admin/reports/user-activity` | JSON | ✅ |

### 21.2 Missing Reports

| # | Report | Endpoint | Status | Description |
|---|--------|----------|--------|-------------|
| 3 | Revenue report | `/api/v1/admin/reports/revenue` | ❌ | Detailed revenue by source (calls, chat, products, books, courses, remedies) |
| 4 | Commission report | `/api/v1/admin/reports/commissions` | ❌ | Platform commission earnings breakdown |
| 5 | Astrologer performance | `/api/v1/admin/reports/astrologer-performance` | ❌ | Ratings, earnings, consultations per astrologer |
| 6 | Product sales report | `/api/v1/admin/reports/product-sales` | ❌ | Sales by product, category, seller |
| 7 | Order fulfillment | `/api/v1/admin/reports/order-fulfillment` | ❌ | Delivery times, cancellation rates |
| 8 | Refund report | `/api/v1/admin/reports/refunds` | ❌ | All refunds with reasons and amounts |
| 9 | Book sales report | `/api/v1/admin/reports/book-sales` | ❌ | Revenue by book, category |
| 10 | Course enrollment report | `/api/v1/admin/reports/enrollments` | ❌ | Enrollment rates, completion rates |
| 11 | Remedy booking report | `/api/v1/admin/reports/remedy-bookings` | ❌ | Booking trends, revenue |
| 12 | Seller performance | `/api/v1/admin/reports/seller-performance` | ❌ | Sales, fulfillment, ratings by seller |
| 13 | Financial statement | `/api/v1/admin/reports/financial-statement` | ❌ | P&L style platform financials |
| 14 | Audit log | `/api/v1/admin/reports/audit-log` | ❌ | All admin actions with timestamps |

---

## 22. System Configuration

**COMPLETELY MISSING — No admin configuration endpoints exist.**

### 22.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | Platform settings | GET/PUT | `/api/v1/admin/settings` | ❌ | App name, logo, contact info |
| 2 | Commission rates | GET/PUT | `/api/v1/admin/settings/commission` | ❌ | Platform commission percentage (call, chat, products, remedies) |
| 3 | Free minutes config | GET/PUT | `/api/v1/admin/settings/free-minutes` | ❌ | Default free minutes for new users |
| 4 | Pricing rules | GET/PUT | `/api/v1/admin/settings/pricing` | ❌ | Min/max rates, surge pricing |
| 5 | Email templates | GET/PUT | `/api/v1/admin/settings/email-templates` | ❌ | Customizable email templates |
| 6 | SMS templates | GET/PUT | `/api/v1/admin/settings/sms-templates` | ❌ | OTP and notification SMS templates |
| 7 | Payment gateway | GET/PUT | `/api/v1/admin/settings/payment` | ❌ | Razorpay/Paytm keys and config |
| 8 | Agora/stream config | GET/PUT | `/api/v1/admin/settings/streaming` | ❌ | Agora app settings, YouTube API |
| 9 | Alert thresholds | GET/PUT | `/api/v1/admin/alerts/config` | 🔶 | Exists in controller, NO route |
| 10 | System metrics | GET | `/api/v1/admin/metrics` | 🔶 | Exists in controller, NO route |
| 11 | App version | GET/PUT | `/api/v1/admin/settings/app-version` | 📋 | Force update, min version |
| 12 | Maintenance mode | POST | `/api/v1/admin/settings/maintenance` | 📋 | Toggle maintenance mode |
| 13 | Terms & privacy | GET/PUT | `/api/v1/admin/settings/legal` | 📋 | Terms of service, privacy policy |
| 14 | Admin user management | GET/POST/DELETE | `/api/v1/admin/admins` | ❌ | Create/list/remove admin accounts |
| 15 | Admin role management | GET/POST | `/api/v1/admin/roles` | 📋 | Role-based access control |

### 22.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| General Settings | ❌ | Platform name, logo, contact, legal |
| Commission Settings | ❌ | Per-service commission rates |
| Communication Settings | ❌ | Email/SMS templates, provider config |
| Streaming Settings | ❌ | Agora/YouTube configuration |
| Admin Users | ❌ | Admin account management |

---

## 23. Referral & Promotion Management

**COMPLETELY MISSING — Astrologer referral model exists but no admin operations.**

### 23.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | Referral overview | GET | `/api/v1/admin/referrals` | ❌ | All referrals with rewards |
| 2 | Referral chains | GET | `/api/v1/admin/referrals/chains` | ❌ | Who referred whom |
| 3 | Configure rewards | PUT | `/api/v1/admin/referrals/config` | ❌ | Set referral reward amounts |
| 4 | Coupon CRUD | GET/POST/PUT/DELETE | `/api/v1/admin/coupons` | ❌ | Create discount coupons |
| 5 | Promotional banners | GET/POST/PUT/DELETE | `/api/v1/admin/promotions/banners` | ❌ | Homepage promotional banners |
| 6 | Featured listings | PATCH | `/api/v1/admin/featured` | ❌ | Featured astrologers, books, remedies |
| 7 | Campaign analytics | GET | `/api/v1/admin/promotions/analytics` | ❌ | Promotion performance tracking |

### 23.2 Frontend Pages Needed

| Page | Status | Description |
|------|--------|-------------|
| Referral Dashboard | ❌ | Referral chains, rewards, configuration |
| Coupon Manager | ❌ | CRUD for discount coupons |
| Promotions | ❌ | Banner management, featured listings |

---

## 24. Content Moderation

### 24.1 Required Operations

| # | Content Type | Moderation Status | Description |
|---|-------------|------------------|-------------|
| 1 | Blogs | ✅ Approve/Reject | Via blog controller |
| 2 | Astrologer Courses | ✅ Approve/Reject | Via course controller |
| 3 | Remedies | ❌ None | Need approve/reject/activate/deactivate |
| 4 | Products | ❌ None | Need verify/reject |
| 5 | Reviews | ❌ None | Need hide/show/delete |
| 6 | Live Session messages | ❌ None | Need delete/moderate |
| 7 | Chat messages | ❌ None | Need flag/review |
| 8 | User profile photos | 📋 | Optional moderation |
| 9 | Blog images | 📋 | Optional moderation |
| 10 | Product images | 📋 | Optional moderation |

### 24.2 Unified Moderation Queue (Recommended)

A single page showing all content pending moderation:
- Pending blogs
- Pending astrologer courses
- Pending remedies
- Unverified products
- Flagged reviews
- Reported chats/calls

---

## 25. Audit & Security

### 25.1 Required Operations

| # | Operation | Method | Endpoint | Status | Description |
|---|-----------|--------|----------|--------|-------------|
| 1 | Admin action log | GET | `/api/v1/admin/audit-log` | ❌ | All admin actions with who/what/when |
| 2 | Login history | GET | `/api/v1/admin/audit-log/logins` | ❌ | Admin login attempts |
| 3 | API access log | GET | `/api/v1/admin/audit-log/api` | ❌ | API call history |
| 4 | Failed login alerts | GET | `/api/v1/admin/security/failed-logins` | ❌ | Brute force detection |
| 5 | Suspicious activity | GET | `/api/v1/admin/security/suspicious` | ❌ | Unusual patterns |
| 6 | Data export (GDPR) | POST | `/api/v1/admin/security/data-export` | 📋 | Export all user data |
| 7 | Data deletion (GDPR) | DELETE | `/api/v1/admin/security/data-delete` | 📋 | Right to be forgotten |

### 25.2 Security Issues Found

| Issue | Severity | Location |
|-------|----------|----------|
| Interview routes lack `protectAdmin` middleware | **CRITICAL** | `InterviewRoutes.js` |
| No rate limiting on admin login | HIGH | `admin.routes.js` |
| No admin action audit logging | MEDIUM | All controllers |
| No IP whitelisting for admin | LOW | Middleware |

---

## 26. Gap Analysis Summary

### 26.1 Coverage by Domain

| Domain | Total Ops Needed | Existing | Missing | Coverage |
|--------|-----------------|----------|---------|----------|
| User Management | 20 | 4 | 16 | 20% |
| Astrologer Management | 24 | 6 | 18 | 25% |
| Seller Management | 12 | 4 | 8 | 33% |
| Order Management | 14 | 0 | 14 | **0%** |
| Product Management | 12 | 0 | 12 | **0%** |
| Category Management | 6 | 0 | 6 | **0%** |
| Call Management | 14 | 9 | 5 | 64% |
| Chat Management | 8 | 0 | 8 | **0%** |
| Live Session Management | 9 | 0 | 9 | **0%** |
| Wallet & Financial | 17 | 0 | 17 | **0%** |
| Blog Management | 9 | 4 | 5 | 44% |
| Course Management | 20 | 13 | 7 | 65% |
| Book Management | 12 | 0 | 12 | **0%** |
| Remedy & Booking | 20 | 0 | 20 | **0%** |
| Review Management | 8 | 0 | 8 | **0%** |
| Notice & Notification | 9 | 6 | 3 | 67% |
| Interview & Onboarding | 10 | 5 | 5 | 50% |
| Dashboard & Analytics | 13 | 4 | 9 | 31% |
| Reports & Exports | 14 | 2 | 12 | 14% |
| System Configuration | 15 | 0 | 15 | **0%** |
| Referral & Promotions | 7 | 0 | 7 | **0%** |
| Content Moderation | 10 | 2 | 8 | 20% |
| Audit & Security | 7 | 0 | 7 | **0%** |
| **TOTALS** | **~284** | **~59** | **~225** | **~21%** |

### 26.2 Critical Gaps (Must-Have for Production)

1. **Order Management** — Cannot run e-commerce without it
2. **Product Management** — Products need verification to be visible
3. **Wallet & Financial** — No way to manage money, process withdrawals
4. **Remedy Management** — Core astrology feature has zero admin control
5. **Book Management** — Books are created by admin but no CRUD exists
6. **System Configuration** — No way to change platform settings

### 26.3 Frontend Pages Summary

| Total Pages Needed | Existing | Missing |
|-------------------|----------|---------|
| ~35 | 6 | ~29 |

### 26.4 Security Issues

| Issue | Priority |
|-------|----------|
| Interview routes unprotected | P0 — Critical |
| Alerts controller has no routes | P1 — High |
| Metrics controller has no routes | P1 — High |
| `getUserAnalytics` has no route | P2 — Medium |
| No admin audit logging | P2 — Medium |
| Base URL mismatch (frontend `/api/admin` vs backend `/api/v1/admin`) | P1 — High |

---

## 27. Priority Implementation Roadmap

### Phase 1 — Critical (Week 1-2) — Security & Money

| Task | Effort | Priority |
|------|--------|----------|
| Add `protectAdmin` to interview routes | 30 min | P0 |
| Fix frontend base URL from `/api/admin` to `/api/v1/admin` | 1 hr | P0 |
| Wire alerts + metrics controllers to routes | 1 hr | P1 |
| Wire `getUserAnalytics` + `getAstrologersByStatus` to routes | 30 min | P1 |
| **Order Management** — Backend CRUD (list, detail, status update, cancel, refund) | 3-4 days | P0 |
| **Order Management** — Frontend (orders list, detail, refund queue) | 2-3 days | P0 |
| **Withdrawal Management** — Backend (list, approve, reject, process) | 2 days | P0 |
| **Withdrawal Management** — Frontend (withdrawal queue) | 1-2 days | P0 |

### Phase 2 — Core Business (Week 3-4) — Products & Content

| Task | Effort | Priority |
|------|--------|----------|
| **Product Management** — Backend (list, verify, reject, toggle listing) | 2-3 days | P0 |
| **Product Management** — Frontend (products list, verification queue) | 2 days | P0 |
| **Category Management** — Backend + Frontend CRUD | 1-2 days | P1 |
| **Book Management** — Backend CRUD + Frontend | 3-4 days | P1 |
| **Remedy Management** — Backend CRUD + approve/reject | 2-3 days | P1 |
| **Remedy Booking** — Backend list/detail/status/refund | 2 days | P1 |
| **Remedy Management** — Frontend pages | 2-3 days | P1 |

### Phase 3 — User Experience (Week 5-6) — Details & Moderation

| Task | Effort | Priority |
|------|--------|----------|
| **User Detail Page** — Backend (single user + related data) | 2 days | P1 |
| **User Detail Page** — Frontend (tabbed detail view) | 2-3 days | P1 |
| **Astrologer Detail Page** — Backend + Frontend | 3-4 days | P1 |
| **Seller Detail Page** — Backend + Frontend | 2 days | P1 |
| **Review Management** — Backend (list, hide, show, delete) + Frontend | 2 days | P2 |
| **Chat Session Management** — Backend (list, view history) + Frontend | 2-3 days | P2 |
| **Live Session Management** — Backend (list, view, force-end) + Frontend | 2-3 days | P2 |

### Phase 4 — Analytics & Operations (Week 7-8)

| Task | Effort | Priority |
|------|--------|----------|
| **Enrollment Management** — Backend + Frontend | 2-3 days | P2 |
| **Wallet Admin** — User wallet credit/debit | 1-2 days | P2 |
| **Additional Reports** — Revenue, product sales, astrologer performance | 3-4 days | P2 |
| **Content Moderation Queue** — Unified moderation page | 2 days | P2 |
| **Blog/Notice detail pages** — Frontend completion | 2 days | P2 |
| **Admin Course** — Fix hardcoded data, connect to real API | 1 day | P2 |

### Phase 5 — Advanced Features (Week 9-10+)

| Task | Effort | Priority |
|------|--------|----------|
| **System Configuration** — Backend + Frontend settings pages | 3-4 days | P2 |
| **Admin Audit Log** — Middleware + log viewer | 2-3 days | P3 |
| **Referral Management** — Dashboard, config | 2 days | P3 |
| **Coupon/Promotion** — CRUD + frontend | 3-4 days | P3 |
| **Financial Dashboard** — Comprehensive financial reporting | 3 days | P3 |
| **GDPR Compliance** — Data export/delete | 2 days | P3 |
| **Role-based Admin** — Multi-admin with permissions | 3-4 days | P3 |
| **Export Functionality** — CSV/Excel/PDF for all entities | 2-3 days | P3 |

### Total Estimated Effort

| Phase | Duration | Priority Level |
|-------|----------|----------------|
| Phase 1 — Security & Money | 2 weeks | Critical |
| Phase 2 — Products & Content | 2 weeks | High |
| Phase 3 — User Experience | 2 weeks | High |
| Phase 4 — Analytics & Operations | 2 weeks | Medium |
| Phase 5 — Advanced Features | 2+ weeks | Low-Medium |
| **Total** | **~10 weeks** | — |

---

## Appendix A — Entity-to-Admin Operations Matrix

| Entity | List | Detail | Create | Update | Delete | Approve | Status | Stats | Export |
|--------|------|--------|--------|--------|--------|---------|--------|-------|--------|
| User | ✅ | ❌ | N/A | ❌ | ❌ | N/A | ✅ | 🔶 | ❌ |
| Astrologer | ✅ | ❌ | N/A | ❌ | ❌ | 🔶 | ✅ | 🔶 | ❌ |
| Seller | ✅ | ❌ | N/A | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Order | ❌ | ❌ | N/A | ❌ | ❌ | N/A | ❌ | ❌ | ❌ |
| Product | ❌ | ❌ | N/A | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Category | ❌ | N/A | ❌ | ❌ | ❌ | N/A | ❌ | N/A | N/A |
| CallSession | ✅ | 🔶 | N/A | N/A | N/A | N/A | ✅ | ✅ | ❌ |
| ChatSession | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | ❌ | ❌ |
| LiveSession | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | ❌ | ❌ |
| UserWalletTxn | ❌ | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | ❌ |
| AstrologerWallet | ❌ | ❌ | N/A | N/A | N/A | N/A | N/A | ❌ | ❌ |
| WithdrawalReq | ❌ | ❌ | N/A | N/A | N/A | ❌ | ❌ | ❌ | ❌ |
| Blog | ✅ | ✅ | N/A | ❌ | ❌ | ✅ | N/A | ❌ | ❌ |
| AdminCourse | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ❌ | ❌ |
| AstrologerCourse | ✅ | ✅ | N/A | N/A | N/A | ✅ | N/A | ❌ | ❌ |
| Lesson | N/A | ✅ | ✅ | ✅ | ❌ | N/A | N/A | N/A | N/A |
| Enrollment | ❌ | ❌ | N/A | N/A | ❌ | N/A | ❌ | ❌ | ❌ |
| Book | ❌ | ❌ | ❌ | ❌ | ❌ | N/A | ❌ | ❌ | ❌ |
| BookPurchase | ❌ | ❌ | N/A | N/A | N/A | N/A | N/A | ❌ | ❌ |
| Remedy | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| RemedyService | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | ❌ | ❌ |
| RemedyBooking | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | ❌ | ❌ |
| Review | ❌ | ❌ | N/A | N/A | ❌ | N/A | ❌ | ❌ | ❌ |
| CallPackage | ❌ | ❌ | N/A | N/A | N/A | N/A | ❌ | N/A | N/A |
| Notice | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | N/A |
| Notification | 🔶 | N/A | N/A | N/A | N/A | N/A | N/A | ❌ | N/A |
| Interview | 🔧 | N/A | ✅ | ✅ | ✅ | N/A | ✅ | ❌ | ❌ |
| Admin | N/A | N/A | ❌ | ❌ | ❌ | N/A | N/A | N/A | N/A |

---

## Appendix B — Complete API Endpoints Needed (Summary Count)

| Domain | Existing Endpoints | New Endpoints Needed | Total |
|--------|-------------------|---------------------|-------|
| Auth & Admin | 2 | 4 | 6 |
| Users | 4 | 16 | 20 |
| Astrologers | 8 | 16 | 24 |
| Sellers | 4 | 8 | 12 |
| Orders | 0 | 14 | 14 |
| Products | 0 | 12 | 12 |
| Categories | 0 | 6 | 6 |
| Calls | 9 | 5 | 14 |
| Chats | 0 | 8 | 8 |
| Live Sessions | 0 | 9 | 9 |
| Wallet/Finance | 0 | 17 | 17 |
| Blogs | 4 | 5 | 9 |
| Courses/Lessons | 13 | 7 | 20 |
| Books | 0 | 12 | 12 |
| Remedies/Bookings | 0 | 20 | 20 |
| Reviews | 0 | 8 | 8 |
| Notices | 6 | 3 | 9 |
| Interviews | 5 | 5 | 10 |
| Dashboard | 4 | 9 | 13 |
| Reports | 2 | 12 | 14 |
| Settings | 0 | 15 | 15 |
| Referrals/Promos | 0 | 7 | 7 |
| Audit/Security | 0 | 7 | 7 |
| **TOTAL** | **~61** | **~225** | **~286** |

---

> **Document Generated From:** Full codebase analysis of 25 Mongoose models, 21 controllers (130+ functions), 3 route files, and the complete Next.js admin panel. This document represents the complete set of admin operations required for a production-ready astrology consulting + e-commerce platform.
