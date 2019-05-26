import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import DynamicTabNavigator from '../navigators/DynamicTabNavigator'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import NavigationUtil from '../navigators/NavigationUtil'


export default class HomeScreen extends Component {
    render() { 
      NavigationUtil.navigation = this.props.navigation
      return ( 
        <SafeAreaViewPlus>
          <DynamicTabNavigator />
        </SafeAreaViewPlus>
      );
    } 
} 