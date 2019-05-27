import {createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React, {Component} from 'react'
import TrendingPage from '../pages/TrendingPage'
import PopularPage from '../pages/PolpularPage'
import FavoritePage from '../pages/FavoritePage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MyPage from '../pages/MyPage'
import {BottomTabBar} from 'react-navigation-tabs';
import { connect } from 'react-redux';


const Tabs = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons 
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons 
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '喜欢',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons 
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo 
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
}

// let BottomTab =createAppContainer(createBottomTabNavigator(Tabs)) 

class DynamicTabNavigator extends Component {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
    }

    _tabNavigator() {
        if(this.Tabs) {
            return this.Tabs
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = Tabs
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}
        PopularPage.navigationOptions.tabBarLabel = '最热'
        return this.Tabs = createAppContainer(createBottomTabNavigator(tabs), {
            tabBarComponent: props => {
                return <TabBarComponent theme={this.props.theme} {...props} />
            }
        })
    }
    render() {
        const Tab = this._tabNavigator()
        return <Tab />
    }
}

class TabBarComponent extends Component {
    constructor(props){
        super(props)
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime()
        }
    }

    render() {
        return <BottomTabBar 
            {...this.props}
            activeTinyColor={this.props.themeColor}
        />
    }
}


const mapStateToProps = state => ({
    theme: state.theme.theme
})


export default connect(mapStateToProps)(DynamicTabNavigator)
// export default DynamicTabNavigator