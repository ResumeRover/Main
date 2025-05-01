# Backend – FastAPI + MongoDB + Web3

This is the backend service for the **Blockchain-Based Applicant Verification** system. It provides APIs to verify applicant GPA, work experience, and certificates. It also simulates Chainlink-like oracle interactions using `web3.py`.

---

## 📦 Tech Stack

- Python 3.11+
- FastAPI
- MongoDB Atlas
- Web3.py (Ethereum integration)
- Ganache (local blockchain for development)
- Pydantic
- Uvicorn

---

## 🚀 Getting Started

### 1. Create and activate virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB connection
MONGO_URI=mongodb+srv://blockchainVerification:cs3023Resume_BVfy@cluster0.kxwey.mongodb.net/

# Blockchain configuration
BLOCKCHAIN_PROVIDER=http://localhost:7545
CONTRACT_ADDRESS=' '  # replace with your address

# Path to contract ABI
ABI_PATH=../blockchain/build/contracts/Verification.json

# Optional: Private key for non-development environments
PRIVATE_KEY=' '  # replace with your private key

# FastAPI configuration
API_HOST=localhost
API_PORT=8000

```

### 4. Start your local blockchain (Ganache)

Ensure Ganache is running on port 7545 with the verification contract deployed.

### 5. Run the FastAPI server

```bash
python -m uvicorn app.main:app --reload
```

Visit: [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

---

## 📂 Directory Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI entrypoint
│   ├── routes/
│   │   └── verification.py    # GPA, experience, and certificate APIs
│   ├── services/
│   │   ├── mock_db.py         # MongoDB data access
│   │   ├── blockchain.py      # web3 interaction
│   │   └── oracle_simulator.py# Simulate oracle fulfillment
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   └── utils/
│       └── helpers.py         # Shared helper functions
├── data/
│   ├── university_records.json
│   └── company_records.json
├── tests/
│   └── test_verification.py   # Unit tests
├──docs/                       # basic documentation files for backend
│   ├── api.md                 # define data structures and endpoints of the backend
│   ├── architecture.md        # basic architectural structue
│   └── mock_database.md
├── requirements.txt
└── README.md
```

---

## 🌐 API Endpoints

### Main Verification APIs

- `POST /verification/gpa` - Verify an applicant's GPA
- `POST /verification/degree` - Verify an applicant's university degree
- `POST /verification/employment` - Verify an applicant's work experience
- `GET /verification/list` - Get all stored verifications from the blockchain
- `GET /verification/status` - Get blockchain connection status

### Example Request (Degree Verification)

```json
{
  "name": "Kalana De Alwis",
  "university": "NSBM Green University",
  "degree": "BSc in Software Engineering"
}
```

---

## 🔧 Development Notes

### Blockchain Integration

The backend uses Web3.py to connect to an Ethereum blockchain. For development, it's configured to use Ganache on port 7545. The system stores verification results as hashed data to preserve privacy while maintaining immutability.

### Oracle Simulator

The `OracleSimulator` class mimics the behavior of Chainlink oracle nodes, verifying data against trusted sources (simulated by MongoDB) and storing the results on the blockchain.

### Gas Configuration

When storing data on the blockchain, the system uses a high gas limit (1,000,000) to ensure complex transactions complete successfully.

---

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

For manual testing, use the Swagger UI at http://localhost:8000/docs
