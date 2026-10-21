<div align="center">

  <img src="public/images/gggg.jpg" alt="Synkro Logo" width="90" style="border-radius: 16px; margin-bottom: 12px;" />

  # SYNKRO

  **Engineering Discovery, Scalable Architecture & System Design Platform**

  [![Node.js](https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-v5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
  [![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)
  [![UptimeRobot](https://img.shields.io/badge/UptimeRobot-Monitored-1FC777?style=for-the-badge&logo=uptimerobot&logoColor=white)](https://uptimerobot.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <p align="center">
    Synkro is an enterprise consulting and client intake web platform designed to streamline software architecture discovery, consultation scheduling, persistent cloud database dispatch, and automated executive PDF slip generation.
  </p>

  <p align="center">
    <a href="#-core-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>

---

## ⚡ Core Features

- **🎯 Interactive Project Intake & Briefing**
  - Intuitive multi-step consultation questionnaire capturing client identity, preferred video platform (Zoom, Google Meet, Microsoft Teams), preliminary project vision, and estimated budget ranges.

- **📄 Executive PDF Consultation Slip Generation**
  - Modular vector PDF engine built on `PDFKit` with TrueType typography (`DejaVuSans`).
  - Automatically produces downloadable, single-page executive consultation slips complete with:
    - Official Synkro brand seal & digital verification stamp.
    - Dynamic security verification hash (`SEC-HASH`).
    - Currency formatting (`₹ INR`).
    - Simulated directorate authorization signatures.
    - 3-step consultation timeline and session preparation guidelines.

- **☁️ Cloud-Native Serverless Database (Neon PostgreSQL)**
  - Migrated from local ephemeral storage to serverless cloud PostgreSQL hosted on **Neon** (`AWS US-East-2`).
  - Connection pooling with SSL encryption and auto-schema synchronization on application boot.
  - Ensures client consultations and appointments persist indefinitely across server redeploys and cold starts.

- **💓 Continuous Uptime & Keep-Alive Monitoring**
  - Dedicated `/health`, `/healthz`, and `/ping` routes for lightweight HTTP monitoring.
  - Paired with **UptimeRobot** automated pings every 10–12 minutes to keep Render free-tier instances permanently warm without cold start spin-down latency.

- **🎨 High-Contrast Modern Glassmorphic Design**
  - Responsive layouts styled with tailored HSL tokens, deep slate surfaces, subtle glowing borders, and modern Google Fonts (`Plus Jakarta Sans`, `Inter`, and `JetBrains Mono`).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client(["🌐 Client Browser"])
    
    subgraph SynkroWeb ["Synkro Cloud Service (Render)"]
        Router["Express.js Server (Port: 3000)"]
        HealthRouter["Health & Keep-Alive Router (/health)"]
        IntakeEngine["Consultation Intake & Booking Engine"]
        PDFEngine["Executive PDF Generator (PDFKit + TrueType)"]
    end

    subgraph CloudInfra ["Managed Cloud Infrastructure"]
        NeonDB[("🐘 Neon Serverless PostgreSQL\n(AWS US-East-2)")]
        Uptime["🤖 UptimeRobot (12-min Keep-Alive Ping)"]
    end

    Uptime -->|"HEAD /health"| HealthRouter
    HealthRouter -->|"SELECT 1"| NeonDB
    Client -->|"Submit Brief / Booking"| IntakeEngine
    IntakeEngine -->|"Insert Record (SSL)"| NeonDB
    Client -->|"Download Slip Request"| PDFEngine
    PDFEngine -->|"Generate Streamed Slip"| Client
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (v20+) | Fast, asynchronous JavaScript server environment |
| **Web Framework** | [Express.js](https://expressjs.com/) (v5.x) | Minimalist web routing, middleware, and request dispatching |
| **Database** | [Neon PostgreSQL](https://neon.tech/) | Serverless cloud Postgres with connection pooling and SSL |
| **Database Client** | `pg` (node-postgres) | High-performance PostgreSQL client with parameterized query mapping |
| **Document Engine** | [PDFKit](https://pdfkit.org/) | Precision vector-based PDF document rendering engine |
| **Templating** | [EJS](https://ejs.co/) | Server-side templating for dynamic confirmation and dashboard views |
| **Frontend** | Vanilla HTML5, Modern CSS | Pure responsive design system, Bento grids, and glassmorphism |
| **Hosting** | [Render](https://render.com/) | Cloud application platform with automated Git CI/CD |
| **Health Monitor** | [UptimeRobot](https://uptimerobot.com/) | Automated heartbeat polling preventing instance idle sleep |

---

## 📂 Repository Structure

```text
synkro/
├── fonts/                      # TrueType typography (DejaVuSans, Unicode support)
│   ├── DejaVuSans.ttf
│   └── DejaVuSans-Bold.ttf
├── public/                     # Static assets & public web pages
│   ├── images/                 # Brand emblems, logos, and UI photography
│   ├── welcome.html            # Primary landing & hero showcase
│   ├── about.html              # Agency philosophy & capabilities
│   ├── booking.html            # Calendar scheduling interface
│   ├── solution.html           # Architecture solutions catalogue
│   ├── customer1.html          # Contact & client inquiry interface
│   ├── data.html               # Project intake brief submission
│   └── team.html               # Leadership & engineering directors
├── views/
│   └── submitted.ejs           # Dynamic confirmation view & PDF download trigger
├── db.js                       # Neon PostgreSQL pool connection & schema initializer
├── pdfGenerator.js             # Pixel-perfect executive PDF slip rendering engine
├── server.js                   # Main application server, routes & API endpoints
├── .gitignore                  # Git ignore rules (protects credentials & binaries)
├── package.json                # Project dependencies & scripts
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)
- A free [Neon](https://neon.tech/) PostgreSQL cloud database instance

### 2. Clone the Repository
```bash
git clone https://github.com/yash12345-ctrl/Synkro.git
cd Synkro
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Neon PostgreSQL Connection URL (with SSL mode required)
DATABASE_URL=postgresql://user:password@host.aws.neon.tech/neondb?sslmode=require

# Application Port
PORT=3000
```

### 5. Launch the Server
```bash
npm start
```
The server will initialize all required PostgreSQL tables on boot and run at:
`http://localhost:3000`

---

## 📡 API & Route Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the main landing page (`welcome.html`) |
| `GET` | `/health` | Health check endpoint returning status, uptime, and database connectivity |
| `GET` | `/healthz`, `/ping` | Health router aliases for monitoring tools |
| `HEAD` | `/health` | Zero-payload lightweight ping for automated uptime robots |
| `GET` | `/download-slip` | Streams a branded, high-res PDF consultation slip |
| `POST` | `/connect` | Processes project brief submissions and renders `submitted.ejs` |
| `POST` | `/submit-email` | Records client newsletter / updates subscription |
| `POST` | `/save-appointment` | Persists scheduled discovery appointment dates and time slots |

---

## 🌐 Deployment to Render

1. **Connect Repository**: Link your GitHub repository (`yash12345-ctrl/Synkro`) to a new **Web Service** on [Render](https://dashboard.render.com).
2. **Build & Start Commands**:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. **Set Environment Variables**:
   - `DATABASE_URL`: Your full Neon PostgreSQL connection string.
4. **Setup Keep-Alive (UptimeRobot)**:
   - Create a new monitor on [UptimeRobot](https://dashboard.uptimerobot.com/).
   - Monitor Type: `HTTP(s)`
   - URL: `https://<your-service-name>.onrender.com/health`
   - Interval: `10` or `12 minutes` *(prevents free-tier spin-down)*.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use and adapt it for your own software consulting platforms.

---

<div align="center">
  <sub>Developed & Maintained by <a href="https://github.com/yash12345-ctrl">Yash Tomar</a> • Built with Node.js & Neon PostgreSQL</sub>
</div>
