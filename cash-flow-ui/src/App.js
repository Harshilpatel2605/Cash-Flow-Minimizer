import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { BankInputComponent } from './components/BankInput';
import { TransactionInputComponent } from './components/TransactionInput';
import { ResultsDisplayComponent } from './components/ResultsDisplay';
import { CashFlowMinimizer } from './utils/cashFlowMinimizer';

const steps = ['Setup Banks', 'Add Transactions', 'View Results'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [banks, setBanks] = useState([
    { name: 'World_Bank', types: ['Google_Pay', 'PayTM'] }
  ]);
  const [transactions, setTransactions] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (activeStep === 0 && banks.length < 2) {
      setError('Please add at least one bank besides the World Bank');
      return;
    }
    if (activeStep === 1 && transactions.length === 0) {
      setError('Please add at least one transaction');
      return;
    }
    
    setError('');
    if (activeStep === 1) {
      // Calculate results
      try {
        const minimizer = new CashFlowMinimizer(
          banks.map(bank => ({
            name: bank.name,
            netAmount: 0,
            types: new Set(bank.types)
          })),
          transactions
        );
        const minimizedTransactions = minimizer.minimizeCashFlow();
        setResults(minimizedTransactions);
      } catch (err) {
        setError('Error calculating results. Please check your input.');
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setBanks([{ name: 'World_Bank', types: ['Google_Pay', 'PayTM'] }]);
    setTransactions([]);
    setResults([]);
    setError('');
  };

  const handleBankUpdate = (index, bank) => {
    const newBanks = [...banks];
    newBanks[index] = bank;
    setBanks(newBanks);
  };

  const handleBankDelete = (index) => {
    if (index === 0) return; // Cannot delete World Bank
    const newBanks = banks.filter((_, i) => i !== index);
    setBanks(newBanks);
  };

  const handleAddBank = () => {
    setBanks([...banks, { name: `Bank_${banks.length}`, types: [] }]);
  };

  const handleTransactionUpdate = (index, transaction) => {
    const newTransactions = [...transactions];
    newTransactions[index] = transaction;
    setTransactions(newTransactions);
  };

  const handleTransactionDelete = (index) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(newTransactions);
  };

  const handleAddTransaction = () => {
    setTransactions([...transactions, { debtor: '', creditor: '', amount: 0 }]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'white' }}>
          <BankIcon sx={{ fontSize: 40, color: 'white' }} />
          Cash Flow Minimizer
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
          Minimize the number of transactions among multiple banks with different payment modes
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ 
        mb: 4, 
        '& .MuiStepLabel-root .MuiStepLabel-label': { color: 'white' }, 
        '& .MuiStepLabel-root .MuiStepLabel-label.Mui-active': { color: 'white' }, 
        '& .MuiStepLabel-root .MuiStepLabel-label.Mui-completed': { color: 'white' },
        '& .MuiStepIcon-root': { color: 'white' },
        '& .MuiStepIcon-root.Mui-active': { color: 'white' },
        '& .MuiStepIcon-root.Mui-completed': { color: 'white' },
        '& .MuiStepIcon-text': { fill: '#1976d2' }
      }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BankIcon color="primary" />
              Setup Banks and Payment Types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add banks and their supported payment types. The World Bank acts as an intermediary with all payment modes.
            </Typography>
            
            {banks.map((bank, index) => (
              <BankInputComponent
                key={index}
                bank={bank}
                index={index}
                onUpdate={handleBankUpdate}
                onDelete={handleBankDelete}
                isWorldBank={index === 0}
              />
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddBank}
              sx={{ mt: 2 }}
            >
              Add Bank
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" />
              Add Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Define the transactions between banks. The debtor bank owes money to the creditor bank.
            </Typography>
            
            {transactions.map((transaction, index) => (
              <TransactionInputComponent
                key={index}
                transaction={transaction}
                index={index}
                banks={banks}
                onUpdate={handleTransactionUpdate}
                onDelete={handleTransactionDelete}
              />
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddTransaction}
              sx={{ mt: 2 }}
            >
              Add Transaction
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" />
              Optimization Results
            </Typography>
            
            <ResultsDisplayComponent
              transactions={results}
              originalTransactionCount={transactions.length}
              minimizedTransactionCount={results.length}
            />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          variant="outlined"
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleReset}>
              Start Over
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 2 ? 'Calculate Results' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App; 