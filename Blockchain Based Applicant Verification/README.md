# 🔐 Blockchain-Based Applicant Verification System

A full-stack decentralized application (dApp) that allows universities, companies, and applicants to verify academic and professional credentials using Ethereum smart contracts and simulated Chainlink oracles.

---

## 🧠 Project Overview

This system enables trustless verification of:

- 🎓 **Degree**
- 💼 **Company Work Experience**
- 📜 **University GPA**

It combines:

- **Blockchain** (Ethereum + Truffle + Ganache)
- **Smart Contracts** (Solidity)
- **API Layer** (FastAPI)
- **Simulated Oracle Logic**
- **React Frontend**
- **MongoDB Database** (hosted on Atlas or local)

---

## 🗂 Folder Structure

```
Blockchain Based Applicant Verification/
├── backend/            # FastAPI + MongoDB + Web3.py logic
├── frontend/           # React.js frontend UI
├── blockchain/         # Solidity contracts + Truffle + Ganache
└── README.md           # Main project overview
```

---

## 🚀 How to Run the Project

### 🧱 1. Blockchain (Truffle + Ganache)

```bash
cd blockchain
ganache-cli --port 7545  # or use Ganache GUI
truffle compile
truffle migrate --network development
```

> Copy the deployed contract address and ABI to the backend and frontend.

---

### 🧠 2. Backend (FastAPI + MongoDB)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

> Configure `.env` with your MongoDB URI, Chain ID, and Private Key if needed.

---

### 🌐 3. Frontend (React + Web3)

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: [http://localhost:5173](http://localhost:5173)

---

## 🔧 Technologies Used

| Layer          | Tech Stack                     |
| -------------- | ------------------------------ |
| Smart Contract | Solidity, Truffle, Ganache     |
| Oracle Sim     | Python, FastAPI, Web3.py       |
| Database       | MongoDB Atlas (or Local)       |
| API Server     | FastAPI, Pydantic              |
| Frontend UI    | React.js, Vite, Axios, Web3.js |

---

## 🛠 Features

- ✅ GPA & Experience Verification
- 🧠 Simulated Chainlink Oracle Response
- ⛓ Blockchain transaction & status feedback
- 📡 MongoDB record comparison
- 🧪 Unit tests for backend & smart contracts

---

## 📬 Future Improvements

- Integrate real Chainlink oracle for off-chain API calls
- Use IPFS or Filecoin for immutable credential storage
- Add role-based authentication for universities/companies
- Add email/notification support for verification results

---

## 🤝 Authors

- **Eshin Fernando**
- **Matheesha Fernando**
- **Asith Ekanayake**
- **Pawan Epa**
- **Praneeth Fernando**

---

## 📄 License

This project is for academic and educational purposes.
