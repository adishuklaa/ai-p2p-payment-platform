# AI P2P Payment Platform

## Product Overview
PayFlow AI is a robust peer-to-peer (P2P) payment prototype integrating artificial intelligence to handle transaction velocity checks, risk holding, and real-time fraud mitigation. This platform simulates sending and requesting money while strictly managing compliance and limits, offering users an ultra-fast, secure financial experience.

## Why I Built This
This prototype was developed to showcase an enterprise-grade understanding of FinTech application architecture. Many payment applications handle the "happy path" well but fail gracefully when exceptions arise. I built this to demonstrate state management across complex failure modes—such as insufficient funds, risk holds, and daily limit breaches—and to construct a comprehensive UX around dispute resolutions.

## Problem Statement
Traditional P2P payment applications lack transparency around risk-based transaction holds and are frequently inflexible when users encounter exceptions (e.g., limits reached or potential fraud). Users need a platform that not only moves money but intelligently communicates why a payment might be delayed or declined.

## Target Users
- **Everyday Consumers:** Splitting bills, paying rent, sending gifts.
- **Freelancers/Gig Workers:** Receiving small-to-medium payments with clear transaction statuses.

## User Personas
1. **Sarah (The Splitter):** 24, college student, constantly splits meals and cab fares. Needs immediate feedback on transaction status.
2. **Mark (The Freelancer):** 35, freelance graphic designer. Needs robust transaction history and dispute resolution if a client's payment fails.

## Product Goals
1. Provide a frictionless interface for sending and requesting money.
2. Implement transparent, simulated AI-driven velocity and risk checks.
3. Ensure comprehensive handling of edge cases and failure states.

## Hypothesis
If users are provided with real-time, transparent feedback regarding AI-driven security holds and limits, their trust in the platform will increase, reducing customer support tickets related to "stuck" payments.

## Key Features
- **Send & Request Money:** Select from contacts, input amounts, and add notes.
- **Velocity Checks:** Simulated AI tracking transaction volume and frequency.
- **Risk Holds:** Automatic flagging of high-value transactions.
- **Real-Time Limits:** Visual tracking of daily payment limits.
- **Transaction History:** Comprehensive ledger with search and filtering.
- **Dispute Center:** Dedicated UX for managing transaction conflicts.

## User Journey
1. **Dashboard:** User views balance and daily limits.
2. **Initiate:** User clicks "Send Money", selects recipient, and enters amount.
3. **Processing:** The system evaluates funds and AI risk parameters.
4. **Outcome:** Payment succeeds, fails (e.g., limit exceeded), or is placed on a security hold.
5. **Review:** User tracks the payment in the Transaction History.

## Workflow
- **State Machine:** Idle -> Processing -> Success / Failed / Risk Hold.
- **Validation:** Amount > 0, Sufficient Funds, within Daily Limit.
- **AI Intervention:** Amounts over $1000 trigger simulated risk holds.

## Requirements
- Must support simulated send and request flows.
- Must display transaction history with dynamic status indicators.
- Must block transactions exceeding the daily limit ($2000) or balance.
- Must flag transactions >$1000 for review.

## User Stories
- As a user, I want to send money to a contact so I can split bills.
- As a user, I want to see my transaction history to track my spending.
- As a user, I want to know immediately if a transaction failed due to insufficient funds.
- As a user, I want to see how much of my daily limit I have used.

## Acceptance Criteria
- [x] Payment modal allows selecting recipient and entering amount.
- [x] Balances update immediately upon successful send.
- [x] Transactions >$1000 show as "Pending" with a "Risk hold" error state.
- [x] Attempting to send more than available balance yields a specific error.

## Tradeoffs
- **Synthetic Data vs Backend:** A fully functioning backend was omitted to focus purely on the frontend state architecture and UX. 
- **Simulated AI:** Real AI models for risk analysis are highly complex; a deterministic threshold (>$1000) was used to simulate this behavior for the prototype.

## AI/Automation Approach
- **Velocity Checks:** Monitored via the Daily Limit tracker.
- **Risk Scoring:** Simulated "low risk" metric on the dashboard.
- **Fraud Prevention:** Transactions exceeding predefined thresholds are temporarily held.

## Data/Assumptions
- Users start with a fixed simulated balance.
- Contact list is hardcoded.
- Risk models flag specific static parameters.

## Architecture
- **Frontend:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS + Lucide Icons.
- **Charts:** Recharts for activity visualization.
- **State:** React `useState` managing complex transaction state machines.

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## UX Decisions
- **Modals for Actions:** Keeps the user in the context of their dashboard.
- **Color Coding:** Green (Success), Yellow (Pending/Hold), Red (Failed) for immediate cognitive recognition.
- **Progress Bars:** Visual representation of daily limits to prevent unexpected declines.

## KPI Framework
- **Task Success Rate:** Percentage of successful simulated transactions.
- **Error Recovery Rate:** How often users correct a failed state (e.g., lowering the amount).
- **Time on Task:** Speed from clicking "Send" to seeing the confirmation.

## MVP
The current iteration encompasses the MVP, handling core P2P features, edge cases, and a comprehensive dashboard.

## Roadmap
- **Q1:** Implement actual backend and database integration (Node.js/PostgreSQL).
- **Q2:** Integrate Plaid for real bank funding sources.
- **Q3:** Deploy actual machine learning models for anomaly detection.

## Future Opportunities
- Group payments/splitting.
- International remittances with FX rates.
- Crypto/stablecoin off-ramps.

## Screenshots
*(Screenshots will be added to the `screenshots/` directory)*
- `screenshots/dashboard.png`
- `screenshots/payment_modal.png`
- `screenshots/history.png`

## Getting Started
### Prerequisites
- Node.js (v18+)

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/adishuklaa/ai-p2p-payment-platform.git
   cd ai-p2p-payment-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
*(None required for the synthetic data prototype. For future backend integration, see `.env.example`)*

## Project Structure
```
ai-p2p-payment-platform/
├── src/
│   ├── App.tsx          # Main Application and State Logic
│   ├── index.css        # Tailwind Base
│   └── main.tsx         # React Entry Point
├── screenshots/         # UI Previews
├── package.json
└── tailwind.config.js
```

## Limitations
- State resets upon page reload due to reliance on React component state (no local storage or DB implemented yet).
- Risk AI is simulated via threshold logic rather than actual model inference.

## Future Improvements
- Add persistent storage (Zustand + LocalStorage).
- Build dedicated components rather than a single `App.tsx` monolith for better maintainability.

## Interview Talking Points
- **60-sec explanation:** "This is a React-based P2P payment prototype that simulates complex transaction flows, including AI-driven risk holds, daily limits, and failure states, wrapped in a modern, responsive UI."
- **Problem:** Existing payment demos ignore edge cases like insufficient funds or compliance holds.
- **Decision:** Used React state machines to heavily simulate these edge cases in the UI.
- **Tradeoff:** Kept everything in the frontend to demonstrate UX rather than spending time on a mock API.
- **Tech:** React, TypeScript, Tailwind, Recharts.
- **AI:** Simulated through rule-based risk flags (e.g., >$1000).
- **Metrics:** Trackable via successful transaction completions vs failure encounters.
- **Next:** Backend integration with a real database and payment gateway API.
- **Questions:** How would we scale the simulated AI into a real ML microservice?

## Disclaimer
This is a prototype application built for demonstration purposes. It does not process real financial transactions or connect to actual bank accounts.
