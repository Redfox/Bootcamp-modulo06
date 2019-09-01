import React, { Component } from 'react';

import { WebView } from 'react-native-webview';

export default class Repo extends Component {
  render() {
    return (
      <WebView
        source={{ uri: this.props.navigation.getParam('url') }}
        style={{ marginTop: 20 }}
      />
    );
  }
}

Repo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('name'),
});
