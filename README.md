<div align="center">
	<img src="public/images/logo.png" alt="Lush Ayush Ayurveda Spa logo" width="150" />
	<h1>Lush Ayush</h1>
	<p><strong>Ayurvedic Wellness E-commerce Platform</strong></p>
	<p>A calm, modern storefront for discovering Ayurvedic products, exploring wellness services, and making bookings.</p>
	<p>
		<img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
		<img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
		<img alt="Express" src="https://img.shields.io/badge/Express-4-222222?logo=express&logoColor=white" />
		<img alt="SQLite" src="https://img.shields.io/badge/SQLite-database-4169E1?logo=sqlite&logoColor=white" />
	</p>
</div>

<p align="center">
	<img src="public/images/ayurveda_hero.png" alt="Ayurvedic herbs and wellness ingredients" width="680" />
</p>

## About

Lush Ayush brings an Ayurvedic wellness storefront and spa booking experience together in one application. The React frontend is backed by an Express API, with SQLite for orders, payments, and bookings.

## Features

- Browse wellness products and manage items in the shopping cart.
- Explore services and submit appointment bookings.
- Place orders using the checkout flows available in the app, including cash on delivery, bank transfer, mobile wallet, and Stripe Checkout.
- Store and review orders and bookings through the Express API and SQLite database.
- View and update order statuses from the admin orders page.
- Use a responsive interface with dedicated home, services, booking, checkout, and admin routes.

## Tech Stack

| Area     | Technologies                                  |
| -------- | --------------------------------------------- |
| Frontend | React 19, Vite 8, React Router, Framer Motion |
| Backend  | Node.js, Express 4                            |
| Database | SQLite                                        |
| Payments | Stripe Checkout and webhook integration       |

## Getting Started

### Requirements

- Node.js and npm
- Stripe test credentials to exercise Stripe Checkout and webhook payments

### Install

```bash
git clone https://github.com/kavindikanishka03-eng/Lush-Ayush-Ayurvedic-Wellness-E-commerce-Platform.git
cd Lush-Ayush-Ayurvedic-Wellness-E-commerce-Platform
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Set your Stripe test keys in `.env` before testing Stripe payments. Keep real credentials private; `.env` is excluded from Git.

### Run Locally

Start the frontend and API together:

```bash
npm run dev:all
```

- Storefront: <http://localhost:5173>
- API: <http://localhost:4242>
- Health check: <http://localhost:4242/api/health>

The API creates its SQLite database at `server/database.sqlite` when it starts. The local database is intentionally excluded from Git.

To start either process separately:

```bash
npm run dev
npm run dev:server
```

## Environment Variables

| Variable                 | Purpose                                              | Default/example                     |
| ------------------------ | ---------------------------------------------------- | ----------------------------------- |
| `PORT`                   | Express API port                                     | `4242`                              |
| `FRONTEND_URL`           | Frontend origin used for CORS and Stripe return URLs | `http://localhost:5173`             |
| `VITE_API_URL`           | API base URL used by the frontend                    | `http://localhost:4242`             |
| `STRIPE_SECRET_KEY`      | Stripe server-side API key                           | Set a Stripe test key               |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key configuration                 | Set a Stripe test key               |
| `STRIPE_WEBHOOK_SECRET`  | Verifies Stripe webhook events                       | Set a Stripe webhook signing secret |

For local webhook testing with the Stripe CLI, forward events to `http://localhost:4242/api/webhook` and use the signing secret it provides.

## API Overview

| Method | Endpoint                       | Purpose                            |
| ------ | ------------------------------ | ---------------------------------- |
| `GET`  | `/api/health`                  | Check API health                   |
| `POST` | `/api/orders`                  | Create an order                    |
| `GET`  | `/api/orders`                  | List orders                        |
| `GET`  | `/api/orders/:id`              | Get an order by ID or order number |
| `PUT`  | `/api/orders/:id/status`       | Update payment/order status        |
| `POST` | `/api/bookings`                | Create a service booking           |
| `GET`  | `/api/bookings`                | List bookings                      |
| `POST` | `/api/create-checkout-session` | Create a Stripe Checkout session   |
| `POST` | `/api/webhook`                 | Receive Stripe webhook events      |

## Project Structure

```text
src/
	components/    Shared storefront components
	context/       Shopping cart state
	pages/         Home, services, booking, checkout, and admin pages
server/
	index.js       Express API and Stripe integration
	db.js          SQLite setup and data operations
public/images/   Storefront imagery and product assets
```

## Scripts

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the Vite development server             |
| `npm run dev:server` | Start the Express API                         |
| `npm run dev:all`    | Start frontend and API together               |
| `npm run build`      | Create a production frontend build in `dist/` |
| `npm run preview`    | Preview the production frontend build         |
| `npm run lint`       | Run ESLint across the project                 |

## Production Note

The admin page and order-management API endpoints do not currently include authentication or authorization. Add access control and review payment, database, and deployment settings before exposing this application publicly.
