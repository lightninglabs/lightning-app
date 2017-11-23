import React, { Component } from 'react';
import Main from './views/main';
// import reactCSS from 'reactcss';

class App extends Component {
  render() {
    return <Main />;

    // const styles = reactCSS({
    //   default: {
    //     container: {
    //
    //     },
    //   },
    // });
    //
    //
    // return (
    //   <div style={styles.container}>
    //     <Main />
    //   </div>
    // );
  }
}

export default App;
