# NeuraCare

### Multi-Specialty Clinic Management Platform

*A unified digital front door for modern clinics — doctor discovery, appointment booking, and patient records in one platform.*

![Status](https://img.shields.io/badge/status-client%20demo-yellow) ![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JS-1abc9c) ![Backend](https://img.shields.io/badge/backend-Node.js-3C873A) ![Hosted](https://img.shields.io/badge/hosted%20on-Render-46E3B7)


> **Project status:** This build is a client-facing demonstration of NeuraCare's architecture, UX, and core patient journeys (sign-up, sign-in, booking, dashboard) — all of which are fully functional. Doctor rosters, patient records, and platform statistics shown throughout are sample data; a production rollout would be provisioned with a clinic's real information.

## Table of Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Product Walkthrough](#product-walkthrough)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Acknowledgments](#acknowledgments)
- [License](#license)
- [For Clinics](#for-clinics)

---

## Overview

NeuraCare is a full-stack clinic management platform that brings doctor discovery, appointment booking, and patient records together under one branded experience. It's built as a modern alternative to the fragmented mix of paper registers, phone bookings, and generic scheduling tools that most small and mid-sized clinics still rely on.

The platform is structured around two experiences: a **public marketing site** that introduces a clinic network and converts visitors into booked appointments, and an **authenticated patient portal** where patients manage their own care — appointments, prescriptions, and lab results — in one place.

---

## Problem Statement

Clinics, especially multi-specialty and multi-branch ones, struggle to give patients a single, trustworthy place to find the right doctor and manage their own health information. Common pain points include:

- **Fragmented booking** — appointments scheduled by phone, WhatsApp, or in person, with no shared record between visits
- **No unified patient history** — prescriptions, lab results, and past visits scattered across paper files or disconnected systems
- **Generic tooling** — off-the-shelf scheduling software isn't built for healthcare and doesn't account for specialties, doctor credentials, or consultation modes
- **Low trust signals online** — patients have no easy way to compare doctors by experience, fees, verification, or satisfaction before booking

NeuraCare addresses this with a single, branded platform clinics can present to their patients, handling identity, discovery, booking, and records without patients needing to juggle multiple tools.

---

## Solution Overview

NeuraCare currently supports **24 medical specialties** — from General Physician and Dermatology to Neurosurgery and Medical Oncology — through a searchable, filterable doctor directory. Patients can:

- Sign up or sign in via Patient ID/password or Google OAuth
- Browse specialties and doctors, filtered by consultation mode, experience, fees, gender, and language
- Book appointments through a guided, 3-step flow
- View a personal dashboard summarizing visits, upcoming appointments, prescriptions, and lab results

Doctors are tied to named clinic branches (e.g., *NeuraCare Heart Centre – Bangalore*), demonstrating how a real multi-location clinic group would be represented on the platform.

---

## Architecture

```
+-------------------------------------------------------------------+
|                          CLIENT (Browser)                         |
|                                                                    |
|   Public Site                        Patient Portal                |
|   - Home / Services                  - Sign Up / Sign In           |
|   - Doctor Directory                 - Dashboard                   |
|   - Booking Flow                     - Appointments / Records      |
+-----------------+--------------------------------+------------------+
                   |                                |
                   | HTTPS / REST                   | OAuth 2.0
                   v                                v
+-------------------------------------------------------------------+
|                    NODE.JS BACKEND  (Render.com)                  |
|                                                                    |
|     Auth   |   Appointments   |   Doctors   |   Prescriptions/Labs|
+-----------------------------------+---------------------------------+
                                    |
                                    v
                          +-------------------+
                          |    DATA LAYER      |
                          +-------------------+
```

The frontend is a multi-page HTML/CSS/JS application served alongside a Node.js REST API, with Google OAuth 2.0 handling third-party authentication. The full stack is deployed as a single service on Render.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) | Multi-page patient portal and public site |
| Design System | DM Serif Display, custom green & gold theme | Brand identity and visual consistency |
| Backend | Node.js | REST API, authentication, business logic |
| Authentication | Google OAuth 2.0 + credential-based login | Secure patient sign-in, two entry paths |
| Hosting | Render.com | Cloud hosting for the deployed application |
| Pitch Tooling | `pptxgenjs`, `react-icons`, `sharp` | Programmatic generation of the client pitch deck |

---

## Core Features

### Patient Portal & Onboarding
- Dual sign-in paths: Patient ID + password, or one-click Google OAuth
- Full-width signup form with live password-confirmation validation
- Animated success modal (spinning gradient ring, pulsing checkmark, one-tap Patient ID copy) on signup and OAuth completion
- Consistent auth shell across Sign In, Sign Up, and OAuth pages — a fixed left panel (logo, illustration, trust stats) paired with the active form

### Appointment Booking & Doctor Discovery
- 24 specialties browsable from a single grid
- Guided 3-step booking: specialty → date → preferred location/pincode
- Filterable directory — consultation mode, experience band, fee range, gender, and language
- Doctor cards surface what patients actually decide on: qualifications, experience, clinic branch, session fee, satisfaction rate, and verification status

### Multi-Specialty Care Network
- Dedicated service listings (Cardiology, Neurology, Dental Care, Ophthalmology, Pediatrics, Radiology, and more) on the public homepage
- Doctors tied to named clinic branches, modeling a real multi-location clinic group

### Records, Prescriptions & Lab Results
- Dashboard summary of total visits, upcoming appointments, active prescriptions, and lab reports
- Appointment history with doctor, specialty, date, and status
- Prescriptions with dosage and frequency
- Lab results with reference ranges and status indicators

### Client Pitch Deck
- A 10-slide presentation generated with `pptxgenjs`, covering the problem statement, features, tech stack, UI/UX, live demo, and roadmap — built programmatically for fast iteration ahead of client meetings

---

## Product Walkthrough

### Homepage
![NeuraCare homepage](./screenshots/01-homepage.png)
The public homepage leads with trust signals — patients treated, doctors on staff, years of service — and a browsable services grid.

### Sign In
![Sign in page](./screenshots/02-sign-in.png)
Patients sign in with Google OAuth or a Patient ID and password, inside a consistent branded panel used across all auth screens.

### Patient Dashboard
![Patient dashboard](./screenshots/03-patient-dashboard.png)
Signed-in patients see visit counts, upcoming appointments, prescriptions, and lab reports at a glance, plus detailed history for each.

### Book Appointment
![Book appointment flow](./screenshots/04-book-appointment.png)
All 24 specialties are browsable directly, or patients can use the 3-step guided flow to get matched with available doctors:

| | | | |
|---|---|---|---|
| General Physician | Dermatology | Obstetrics & Gynae | Orthopaedics |
| ENT | Neurology | Cardiology | Urology |
| Gastroenterology | Psychiatry | Paediatrics | Pulmonology |
| Endocrinology | Nephrology | Neurosurgery | Rheumatology |
| Ophthalmology | Surgical Gastro | Infectious Disease | Psychology |
| Medical Oncology | Diabetology | Dentist | General & Laparo |

### Doctor Directory
![Doctor directory](./screenshots/05-doctor-directory.png)
A filterable directory (consultation mode, experience, fees, gender, language) lists doctors with the details patients weigh most:

| Doctor | Specialty | Experience | Branch | Fee | Rating |
|---|---|---|---|---|---|
| Dr. Priya Ramesh | General Physician | 6 yrs · MBBS, MD (Gen. Medicine) | NeuraCare Clinic – Chennai | ₹760/session | 92% (1.2K+ patients) |
| Dr. Arjun Krishnan | Cardiologist | 14 yrs · MBBS, MD, DM (Cardiology) | NeuraCare Heart Centre – Bangalore | ₹1,200/session | 97% (3.8K+ patients) |
| Dr. Meena Subramanian | Neurologist | 9 yrs · MBBS, DM (Neurology) | NeuraCare Brain & Spine – Chennai | ₹950/session | 89% (890+ patients) |

---

## Getting Started

> The steps below follow a standard Node.js layout — update commands and paths to match your actual `package.json` scripts if they differ.

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone <repository_url>
cd NeuraCare
npm install
```

### Run Locally
```bash
npm start
```
The app will be available at `http://localhost:<PORT>` (check your server config or `.env` for the configured port).

### Environment Variables
If Google OAuth is enabled locally, add your own credentials, e.g.:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
PORT=3000
```

### Live Deployment
The current build is deployed on Render: **https://clinic-management-system-23m2.onrender.com**

---

## Project Structure

```
NeuraCare/
├── Pages/
│   ├── 01-Signup.html
│   ├── 02-Login.html
│   ├── 03-Google-Complete.html
│   ├── 04-Booking.html
│   └── 05-Patient-dashboard.html
├── public/              # Static assets — CSS, JS, images, fonts
├── server/               # Node.js backend — routes, auth, API logic
├── docs/                 # Screenshots and presentation assets
└── package.json
```
*(Update to match your repository's actual layout.)*

---

## Roadmap

- [ ] Clinic/staff admin portal for managing doctors, rosters, and appointments
- [ ] Pharmacy module — medicine catalog and order tracking
- [ ] Records module — centralized document upload and history
- [ ] Replace placeholder doctor avatars and sample records with real clinic-provided data during onboarding
- [ ] Resolve remaining placeholder navigation links ahead of client demos
- [ ] Appointment reminders via email/SMS

---

## Acknowledgments

- Typography powered by [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) via Google Fonts
- Designed and built independently as an end-to-end demonstration of clinic management — from patient-facing UX to backend architecture

---

## License

This project doesn't yet declare a license.

- Open-sourcing it → the [MIT License](https://opensource.org/licenses/MIT) is a common permissive default.
- Positioning it as a commercial product for clinic clients → consider an **All Rights Reserved** / proprietary notice instead, since an open license would let anyone reuse or resell the platform.

© 2026 [Your Name]. All rights reserved. *(update as appropriate)*

---

*Built and maintained by Sarvesh.*
