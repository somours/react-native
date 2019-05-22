import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import DynamicTabNavigator from '../navigators/DynamicTabNavigator'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";


export default class HomeScreen extends Component {
    render() { 
      return ( 
        <SafeAreaViewPlus>
          <DynamicTabNavigator />
        </SafeAreaViewPlus>
      );
    } 
} 