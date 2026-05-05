# ShoppingApp Admin Backend

Production-oriented admin backend built with Express, MongoDB, and Mongoose.

## Highlights

- Admin auth with role-based access control
- Dashboard analytics
- Product, category, coupon, customer, review, order, notification, report, and settings APIs
- Account lockout and reset-token flow
- Repository + service + controller layering
- Swagger docs endpoint at `/docs`
- Docker support

## Main admin routes

- `POST /api/admin-panel/auth/login`
- `POST /api/admin-panel/auth/forgot-password`
- `POST /api/admin-panel/auth/reset-password`
- `GET /api/admin-panel/dashboard`
- `GET /api/admin-panel/catalog/products`
- `GET /api/admin-panel/catalog/categories`
- `GET /api/admin-panel/orders`
- `GET /api/admin-panel/customers`
- `GET /api/admin-panel/coupons`
- `GET /api/admin-panel/reviews`
- `GET /api/admin-panel/notifications`
- `GET /api/admin-panel/reports/revenue`
- `GET /api/admin-panel/settings`

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start MongoDB
4. Seed catalog data with `npm run seed`
5. Seed admin/settings with `npm run seed:admin`
6. Start the API with `npm run dev`

## Default admin

- Email: value from `ADMIN_DEFAULT_EMAIL`
- Password: value from `ADMIN_DEFAULT_PASSWORD`

## Notes

- Upload service is abstraction-ready; connect Cloudinary or S3 credentials for real media storage.
- Swagger spec is scaffolded and mounted; expand endpoint annotations as the API stabilizes.
