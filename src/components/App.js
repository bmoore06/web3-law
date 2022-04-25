import React from 'react';
import MainAppHeader from './MainAppHeader';
import MainApp from './MainApp';


class App extends React.Component {
  render() {
    return (
      <>
        <MainAppHeader />
        <MainApp />
      </>
    );
  }
}

export default App;
