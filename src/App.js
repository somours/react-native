import React, {Component} from "react"; 
import AppNavigator from './navigators/AppNavigators';
import {Provider} from 'react-redux'
import store from './store/index'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}
