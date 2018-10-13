import React, { Component } from 'react';
import { store } from '../services/firebase'

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ChipInput from 'material-ui-chip-input'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  field: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class NewEntry extends Component {
  state = {
    date: '',
    value: '',
    description: '',
    tags: [],
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAddChip = chip => {
    this.setState({
      tags: [ ...this.state.tags, chip ]
    });
  };

  handleDeleteChip = (chip, index) => {
    this.state.tags.splice(index, 1);

    this.setState({
      tags: this.state.tags
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const finances = store.collection('finances');

    let dateParts = this.state.date.split('-');
    let date = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

    let value = parseInt(this.state.value*100);

    finances.add({
      date: date,
      value: value,
      description: this.state.description,
      tags: this.state.tags,
    })
    .then(docRef => {
      console.log("Entry create with ID: ", docRef.id);

      this.setState({
        date: '',
        value: '',
        description: '',
        tags: [],
      });
    })
    .catch(error => {
      console.error("Error adding entry: ", error);
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card>
        <form onSubmit={this.handleSubmit}>
          <CardContent>
            <Typography variant="h6" component="h1">Nova Transação</Typography>
          </CardContent>
          <CardContent className={classes.container}>
            <TextField
              type="date"
              label="Data"
              value={this.state.date}
              className={classes.field}
              InputLabelProps={{ shrink: true }}
              onChange={this.handleChange('date')}
            />

            <TextField
              label="Valor"
              value={this.state.value}
              className={classes.field}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              onChange={this.handleChange('value')}
            />

            <TextField
              label="Descrição"
              value={this.state.description}
              className={classes.field}
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={this.handleChange('description')}
            />

            <ChipInput
              label="Tags"
              value={this.state.tags}
              className={classes.field}
              fullWidth
              InputLabelProps={{ shrink: true }}
              onAdd={this.handleAddChip}
              onDelete={this.handleDeleteChip}
            />
          </CardContent>
          <CardActions>
            <Button type="submit" size="small" color="primary">Adicionar</Button>
          </CardActions>
        </form>
      </Card>
    );
  }
}

export default withStyles(styles)(NewEntry);
