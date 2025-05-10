# Frontend – React + Web3

This is the frontend interface for the **Blockchain-Based Applicant Verification** system. Users can submit verification requests and view results, including blockchain status.

---

Simple stuff:
to run d frontend, just hit npm install & npm run dev, then bam!! fk yeah..u r up!

## 🛠 Tech Stack

- React (Vite)
- Axios
- Ethers.js / Web3.js
- React Context API

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📂 Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── VerificationForm.jsx
│   │   ├── ResultCard.jsx
│   │   └── BlockchainStatus.jsx
│   └── services/
│       ├── api.js             # Axios to FastAPI
│       └── web3.js            # Web3/Ethers interactions
├── package.json
└── README.md
```

---

## 🔧 Config

If your backend is running locally, ensure `api.js` points to:

```javascript
const BASE_URL = "http://localhost:8000";
```

To switch networks, configure your MetaMask wallet to connect to Ganache or other networks.
