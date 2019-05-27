import React, {Component} from 'react'
import {View, Text} from 'react-native'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import NavigationUtil from '../navigators/NavigationUtil'

export default class PopularPage extends Component {
    render() {
        return (
            <View>
                <Text>this is PopularPage</Text>
            </View>
        )
    }
}