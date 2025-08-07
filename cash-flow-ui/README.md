# Cash Flow Minimizer - React UI

A modern React application that implements a cash flow minimization algorithm to reduce the number of transactions between banks with different payment modes.

## Features

- **Interactive UI**: Beautiful Material-UI based interface with step-by-step workflow
- **Bank Management**: Add banks and their supported payment types
- **Transaction Input**: Define transactions between banks
- **Optimization Results**: View minimized transactions with savings statistics
- **World Bank Integration**: Automatic intermediary bank for incompatible payment types

## How It Works

The application uses the same algorithm as the original C++ implementation:

1. **Bank Setup**: Define banks and their supported payment types
2. **Transaction Input**: Enter all transactions between banks
3. **Optimization**: The algorithm finds the minimum number of transactions needed
4. **Results**: View the optimized transaction list with statistics

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd cash-flow-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Step 1: Setup Banks
- The World Bank is pre-configured with all payment types
- Add additional banks with their specific payment types
- Each bank can have multiple payment types (e.g., Google Pay, PayTM, UPI)

### Step 2: Add Transactions
- Define transactions between banks
- Specify debtor (owes money), creditor (receives money), and amount
- Add multiple transactions as needed

### Step 3: View Results
- The algorithm calculates the minimum transactions needed
- View optimization statistics and detailed transaction list
- See how many transactions were saved

## Example

**Input:**
- World Bank: Google Pay, PayTM
- Bank B: Google Pay
- Bank C: Google Pay
- Bank D: PayTM
- Bank E: PayTM

**Transactions:**
- Bank B → World Bank: ₹300
- Bank C → World Bank: ₹700
- Bank D → Bank B: ₹500
- Bank E → Bank B: ₹500

**Result:**
- Minimized to fewer transactions using optimal payment types
- Shows exact transactions needed to settle all debts

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and styling
- **Custom Algorithm** ported from C++ to TypeScript

## Project Structure

```
src/
├── components/
│   ├── BankInput.tsx          # Bank setup component
│   ├── TransactionInput.tsx   # Transaction input component
│   └── ResultsDisplay.tsx     # Results display component
├── utils/
│   └── cashFlowMinimizer.ts   # Core algorithm implementation
├── types.ts                   # TypeScript interfaces
└── App.tsx                   # Main application component
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Algorithm Details

The cash flow minimizer uses a greedy algorithm that:

1. Calculates net amounts for each bank
2. Finds banks with minimum and maximum net amounts
3. Matches banks with common payment types
4. Uses the World Bank as intermediary when needed
5. Minimizes the total number of transactions

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
