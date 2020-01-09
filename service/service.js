
const express = require('express');
const service = express();
const bodyParser = require('body-parser');
const cors = require('cors')
service.use(bodyParser.urlencoded({ extended: true }));
service.use(bodyParser.json());

const whitelist = ['http://localhost:3002']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || true) {
      // Just remove true condition to use real whitelist.
      // I'm setting * as whitelist to allow hits via Postman, etc...
      callback(null, true)
    }
  }
}

service.use(cors(corsOptions));
service.options('*', cors(corsOptions));

// WIll use these two variables (user & history) to store data as no real persistence is needed

const user = {
  name: 'Walter Whitman',
  credit: 150.0
};
const history = [];

service.listen(3005, () => console.log('Service listening in port 3005'));

const parseNum = amount => Number(parseFloat(amount).toFixed(2));
const getNextId = () => history.length - 1 + 1;

const storeCredit = (req, res) => {
  if (!req.body.amount) {
    return res.status(400).json({ error: 'Amount is needed to perform transaction' });
  }
  const { success, status, error } = new transaction('credit', req.body.amount);
  if (success) {
    return res.status(status).json({
      operation: 'OK',
      creditAvailable: user.credit
    });
  } else if (error) {
    return res.status(status).json({
      error
    });
  } else {
    return res.status(400).json({
      message
    });
  }
};

const handleDebit = (req, res) => {
  if (!req.body.amount) {
    return res.status(400).json({ error: 'Amount is needed to perform transaction' });
  }
  const { success, status, error } = new transaction('debit', req.body.amount);
  if (success) {
    return res.status(status).json({
      operation: 'OK',
      creditAvailable: user.credit
    });
  } else if (error) {
    return res.status(status).json({
      error
    });
  } else {
    return res.status(400).json({
      error: 'Unkown reason'
    });
  }
};

const sendUserInfo = (req, res) => {
  res.status(200).send(user);
};

const sendHistory = (req, res) => {
  res.status(200).send(history);
};


const clearHistory = (req, res) => {
  while(history.length > 0) {
    history.pop()
  }
  user.credit = 0
  res.status(200).send(history);
};

const getTransactionById = (req, res) => {
  let transactionRelated = null;
  history.map(transaction => {
    if (transaction.id === Number(req.params.id)) {
      transactionRelated = transaction;
    }
  });
  if (transactionRelated) return res.status(200).send(transactionRelated);
  return res.status(400).send({ error: 'Transaction not found' });
};


function transaction(type, amount) {
    if (!amount) return { error: true, message: 'No amount provided', status: 400 };
    if (typeof amount !== 'number') return { error: 'Amount should be a number' };
    const parsedAmount = parseNum(amount);
    if (type === 'credit') {
      user.credit = parseNum(user.credit + parsedAmount);
    } else if (type === 'debit') {
      if (amount > user.credit) {
        return {
          status: 422,
          error: true,
          message: 'Insuficient founds. Please contact your bank or provide another payment method.'
        };
      } else {
        user.credit = parseNum(user.credit - parsedAmount);
      }
    } else {
      return { message: 'No operation provided' };
    }
    const newTransaction = { type, amount, id: getNextId(), date: new Date() };
    history.push(newTransaction);
    return { ...newTransaction, status: 201, success: true, message: 'Processed ok' };
}
  

service.post('/credit', (req, res) => storeCredit(req, res));
service.post('/debit', (req, res) => handleDebit(req, res));
service.get('/userInfo', (req, res) => sendUserInfo(req, res));
service.get('/transactions/:id', (req, res) => getTransactionById(req, res));
service.get('/accountHistory', (req, res) => sendHistory(req, res));
service.get('/clearHistory', (req, res) => clearHistory(req, res));


// Tests

new transaction('debit', 100);
new transaction('credit', 700);
new transaction('debit', 0.03);
new transaction('credit', '700');
new transaction('credit', { trying: true, break: false });
new transaction('debit', 100.12);
new transaction('debit', 15000);
new transaction('credit', 16000);
new transaction('debit', [100, 1000, 1002]);
new transaction('debit', 15000);

console.log('User credit after operations', user.credit);
console.log('history', history);

