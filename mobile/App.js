import React from 'react';
import FontLoader from './component/font-loader';
import Welcome from '../src/view/welcome';

export default class App extends React.Component {
  render() {
    return (
      <FontLoader>
        <Welcome />
      </FontLoader>
    );
  }
}
