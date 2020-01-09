import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '80%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));


const Transaction = ({transaction}) => {
    const classes = useStyles();
    return (<ExpansionPanel key={transaction.id}>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography className={classes.heading}>Type: {transaction.type} Amount: {transaction.amount}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        <p>Transaction Id: {transaction.id}</p>
      <p>Date: {transaction.date} </p>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>)
}

export default Transaction