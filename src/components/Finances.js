import React, { Component } from 'react';
import { store } from '../services/firebase';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
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

    const date = new Date(data.date.seconds*1000);

    const value = (data.value/100).toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });

    let tags = '';

    if (data.tags.length > 0) {
      tags = data.tags.join(', ');
    }

    const entry = {
      id: doc.id,
      date: date.toLocaleDateString(),
      value: value,
      description: data.description,
      tags: tags,
    };

    this.setState({
      entries: [ ...this.state.entries, entry ],
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell numeric>Valor</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.entries.map(entry => {
              return (
                <TableRow key={entry.id}>
                  <TableCell component="th" scope="row">
                    {entry.date}
                  </TableCell>
                  <TableCell numeric>{entry.value}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.tags}</TableCell>
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
