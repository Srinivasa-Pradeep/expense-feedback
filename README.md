# Reimburse Feedback

An intelligent, AI-driven expense compliance and reimbursement auditing application. The system features a modern, premium glassmorphic React frontend, a Node.js file storage backend, and a Python Flask microservice utilizing Retrieval-Augmented Generation (RAG) with local LLMs to instantly verify expense reports against corporate policies.

---

## 🚀 Key Features

* **Premium UI Overhaul**: Designed with a sleek, minimalist "Black & Silver" theme supporting both **Light Mode** and **Dark Mode** with a floating glass header navigation toggle.
* **Modern Glassy Calendar**: Custom-built date selector on the expense form, featuring drop-down select widgets for fast month and year navigation.
* **Local RAG Integration**: Utilizes Ollama's local `phi3` model and `nomic-embed-text` embeddings to compare expense details against corporate policy guidelines.
* **Intelligent Document Parsing**: Automatically extracts text from uploaded receipts (PDF/images) using pypdf and OCR fallbacks to cross-check claim values.
* **Embedded Policy Viewer**: Built-in PDF reader with full dark theme support, allowing users to browse corporate policies on the fly.
* **Feedback History Card Grid**: Clean, grid-based dashboard presenting past audited expense reports with smooth glass hover interactions.

---

## 🏗️ System Architecture & Ports

The application runs a complete local stack consisting of five services:

| Component | Technology | Default Port | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, MUI | `5173` | User interface and theme manager |
| **Python Backend** | Flask, LangChain, ChromaDB, Ollama | `5001` | LLM & RAG query compliance orchestrator |
| **Node.js Backend** | Node.js, Express, GridFS, MongoDB | `5002` | User Authentication, files storage, and CRUD |
| **Database** | MongoDB Community Server | `27017` | User accounts and receipt uploads database |
| **LLM Engine** | Ollama Service | `11434` | Running local Phi-3 text and embeddings |

---

## 🛠️ Step-by-Step Installation

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.9+)
* **MongoDB** (running on port `27017`)
* **Ollama** installed locally

### 1. Vector Database Setup
1. Launch the Ollama daemon and pull the models:
   ```bash
   ollama pull phi3
   ollama pull nomic-embed-text
   ```
2. Navigate to the Python backend directory:
   ```bash
   cd expense-feedback-backend-py
   ```
3. Initialize a python virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Chunk and embed the corporate guidelines document to initialize the vector database:
   ```bash
   python populate_database.py --reset
   ```

### 2. Node.js Storage Backend Setup
1. Navigate to the Node.js backend directory:
   ```bash
   cd ../expense-feedback-backend-nodejs
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/files
   PORT=5002
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../expense-feedback-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚦 How to Run the Application

You will need to start the services in separate terminal windows (ensure MongoDB and Ollama are active):

1. **Start the Python Flask Backend** (Port `5001`):
   ```bash
   cd expense-feedback-backend-py
   source venv/bin/activate
   python app.py
   ```
2. **Start the Node.js Express Backend** (Port `5002`):
   ```bash
   cd expense-feedback-backend-nodejs
   npm start
   ```
3. **Start the React Frontend** (Port `5173`):
   ```bash
   cd expense-feedback-frontend
   npm run dev
   ```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)** to start testing!

---

## ☁️ Deployment

* **Frontend (Vercel)**:
  Deploy the React application to Vercel by importing the `expense-feedback-frontend` directory. Ensure you select Vite as the build preset.
  
  *Note: A `vercel.json` configuration is defined in the frontend directory to rewrite all path inputs to `index.html`. This ensures subpage links (like `/portal` or `/history`) route client-side natively via `react-router-dom` on browser refresh.*

* **Database (MongoDB)**:
  Configure a MongoDB Atlas cluster and swap the local connection URI in your production environment variables.