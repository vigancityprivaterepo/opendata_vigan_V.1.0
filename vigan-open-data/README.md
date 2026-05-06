# Vigan City Open Data Portal

The official Open Data Portal for the City Government of Vigan, Ilocos Sur. Built to democratize access to public data and drive transparency in our heritage city.

This is a modern, decoupled architecture:
1.  **Backend:** CKAN 2.10 (Python) + PostgreSQL (with PostGIS & DataStore) + Solr + Redis
2.  **Frontend:** Next.js 14 + TailwindCSS (React) for the citizen-facing portal.
3.  **Infrastructure:** Fully containerized with Docker and orchestrated via Docker Compose.

---

## 🏛️ Architecture & Tech Stack

*   **CKAN Core:** Serves as the authoritative registry for datasets and organizations. Provides the Action API.
*   **ckanext-vigan:** Custom CKAN extension providing a heritage-themed CSS design system (`vigan.css`), Jinja2 template overrides, and helper functions for the CKAN admin UI.
*   **Next.js Frontend:** A fast, SEO-optimized public portal built with Server Components, interacting directly with the CKAN API.
*   **DataStore & DataPusher:** Integrated services enabling tabular data parsing (CSV, Excel) to be queried via API.
*   **Nginx Reverse Proxy:** Routes `/` to the Next.js frontend and `/api` or `/ckan-admin` to the CKAN backend. Handles uploads up to 100MB.

## 🚀 Quick Start (Development)

Prerequisites: [Docker](https://docs.docker.com/get-docker/) & Docker Compose.

### 1. Initial Setup

Run the master orchestrator to build images, initialize databases, and seed the default Vigan departments:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Accessing the Portal

*   **Public Portal (Next.js):** http://localhost
*   **CKAN Admin UI:** http://localhost/user/login
*   **Default Admin Credentials:**
    *   **User:** `vigancity_admin`
    *   **Password:** `VCAdmin@2026!`

### 3. Stopping Services

```bash
cd docker
docker-compose down
```

## 📂 Project Structure

```text
vigan-open-data/
├── docker/                  # Docker Compose and configs (Nginx, CKAN, etc.)
│   ├── .env                 # Environment variables
│   ├── docker-compose.yml   # Production-ready compose configuration
│   ├── postgres/            # Database initialization scripts
│   └── nginx/               # Reverse proxy routing logic
├── frontend/                # Next.js 14 citizen-facing portal
│   ├── app/                 # Routes, pages, and layouts
│   ├── components/          # Reusable React components
│   └── lib/                 # CKAN API client and utilities
├── ckan-extensions/         # Custom CKAN plugins
│   └── ckanext-vigan/       # The "Emerald & Amber" Vigan Theme extension
└── scripts/                 # Utility scripts (seeding, deployment)
```

## 🎨 Theme Details
The Vigan theme utilizes an "Emerald and Amber" palette (`--vigan-primary: #065F46`, `--vigan-gold: #F59E0B`) to reflect the city's heritage. The design includes:
* **Playfair Display:** Primary font for headings representing a colonial, historical feel.
* **Source Sans 3:** Legible font for data tables and body text.
* **SVG Seal:** The official city government seal integrated as the portal's branding.

## 🧑‍💻 Contributing
We welcome contributions! Please verify you are using the correct Node.js version (20+) and that CKAN custom extensions adhere to the existing Jinja2 templating standards.
