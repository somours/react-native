import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import DynamicTabNavigator from '../navigators/DynamicTabNavigator'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";


export default class HomeScreen extends Component {
    render() { 
      return ( 
        <SafeAreaViewPlus>
          <View style={{ flex: 1, color: 'red' }}>
            <Text>Home Screen</Text>
            {/* <Button
              title="Go to Details"
              onPress={() => this.props.navigation.navigate('Details')}
            /> */}
            {/* <DynamicTabNavigator /> */}
          </View> 
        </SafeAreaViewPlus>
      );
    } 
} 