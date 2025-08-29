export class CashFlowMinimizer {
  constructor(banks, transactions) {
    this.banks = banks.map(bank => ({
      ...bank,
      types: new Set(bank.types)
    }));
    this.maxNumTypes = Math.max(...banks.map(bank => bank.types.size));
    this.graph = this.createGraph(transactions);
  }

  createGraph(transactions) {
    const numBanks = this.banks.length;
    const graph = Array(numBanks).fill(0).map(() => Array(numBanks).fill(0));
    
    const bankIndexMap = new Map();
    this.banks.forEach((bank, index) => {
      bankIndexMap.set(bank.name, index);
    });

    transactions.forEach(transaction => {
      const debtorIndex = bankIndexMap.get(transaction.debtor);
      const creditorIndex = bankIndexMap.get(transaction.creditor);
      if (debtorIndex !== undefined && creditorIndex !== undefined) {
        graph[debtorIndex][creditorIndex] += transaction.amount;
      }
    });

    return graph;
  }

  getMinIndex(listOfNetAmounts) {
    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;
    
    for (let i = 0; i < listOfNetAmounts.length; i++) {
      if (listOfNetAmounts[i].netAmount === 0) continue;
      
      if (listOfNetAmounts[i].netAmount < min) {
        minIndex = i;
        min = listOfNetAmounts[i].netAmount;
      }
    }
    return minIndex;
  }

  getSimpleMaxIndex(listOfNetAmounts) {
    let max = Number.MIN_SAFE_INTEGER;
    let maxIndex = -1;
    
    for (let i = 0; i < listOfNetAmounts.length; i++) {
      if (listOfNetAmounts[i].netAmount === 0) continue;
      
      if (listOfNetAmounts[i].netAmount > max) {
        maxIndex = i;
        max = listOfNetAmounts[i].netAmount;
      }
    }
    return maxIndex;
  }

  getMaxIndex(listOfNetAmounts, minIndex) {
    let max = Number.MIN_SAFE_INTEGER;
    let maxIndex = -1;
    let matchingType = '';

    for (let i = 0; i < listOfNetAmounts.length; i++) {
      if (listOfNetAmounts[i].netAmount === 0) continue;
      if (listOfNetAmounts[i].netAmount < 0) continue;

      // Find intersection of payment types (like set_intersection in C++)
      const intersection = [];
      const minTypes = Array.from(listOfNetAmounts[minIndex].types);
      const iTypes = Array.from(listOfNetAmounts[i].types);
      
      for (const type of minTypes) {
        if (iTypes.includes(type)) {
          intersection.push(type);
        }
      }

      if (intersection.length > 0 && max < listOfNetAmounts[i].netAmount) {
        max = listOfNetAmounts[i].netAmount;
        maxIndex = i;
        matchingType = intersection[0];
      }
    }

    return { maxIndex, matchingType };
  }

  calculateNetAmounts() {
    const listOfNetAmounts = this.banks.map(bank => ({
      name: bank.name,
      netAmount: 0,
      types: new Set(bank.types)
    }));

    for (let b = 0; b < this.banks.length; b++) {
      let amount = 0;
      
      // Incoming edges (column traverse)
      for (let i = 0; i < this.banks.length; i++) {
        amount += this.graph[i][b];
      }
      
      // Outgoing edges (row traverse)
      for (let j = 0; j < this.banks.length; j++) {
        amount -= this.graph[b][j];
      }
      
      listOfNetAmounts[b].netAmount = amount;
    }

    return listOfNetAmounts;
  }

  minimizeCashFlow() {
    const listOfNetAmounts = this.calculateNetAmounts();
    const ansGraph = Array(this.banks.length)
      .fill(0)
      .map(() => Array(this.banks.length).fill(null).map(() => ({
        from: '',
        to: '',
        amount: 0,
        paymentType: ''
      })));

    let numZeroNetAmounts = 0;
    for (let i = 0; i < this.banks.length; i++) {
      if (listOfNetAmounts[i].netAmount === 0) numZeroNetAmounts++;
    }

    while (numZeroNetAmounts !== this.banks.length) {
      const minIndex = this.getMinIndex(listOfNetAmounts);
      const maxAns = this.getMaxIndex(listOfNetAmounts, minIndex);
      const maxIndex = maxAns.maxIndex;

      if (maxIndex === -1) {
        // Use World Bank (index 0) as intermediary
        const amount = Math.abs(listOfNetAmounts[minIndex].netAmount);

        ansGraph[minIndex][0].amount += amount;
        ansGraph[minIndex][0].paymentType = 'Any';
        ansGraph[minIndex][0].from = this.banks[minIndex].name;
        ansGraph[minIndex][0].to = this.banks[0].name;

        const simpleMaxIndex = this.getSimpleMaxIndex(listOfNetAmounts);
        ansGraph[0][simpleMaxIndex].amount += amount;
        ansGraph[0][simpleMaxIndex].paymentType = 'Any';
        ansGraph[0][simpleMaxIndex].from = this.banks[0].name;
        ansGraph[0][simpleMaxIndex].to = this.banks[simpleMaxIndex].name;

        listOfNetAmounts[simpleMaxIndex].netAmount += listOfNetAmounts[minIndex].netAmount;
        listOfNetAmounts[minIndex].netAmount = 0;

        if (listOfNetAmounts[minIndex].netAmount === 0) numZeroNetAmounts++;
        if (listOfNetAmounts[simpleMaxIndex].netAmount === 0) numZeroNetAmounts++;
      } else {
        const transactionAmount = Math.min(
          Math.abs(listOfNetAmounts[minIndex].netAmount),
          listOfNetAmounts[maxIndex].netAmount
        );

        ansGraph[minIndex][maxIndex].amount += transactionAmount;
        ansGraph[minIndex][maxIndex].paymentType = maxAns.matchingType;
        ansGraph[minIndex][maxIndex].from = this.banks[minIndex].name;
        ansGraph[minIndex][maxIndex].to = this.banks[maxIndex].name;

        listOfNetAmounts[minIndex].netAmount += transactionAmount;
        listOfNetAmounts[maxIndex].netAmount -= transactionAmount;

        if (listOfNetAmounts[minIndex].netAmount === 0) numZeroNetAmounts++;
        if (listOfNetAmounts[maxIndex].netAmount === 0) numZeroNetAmounts++;
      }
    }

    return this.processAnswerGraph(ansGraph);
  }

  processAnswerGraph(ansGraph) {
    const result = [];

    for (let i = 0; i < this.banks.length; i++) {
      for (let j = 0; j < this.banks.length; j++) {
        if (i === j) continue;

        if (ansGraph[i][j].amount !== 0 && ansGraph[j][i].amount !== 0) {
          if (ansGraph[i][j].amount === ansGraph[j][i].amount) {
            ansGraph[i][j].amount = 0;
            ansGraph[j][i].amount = 0;
          } else if (ansGraph[i][j].amount > ansGraph[j][i].amount) {
            ansGraph[i][j].amount -= ansGraph[j][i].amount;
            ansGraph[j][i].amount = 0;
            if (ansGraph[i][j].amount > 0) {
              result.push({...ansGraph[i][j]});
            }
          } else {
            ansGraph[j][i].amount -= ansGraph[i][j].amount;
            ansGraph[i][j].amount = 0;
            if (ansGraph[j][i].amount > 0) {
              result.push({...ansGraph[j][i]});
            }
          }
        } else if (ansGraph[i][j].amount !== 0) {
          result.push({...ansGraph[i][j]});
        } else if (ansGraph[j][i].amount !== 0) {
          result.push({...ansGraph[j][i]});
        }

        // Reset processed amounts to avoid double processing
        ansGraph[i][j].amount = 0;
        ansGraph[j][i].amount = 0;
      }
    }

    return result;
  }
} 