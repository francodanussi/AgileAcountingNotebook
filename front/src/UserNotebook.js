import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import Transaction from './Transaction'
const useStyles = makeStyles(theme => ({
  root: {
    width: '80%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default function UserNotebook() {
  const classes = useStyles();
  const [transactionsHistory, setTransactionsHistory] = useState([]);
  const [amountAvailable, setAmountAvailable] = useState(0)
  useEffect(() => {
    const fetchHistory = async () => {
      const historyFetched = await axios
        .get('http://localhost:3005/accountHistory', {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .catch(e => {
          console.log('error fetching', e);
        });
      if (historyFetched.data) {
          setTransactionsHistory(historyFetched.data);
      }
    };
    const fetchUserInfo = async() => {
        const userInfo = await axios
        .get('http://localhost:3005/userInfo', {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        .catch(e => {
          console.log('error fetching', e);
        });
      if (userInfo.data) {
          setAmountAvailable(userInfo.data.credit);
      }
    }
    fetchHistory();
    fetchUserInfo();
  }, []);
  const clearHistory = async () => {
    await axios
  .get('http://localhost:3005/clearHistory', {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
  .catch(e => {
    console.log('error fetching', e);
  });
  setTransactionsHistory([])
  } 
  if (transactionsHistory.length === 0) {
    return <div>No transactions here...</div>;
  }
  return (
      <>
    <p>Transactions history</p>
    <p>Amount available: ${amountAvailable}</p>
    <div className={classes.root}>
      {transactionsHistory.map(each => {
        return <Transaction transaction = {each} />;
      })}
    </div>
    <button onClick={e => clearHistory()}>Reset account</button>
    </>
  );

}

