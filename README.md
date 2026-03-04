# gadgetory - E-commerce Platform

A full-stack e-commerce platform built with Next.js 14, MongoDB, and NextAuth.js, featuring dual user roles (Shop Owners & Customers), real-time inventory management, and comprehensive order processing.

## Live Demo

**Live Site:** [Your deployment URL]

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Additional Features](#additional-features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Requirements (Assignment)

#### Authentication & Authorization

- ✓ JWT-based authentication with Access & Refresh tokens
- ✓ NextAuth.js integration with session management
- ✓ Google OAuth (Social Login)
- ✓ Email/Password registration and login
- ✓ Password reset via email (Nodemailer)
- ✓ Protected routes for Shop Owners and Customers
- ✓ Parallel routing & Intercepting routes for login/register modals

#### User Roles

**Shop Owner:**

- ✓ Complete shop profile management
- ✓ Add, edit, delete, publish/unpublish products
- ✓ Product inventory management with stock tracking
- ✓ Order management with status updates (Pending → Confirmed → Shipped → Delivered)
- ✓ View all orders for owned products
- ✓ Filter and search own products
- ✓ Upload product images to ImageKit

**Customer:**

- ✓ Browse products with advanced filtering
- ✓ Add to cart and checkout
- ✓ Place orders with address management
- ✓ View order history and track status
- ✓ Download PDF invoices
- ✓ Write, edit, and delete product reviews (only for purchased items)
- ✓ Cancel orders (before shipping)

#### Product Management

- ✓ Dynamic product creation with specifications
- ✓ Multiple image upload (main + 4 additional)
- ✓ Real-time stock management
- ✓ Category and brand filtering
- ✓ Price range filtering
- ✓ Rating-based filtering
- ✓ Availability filters (In Stock, Pre-Order)
- ✓ Condition filters (New, Renewed)
- ✓ Product sorting (Price, Rating, Newest)

#### Search & Discovery

- ✓ Global search with keyword and category
- ✓ Category-based navigation
- ✓ Featured products (most purchased)
- ✓ Related products recommendation
- ✓ Shop directory with individual shop pages

#### Orders & Payments

- ✓ Multi-item cart management
- ✓ Guest checkout support
- ✓ Order summary with delivery/service fees
- ✓ Fake payment simulation
- ✓ Order confirmation email with PDF invoice
- ✓ PDF invoice generation (jsPDF)
- ✓ Order status tracking
- ✓ Re-order functionality

#### Reviews & Ratings

- ✓ Purchase-verified reviews only
- ✓ One review per product per user
- ✓ Edit/delete own reviews
- ✓ Real-time average rating calculation
- ✓ Review pagination (Load More)
- ✓ User's review displayed first

---

## Features Updates & Improvements

### Customer Experience Enhancements

- **Customer Account Dashboard:** Complete account overview page with profile statistics and activity tracking
- **Avatar Upload System:** Profile picture management with image upload functionality
- **Recent Orders Widget:** Quick access to last 3 orders with status tracking on dashboard
- **Enhanced Profile Editor:** Edit/view mode toggle for seamless profile information updates
- **Address Management:** Save and manage delivery addresses
- **Mobile Number Integration:** Add and update contact information

### Shop Owner Portal Upgrades

- **Shop Avatar Management:** Upload and update shop profile pictures
- **Enhanced Shop Dashboard:** Improved seller portal with better navigation and stats overview
- **Advanced Product Analytics:** Better insights into product performance
- **Streamlined Product Management:** Improved UI/UX for managing product listings

### UI/UX Improvements

- **Design Refinements:** Polished interface with improved spacing, colors, and typography
- **Better Responsive Design:** Enhanced mobile and tablet experience
- **Performance Optimizations:** Faster page loads and smoother interactions
- **Improved Notifications:** Better toast messages and user feedback
- **Enhanced Interactivity:** Smoother transitions and hover effects

---

---

## Additional Features (Beyond Requirements)

### Enhanced UI/UX

- ✓ **Responsive Design:** Mobile-first approach with Tailwind CSS
- ✓ **Toast Notifications:** Real-time feedback with react-toastify
- ✓ **Loading States:** Skeleton screens and spinners
- ✓ **Image Optimization:** Next.js Image component with ImageKit CDN

### Advanced Filtering

- ✓ **Multi-filter Support:** Combine category, brand, price, rating, stock, condition
- ✓ **URL-based Filters:** Shareable filter states via query parameters
- ✓ **Clear Filters:** One-click filter reset
- ✓ **Active Filter Display:** Visual indicator of applied filters
- ✓ **Pagination:** Server-side pagination for product lists (10 items/page)

### Shop Features

- ✓ **Shop Ratings:** Aggregate ratings from all shop products
- ✓ **Shop Profile:** Avatar, banner, description, specialization
- ✓ **Brand Partnerships:** Display official brand associations
- ✓ **Shop Statistics:** Total products, average rating, review count
- ✓ **Shop Preview Card:** Visual shop representation with verified badge

### Customer Dashboard

- ✓ **Account Overview:** Profile stats and recent activity
- ✓ **Recent Orders Summary:** Last 3 orders with quick actions
- ✓ **Order Statistics:** Total, delivered, in-progress counts
- ✓ **Profile Management:** Avatar upload, address, mobile number
- ✓ **Edit/View Mode Toggle:** Seamless profile editing

### Product Management

- ✓ **Bulk Actions:** Multi-select products for batch operations
- ✓ **Status Management:** Publish/unpublish with visual indicators
- ✓ **Advanced Filters:** Filter by status, category, brand in manage page
- ✓ **Inline Editing:** Edit product modal with real-time preview
- ✓ **Image Management:** Add/remove additional images dynamically
- ✓ **SKU Auto-generation:** Automatic SKU creation

### Performance & SEO

- ✓ **Server Components:** Leveraging Next.js 15 server components
- ✓ **Metadata API:** Dynamic SEO tags per page
- ✓ **Image Lazy Loading:** Optimized image delivery
- ✓ **Code Splitting:** Automatic route-based splitting
- ✓ **MongoDB Indexing:** Optimized queries for category, brand, sellerId

### Security

- ✓ **Session-based Auth:** Secure JWT tokens (1 hour expiry)
- ✓ **Refresh Tokens:** 30-day session renewal
- ✓ **CSRF Protection:** NextAuth CSRF tokens
- ✓ **Password Hashing:** bcryptjs with salt rounds
- ✓ **Environment Variables:** Secure credential management
- ✓ **Input Validation:** Server-side validation for all forms

### Email System

- ✓ **Order Confirmation:** Automated email with PDF invoice
- ✓ **Password Reset:** Secure token-based reset emails
- ✓ **Nodemailer Integration:** Gmail SMTP configuration
- ✓ **HTML Email Templates:** Branded email layouts

### Developer Experience

- ✓ **TypeScript Ready:** Can be converted to TypeScript
- ✓ **ESLint Configuration:** Code quality enforcement
- ✓ **Git Workflow:** Feature branches with clear commits
- ✓ **Error Handling:** Consistent error responses
- ✓ **Console Logging:** Debug logs for development
- ✓ **MongoDB Transactions:** Atomic stock updates

---

## Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** React Toastify
- **PDF Generation:** jsPDF
- **Internationalization:** formatjs/intl-localematcher
- **Image Upload:** ImageKit

### Backend

- **Runtime:** Node.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 8.9.3
- **Authentication:** NextAuth.js 5.0.0-beta.30
- **Email:** Nodemailer
- **Password Hashing:** bcryptjs

### DevOps & Deployment

- **Hosting:** Vercel (recommended)
- **Database:** MongoDB Atlas
- **CDN:** ImageKit for images
- **Version Control:** Git & GitHub

---

## Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- MongoDB Atlas account
- ImageKit account
- Gmail account (for Nodemailer)
- Google OAuth credentials

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/aarifhsn/gadgetory
cd gadgetory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gadgetory

# NextAuth
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Email (Nodemailer)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Routes

### Authentication (`/api/auth`)

```
POST   /api/auth/register                    # User registration
POST   /api/auth/forgot-password             # Request password reset
POST   /api/auth/reset-password              # Reset password with token
POST   /api/auth/callback/credentials        # Email/password login
POST   /api/auth/callback/google             # Google OAuth
GET    /api/auth/session                     # Get current session
POST   /api/auth/signout                     # Logout
```

### Customer (`/api/customer`)

```
PUT    /api/customer/account                 # Update customer profile
```

### Orders (`/api/orders`)

```
POST   /api/orders/create                    # Create new order
PUT    /api/orders/update-status             # Update order status (Shop Owner)
DELETE /api/orders/cancel                    # Cancel order (Customer)
```

### Reviews (`/api/reviews`)

```
GET    /api/reviews/can-review               # Check if user can review product
GET    /api/reviews/user-reviews             # Get all user's reviews
POST   /api/reviews/create                   # Create new review
PUT    /api/reviews/update                   # Update existing review
DELETE /api/reviews/delete                   # Delete review
```

### Shop (`/api/shop`)

```
PUT    /api/shop/profile                     # Update shop profile
```

---

## Page Routes

### Public Routes

```
/                                     # Homepage
/products                             # All products
/products/[slug]                      # Product details
/shops                                # Shop directory
/shops/[id]                           # Individual shop page
```

### Auth Routes (Intercepting + Parallel)

```
/login                                # Login page
/register                             # Registration page
/@modal/login                         # Login modal (intercepted)
/@modal/register                      # Register modal (intercepted)
```

### Customer Routes (Protected)

```
/account                              # Customer dashboard
/orders                               # Order history
/cart                                 # Shopping cart
/checkout                             # Checkout page
/checkout/success                     # Order confirmation
```

### Shop Owner Routes (Protected)

```
/seller/profile                       # Shop profile management
/products/create                      # Add new product
/products/manage-list                 # Manage products
/orders                               # Manage orders (shared with customers)
```

---

## License

This project is created for educational purposes as part of Learn with Sumit - Batch 4 Final Assignment.

**Note:** Do not use this project for commercial purposes or in your CV/Resume as per Learn with Sumit platform guidelines.

---

## Author

**Your Name**

- GitHub: [@aarifhsn](https://github.com/aarifhsn)
- Email: aarifhsn@gmail.com

---

## Acknowledgments

- Learn with Sumit for the assignment structure
- Next.js team for the amazing framework
- MongoDB for the database
- ImageKit for image CDN
- Vercel for hosting

---

**Made with ❤️ by [Arif Hassan]**

# gadgetory
