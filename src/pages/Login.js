import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import { gray } from 'ansi-colors';

export default class Login extends Component{
    render() {
			const {navigation} = this.props
        return (
            <View style={{flex:1 ,backgroundColor: gray}}>
                <Text style={styles.text}>登录页</Text>
								<Button title="login" onPress = {() => {
									navigation.navigate('App')
								}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
	text: {
		fontSize: 20,
		color: 'red'
	}
})