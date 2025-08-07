import React from 'react';
import {
  TextField,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

export const TransactionInputComponent = ({
  transaction,
  index,
  banks,
  onUpdate,
  onDelete
}) => {
  const handleDebtorChange = (debtor) => {
    onUpdate(index, { ...transaction, debtor });
  };

  const handleCreditorChange = (creditor) => {
    onUpdate(index, { ...transaction, creditor });
  };

  const handleAmountChange = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    onUpdate(index, { ...transaction, amount: numAmount });
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Debtor Bank"
            value={transaction.debtor}
            onChange={(e) => handleDebtorChange(e.target.value)}
            variant="outlined"
            size="small"
          >
            {banks.map((bank) => (
              <MenuItem key={bank.name} value={bank.name}>
                {bank.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Creditor Bank"
            value={transaction.creditor}
            onChange={(e) => handleCreditorChange(e.target.value)}
            variant="outlined"
            size="small"
          >
            {banks.map((bank) => (
              <MenuItem key={bank.name} value={bank.name}>
                {bank.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={transaction.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={1}>
          <Typography variant="body2" color="text.secondary">
            Transaction #{index + 1}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={1}>
          <IconButton
            color="error"
            onClick={() => onDelete(index)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}; 