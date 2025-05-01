## Blockchain-Based Applicant Verification API

**Version:** 1.0.0\
**Description:** API for verifying resume information using blockchain and oracle simulations.

### Table of Contents

1. [Overview](#overview)
2. [Endpoints](#endpoints)
   - [Verify GPA](#verify-gpa)
   - [Verify Degree](#verify-degree)
   - [Verify Employment](#verify-employment)
   - [Get Blockchain Status](#get-blockchain-status)
   - [List Verifications](#list-verifications)
   - [Get Verification by Data Hash](#get-verification-by-data-hash)
   - [Mock University Record](#mock-university-record)
   - [Mock Employment Records](#mock-employment-records)
   - [Root](#root)
   - [Health Check](#health-check)
3. [Data Models](#data-models)
   - [GPAVerificationRequest](#gpaverificationrequest)
   - [DegreeVerificationRequest](#degreeverificationrequest)
   - [EmploymentVerificationRequest](#employmentverificationrequest)
   - [VerificationResponse](#verificationresponse)
   - [VerificationListResponse](#verificationlistresponse)
   - [BlockchainStatus](#blockchainstatus)
   - [HTTPValidationError](#httpvalidationerror)

---

### Overview

This API enables verification of an applicant's credentials—GPA, degree, and employment—by comparing submitted data against records stored on a blockchain and simulated oracle sources.

Authentication: None (open access) Base URL: `https://<your-domain>/`

---

## Endpoints

### Verify GPA

**Endpoint:** `POST /verification/gpa`\
**Tag:** `verification`\
**Summary:** Verify GPA information against blockchain and university records.\
**Description:** Submits a student's name, university, and GPA value. The system checks the blockchain record and simulated university oracle to determine authenticity.

**Request Body (application/json):**

```json
{
  "name": "string",
  "university": "string",
  "gpa": 3.5
}
```

| Field        | Type   | Description              | Required |
| ------------ | ------ | ------------------------ | -------- |
| `name`       | string | Full name of the student | Yes      |
| `university` | string | Name of the university   | Yes      |
| `gpa`        | number | GPA value (0.0–4.0)      | Yes      |

**Responses:**

- `200 OK`
  ```json
  {
    "data": {
      /* original input */
    },
    "data_hash": "string",
    "is_verified": true,
    "verification_type": "GPA",
    "details": "Verified against blockchain and university records",
    "timestamp": 1625247600,
    "tx_hash": "string|null",
    "status": "new"
  }
  ```
- `404 Not Found` – Entry not found on blockchain or oracle.
- `422 Unprocessable Entity` – Validation errors in request format.

---

### Verify Degree

**Endpoint:** `POST /verification/degree`\
**Tag:** `verification`\
**Summary:** Verify degree information against blockchain and university records.\
**Description:** Submits a student's name, university, and degree name. Checks authenticity via blockchain and simulated university oracle.

**Request Body (application/json):**

```json
{
  "name": "string",
  "university": "string",
  "degree": "string"
}
```

| Field        | Type   | Description                               | Required |
| ------------ | ------ | ----------------------------------------- | -------- |
| `name`       | string | Full name of the student                  | Yes      |
| `university` | string | Name of the university                    | Yes      |
| `degree`     | string | Degree name (e.g., B.Sc Computer Science) | Yes      |

**Responses:**

- `200 OK`
  ```json
  {
    "data": {
      /* original input */
    },
    "data_hash": "string",
    "is_verified": true,
    "verification_type": "Degree",
    "details": "Verified against blockchain and university records",
    "timestamp": 1625247600,
    "tx_hash": "string|null",
    "status": "new"
  }
  ```
- `404 Not Found` – No matching record.
- `422 Unprocessable Entity` – Invalid request.

---

### Verify Employment

**Endpoint:** `POST /verification/employment`\
**Tag:** `verification`\
**Summary:** Verify employment information against blockchain and company records.\
**Description:** Submits an employee's name, company, and optional job title. Verifies against blockchain and simulated company oracle.

**Request Body (application/json):**

```json
{
  "name": "string",
  "company": "string",
  "job_title": "string | null"
}
```

| Field       | Type        | Description               | Required |
| ----------- | ----------- | ------------------------- | -------- |
| `name`      | string      | Full name of the employee | Yes      |
| `company`   | string      | Name of the company       | Yes      |
| `job_title` | string/null | Job title (optional)      | No       |

**Responses:**

- `200 OK`
  ```json
  {
    "data": {
      /* original input */
    },
    "data_hash": "string",
    "is_verified": true,
    "verification_type": "Employment",
    "details": "Verified against blockchain and company records",
    "timestamp": 1625247600,
    "tx_hash": "string|null",
    "status": "new"
  }
  ```
- `404 Not Found` – Record missing.
- `422 Unprocessable Entity` – Validation error.

---

### Get Blockchain Status

**Endpoint:** `GET /verification/status`\
**Tag:** `verification`\
**Summary:** Get the current blockchain status and verification contract info.\
**Description:** Retrieves provider URL, contract address, block number, and total verifications count.

**Responses:**

- `200 OK`
  ```json
  {
    "provider": "string",
    "contract_address": "string",
    "block_number": 12345,
    "verification_count": 100
  }
  ```
- `404 Not Found` – Status unavailable.

---

### List Verifications

**Endpoint:** `GET /verification/list`\
**Tag:** `verification`\
**Summary:** List all verifications stored on the blockchain.\
**Description:** Returns an array of verification records and the total count.

**Responses:**

- `200 OK`
  ```json
  {
    "verifications": [
      {
        /* record objects */
      }
    ],
    "total": 100
  }
  ```
- `404 Not Found` – No records found.

---

### Get Verification by Data Hash

**Endpoint:** `GET /verification/{data_hash}`\
**Tag:** `verification`\
**Summary:** Fetch verification details by data hash.\
**Description:** Provide the unique data hash to retrieve the associated verification information.

**Path Parameters:**

| Name        | Type   | Description                 | Required |
| ----------- | ------ | --------------------------- | -------- |
| `data_hash` | string | Hash identifier of the data | Yes      |

**Responses:**

- `200 OK` – Returns object with dynamic properties.
- `404 Not Found` – No matching hash.
- `422 Unprocessable Entity` – Invalid hash format.

---

### Mock University Record

**Endpoint:** `GET /verification/mock/university/{name}`\
**Tag:** `verification`\
**Summary:** Retrieve a simulated university record.\
**Description:** Returns dummy university data for demo/debug.

**Path Parameters:**

| Name   | Type   | Description    | Required |
| ------ | ------ | -------------- | -------- |
| `name` | string | Student's name | Yes      |

**Responses:**

- `200 OK` – Mock record object.
- `404 Not Found` – No mock data.
- `422 Unprocessable Entity` – Validation error.

---

### Mock Employment Records

**Endpoint:** `GET /verification/mock/employment/{name}`\
**Tag:** `verification`\
**Summary:** Retrieve simulated employment records.\
**Description:** Returns dummy company data for demo/debug.

**Path Parameters:**

| Name   | Type   | Description     | Required |
| ------ | ------ | --------------- | -------- |
| `name` | string | Employee's name | Yes      |

**Responses:**

- `200 OK` – Mock employment object.
- `404 Not Found` – No mock data.
- `422 Unprocessable Entity` – Validation error.

---

### Root

**Endpoint:** `GET /`\
**Summary:** API root - returns basic information.\
**Responses:**

- `200 OK` – General API info.

---

### Health Check

**Endpoint:** `GET /health`\
**Summary:** Health check endpoint.\
**Responses:**

- `200 OK` – Service status.

---

## Data Models

### GPAVerificationRequest

| Field        | Type   | Description              | Required |
| ------------ | ------ | ------------------------ | -------- |
| `name`       | string | Full name of the student | Yes      |
| `university` | string | Name of the university   | Yes      |
| `gpa`        | number | GPA value (0.0–4.0)      | Yes      |

---

### DegreeVerificationRequest

| Field        | Type   | Description              | Required |
| ------------ | ------ | ------------------------ | -------- |
| `name`       | string | Full name of the student | Yes      |
| `university` | string | Name of the university   | Yes      |
| `degree`     | string | Degree name              | Yes      |

---

### EmploymentVerificationRequest

| Field       | Type        | Description               | Required |
| ----------- | ----------- | ------------------------- | -------- |
| `name`      | string      | Full name of the employee | Yes      |
| `company`   | string      | Company name              | Yes      |
| `job_title` | string/null | Job title (optional)      | No       |

---

### VerificationResponse

| Field               | Type        | Description                                  | Required |
| ------------------- | ----------- | -------------------------------------------- | -------- |
| `data`              | object      | Original data submitted                      | Yes      |
| `data_hash`         | string      | Hash of the data stored on the blockchain    | Yes      |
| `is_verified`       | boolean     | Result of verification                       | Yes      |
| `verification_type` | string      | Type of verification (GPA, Degree, etc.)     | Yes      |
| `details`           | string      | Additional verification details              | Yes      |
| `timestamp`         | integer     | Unix timestamp of verification               | Yes      |
| `tx_hash`           | string/null | Blockchain transaction hash (if available)   | No       |
| `status`            | string      | Status of verification (`new` or `existing`) | Yes      |

---

### VerificationListResponse

| Field           | Type    | Description                   | Required |
| --------------- | ------- | ----------------------------- | -------- |
| `verifications` | array   | Array of verification records | Yes      |
| `total`         | integer | Total number of records       | Yes      |

---

### BlockchainStatus

| Field                | Type    | Description                     | Required |
| -------------------- | ------- | ------------------------------- | -------- |
| `provider`           | string  | Blockchain provider URL         | Yes      |
| `contract_address`   | string  | Verification contract address   | Yes      |
| `block_number`       | integer | Current blockchain block number | Yes      |
| `verification_count` | integer | Total verifications stored      | Yes      |

---

### HTTPValidationError

| Field    | Type  | Description               | Required |
| -------- | ----- | ------------------------- | -------- |
| `detail` | array | List of validation errors | Yes      |

**ValidationError**:

| Field  | Type                    | Description       | Required |
| ------ | ----------------------- | ----------------- | -------- |
| `loc`  | array\<string\|integer> | Location of error | Yes      |
| `msg`  | string                  | Error message     | Yes      |
| `type` | string                  | Error type code   | Yes      |
