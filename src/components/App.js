import React from 'react';
import './App.css';
import MainAppHeader from './MainAppHeader'
import MainAppBody from './MainAppBody'

class App extends React.Component {
  render() {
    return (
      <>
        <MainAppHeader />
        <MainAppBody />
      </>
    );
  }
}

export default App;
