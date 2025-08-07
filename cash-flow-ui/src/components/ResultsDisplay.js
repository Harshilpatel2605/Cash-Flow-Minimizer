import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  AccountBalance as BankIcon,
} from '@mui/icons-material';

export const ResultsDisplayComponent = ({
  transactions,
  originalTransactionCount,
  minimizedTransactionCount
}) => {
  const savings = originalTransactionCount - minimizedTransactionCount;
  const savingsPercentage = originalTransactionCount > 0 
    ? ((savings / originalTransactionCount) * 100).toFixed(1)
    : '0';

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {originalTransactionCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Original Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {minimizedTransactionCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minimized Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error">
                  {savings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transactions Saved ({savingsPercentage}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        
        {transactions.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No transactions needed - all banks are already balanced!
          </Typography>
        ) : (
          <List>
            {transactions.map((transaction, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <BankIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" component="span">
                          <strong>{transaction.from}</strong> pays ₹{transaction.amount} to <strong>{transaction.to}</strong>
                        </Typography>
                        <Chip
                          label={`via ${transaction.paymentType}`}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={`Transaction #${index + 1}`}
                  />
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}; 