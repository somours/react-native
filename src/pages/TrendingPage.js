import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
export default class TrendingPage extends Component {
    constructor(props) {
        super(props)
    }
    _genTab() {
      const tabs = {}

    }

    _tabNav() {
      const {theme} = this.props
      this.theme = theme
    }
    render() {
        return (
            <View>
                <Text>this is TrendingPage</Text>
            </View>
        )
    }
}