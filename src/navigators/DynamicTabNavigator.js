import {createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React, {Component} from 'react'
import HomeScreen from '../pages/Home'
import DetailsScreen from '../pages/Detail'



const Tabs = {
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel: '首页'
        }
    },
    DetailsScreen: {
        screen: DetailsScreen,
        navigationOptions: {
            tabBarLabel: '详情'
        }
    }
}

let BottomTab = createBottomTabNavigator(Tabs)

class DynamicTabNavigator extends Component {
    render() {
        return (
            <BottomTab />
        )
    }
}

export default DynamicTabNavigator