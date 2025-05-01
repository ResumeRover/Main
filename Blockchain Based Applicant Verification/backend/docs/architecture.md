# Architecture Overview – Backend System

---

## 🧰 Tech Stack

| Component                | Technology                                           | Purpose                                   |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------- |
| **Web Framework**        | [FastAPI](https://fastapi.tiangolo.com/)             | Lightweight REST API server               |
| **Database**             | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Mock university & company data storage    |
| **Blockchain Interface** | [Web3.py](https://web3py.readthedocs.io/)            | Interacts with Ethereum smart contracts   |
| **Oracle Simulator**     | Python event listener                                | Simulates Chainlink off-chain computation |
| **Smart Contracts**      | Solidity + Truffle                                   | Stores verification results on blockchain |
| **Data Models**          | Pydantic                                             | Input/output data validation              |

---

## 🧩 Major Modules

```
app/
├── main.py                # FastAPI entrypoint
├── routes/                # API endpoints
│   └── verification.py    # GPA, Degree, Employment verification endpoints
├── services/
│   ├── mock_db.py         # Connects and queries MongoDB
│   ├── blockchain.py      # Interacts with deployed smart contract via web3
│   └── oracle_simulator.py  # Listens for verification requests and triggers off-chain checks
├── models/
│   └── schemas.py         # Pydantic request/response schemas
├── utils/
│   └── helpers.py         # Hashing, formatting, QR utilities

data/
├── university_records.json
├── company_records.json

docs/                      # basic documentation about implementation
├── api.md
├──  architecture.md

tests/                     # test files for testing

```

---

## 🏗️ System Design

- **Architecture Type:** Modular Monolith
- **Design Principles:** Clear separation of concerns

Although deployed as a monolithic FastAPI app, it simulates microservices through modular abstraction:

- API Layer → Handles requests via FastAPI endpoints
- Business Logic → Handled in `services/`
- Data Access Layer → MongoDB integration via `mock_db.py`
- Oracle → Simulated off-chain computation via event listener
- Blockchain Layer → Decoupled in `blockchain.py` for future extensibility

---

## 🔄 Data Flow Between Components

### 🧾 Verification Flow (Optimized)

1. **Frontend Submits Data** → FastAPI `/verification/*`
2. **Backend Hashes Input** → Hashing utility
3. **Check Blockchain for Existing Hash**
   - If found → Respond with status, no blockchain interaction needed
   - If not found → Proceed to oracle simulation
4. **Oracle Simulator Queries MongoDB** → Validate against mock data
5. **Verification Passed?**
   - Yes → Write result (including hash) to blockchain
6. **Return Final Result to Frontend** → Include txHash + status + timestamp

---

## 📊 Architecture Diagrams

### 1. 🧱 Component Diagram

```
+-------------+       +-------------------+       +------------------+
|   Frontend  | <---> |   FastAPI Backend  | <---> |   MongoDB (Mock) |
+-------------+       |                   |       +------------------+
                      |                   |
                      |                   | <---> Web3.py (Ethereum RPC)
                      |                   |
                      |                   | <---> Oracle Simulator (off-chain)
                      +-------------------+
```

### 2. 📈 Sequence Diagram

```
User
 │
 │ Submits GPA / Degree / Employment
 ▼
Frontend → FastAPI
 │
 │ Hash input + Check Blockchain
 ▼
Blockchain (via Web3.py)
 │
 │ Not Found? → Trigger Oracle
 ▼
Oracle Simulator → MongoDB
 │
 │ If Match → Call Smart Contract
 ▼
Smart Contract: store result (hash + verified)
 │
 ▼
FastAPI ← Blockchain result
 │
 ▼
Frontend ← JSON response (verified + txHash)
```

---

## 🔐 Security & Privacy

- 🔒 Sensitive fields (e.g., name, GPA, degree) **never stored on-chain**
- ✅ Only **hashed data** (e.g., keccak256 hash) written to Ethereum
- 🧪 MongoDB used purely as a **mock source** simulating secure institutional records

---

## 🚀 Deployment Notes

- 📦 MongoDB Atlas used for managed, cloud-hosted mock data
- ⛓️ Smart contracts deployed on Ganache (local) or Goerli/Testnet
- 🐳 Docker support optional; can be containerized for DevOps pipelines

---

## 🔁 Step-by-Step Verification Flow

1. **User Submits Data**

   - Fields: Name, GPA, Degree, Employment
   - Sent via frontend to `/verification` endpoints

2. **Check Blockchain**

   - FastAPI checks for existing hash match in contract
   - If found → skip oracle, return result

3. **Trigger Oracle Simulator**

   - Off-chain simulator reads MongoDB
   - Validates data against university or company records

4. **Write Result to Blockchain**

   - Smart contract stores hash, result, type, timestamp

5. **Return Response**
   - JSON response includes: `is_verified`, `tx_hash`, `timestamp`, `status`
   - Frontend reflects real-time status (e.g., ✅ or ❌)
