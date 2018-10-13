import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import NewEntry from './components/NewEntry';

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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
