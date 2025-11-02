# 💻 EthioGurus Frontend (React & Tailwind CSS)

This repository contains the official frontend web application for the **EthioGurus Talent Platform**. It is a dynamic Single Page Application (SPA) built using React and styled with the utility-first framework, Tailwind CSS.

This component is designed to run and be developed independently from the Django Backend, communicating exclusively via REST API calls.

---

## ✨ Project Goals

The frontend focuses on providing a fast, responsive, and intuitive user experience for two primary user groups:

* **Gurus (Talent):** Managing profiles, submitting applications for vetting, viewing portfolio statistics, and accepting project offers.
* **Clients:** Submitting new project requirements, reviewing talent recommendations, and managing contracts.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React** | Core library for building the user interface components. |
| **Styling** | **Tailwind CSS** | Utility-first framework for rapid and consistent styling across all components. |
| **Routing** | React Router | Manages client-side navigation and URL synchronization. |
| **API Client** | Axios / Fetch | Used for making asynchronous HTTP requests to the Django Backend API. |
| **Package Manager** | npm / yarn | Used for managing development and production dependencies. |

---

## ⚙️ Local Development Setup

Follow these steps to run the frontend application independently for rapid development, testing, and component work.

### Prerequisites

* **Node.js (LTS)** and **npm/yarn** must be installed globally.
* The **Django Backend** service must be running and accessible (e.g., via the main `ethiogig` Docker setup) to fetch data.

### 1️⃣ Clone the Repository

Clone this repository and navigate into the project directory:

```bash
git clone [https://github.com/David-T7/ethiogurus_frontend.git](https://github.com/David-T7/ethiogurus_frontend.git)
cd ethiogurus_frontend
