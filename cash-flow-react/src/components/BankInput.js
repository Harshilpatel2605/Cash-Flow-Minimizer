import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Paper,
  IconButton,
  Grid
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

export const BankInputComponent = ({
  bank,
  index,
  onUpdate,
  onDelete,
  isWorldBank = false
}) => {
  const [newPaymentType, setNewPaymentType] = useState('');

  const handleNameChange = (name) => {
    onUpdate(index, { ...bank, name });
  };

  const handleAddPaymentType = () => {
    if (newPaymentType.trim() && !bank.types.includes(newPaymentType.trim())) {
      onUpdate(index, {
        ...bank,
        types: [...bank.types, newPaymentType.trim()]
      });
      setNewPaymentType('');
    }
  };

  const handleRemovePaymentType = (typeToRemove) => {
    onUpdate(index, {
      ...bank,
      types: bank.types.filter(type => type !== typeToRemove)
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddPaymentType();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={isWorldBank ? "World Bank Name" : "Bank Name"}
            value={bank.name}
            onChange={(e) => handleNameChange(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {isWorldBank ? (
              <Chip
                label="All payment types supported"
                color="success"
                variant="filled"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            ) : (
              bank.types.map((type, typeIndex) => (
                <Chip
                  key={typeIndex}
                  label={type}
                  onDelete={() => handleRemovePaymentType(type)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))
            )}
          </Box>
          {!isWorldBank && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add payment type"
                value={newPaymentType}
                onChange={(e) => setNewPaymentType(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddPaymentType}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={2}>
          <IconButton
            color="error"
            onClick={() => onDelete(index)}
            disabled={isWorldBank}
            title={isWorldBank ? "Cannot delete World Bank" : "Delete Bank"}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}; 