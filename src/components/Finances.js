import React, { Component } from 'react';
import { store } from '../services/firebase';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  title: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  entryDate: {
    width: '100px',
  },
  entryValue: {
    width: '100px',
  },
  entryNegativeValue: {
    color: 'red',
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class Finances extends Component {
  state = {
    entries: [],
  };

  componentDidMount() {
    const finances = store.collection('finances');

    finances.orderBy('date', 'asc').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.pushEntry(doc);
      });
    });
  };

  pushEntry(doc) {
    const data = doc.data();

    const entry = {
      id: doc.id,
      date: data.date,
      value: data.value,
      description: data.description,
      tags: data.tags,
    };

    this.setState({
      entries: [ ...this.state.entries, entry ],
    });
  };

  formatDate(date) {
    return new Date(date.seconds*1000).toLocaleDateString();
  };

  formatValue(value) {
    const ptBRDefault = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' };
    const formated = (value/100).toLocaleString('pt-BR', ptBRDefault);

    return value < 0
      ? (<span style={{ color: 'red' }}>{formated}</span>)
      : (<span>{formated}</span>);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h6" component="h1">Finanças</Typography>
        </div>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.entryDate}>Data</TableCell>
              <TableCell numeric className={classes.entryValue}>Valor</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.entries.map(entry => {
              return (
                <TableRow key={entry.id}>
                  <TableCell component="th" scope="row">
                    {this.formatDate(entry.date)}
                  </TableCell>

                  <TableCell numeric>
                    {this.formatValue(entry.value)}
                  </TableCell>

                  <TableCell>{entry.description}</TableCell>

                  <TableCell>
                    {entry.tags.map((tag, index) => {
                      return (
                        <Chip label={tag} key={index} className={classes.chip} />
                      )
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(Finances);
