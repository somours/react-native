import {createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React, {Component} from 'react'
import TrendingPage from '../pages/TrendingPage'
import PopularPage from '../pages/PolpularPage'
import FavoritePage from '../pages/FavoritePage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MyPage from '../pages/MyPage'

const Tabs = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({tinyColor, focused}) => (
                <MaterialIcons 
                    name={'whatshot'}
                    size={26}
                    style={{color: tinyColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tinyColor, focused}) => (
                <Ionicons 
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tinyColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '喜欢',
            tabBarIcon: ({tinyColor, focused}) => (
                <MaterialIcons 
                    name={'favorite'}
                    size={26}
                    style={{color: tinyColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tinyColor, focused}) => (
                <Entypo 
                    name={'user'}
                    size={26}
                    style={{color: tinyColor}}
                />
            )
        }
    }
}

let BottomTab =createAppContainer(createBottomTabNavigator(Tabs)) 

class DynamicTabNavigator extends Component {
    render() {
        return (
            <BottomTab />
        )
    }
}

export default DynamicTabNavigator