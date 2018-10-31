import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import NewEntry from './components/NewEntry';
import Finances from './components/Finances';

import './App.css';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <NewEntry />

          <Finances />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
