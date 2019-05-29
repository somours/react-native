import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {connect} from 'react-redux'
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import action from '../action';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import NavigationBar from '../common/NavigationBar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

class TrendingPage extends Component {
    constructor(props) {
				super(props)
				this.state = {
					timeSpan: TimeSpans[0]
				}
				const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
    }
    _genTab() {
      const tabs = {}
			const {keys, theme} = this.props
			keys.forEach((item, index) => {
				if(item.checked) {
					tabs[`tab${index}`] = {
						screen: props => <TrendingTab {...props} tabLabel={item.name} />,
						navigationOptions: {
							title: item.name
						}
					}
				}
			})
			return tabs
		}

		renderTitleView() {
			return (
				<View>
					<TouchableOpacity 
						underlayColor='transparent'
						onPress={() => this.dialog.show()}
					>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontSize: 18,color:'#fff',fontWeight: '400'}}>
								趋势 {this.state.timeSpan.showText}
							</Text>
							<MaterialIcons
								name={'arrow-drop-down'}
								size={22}
								style={{color: 'white'}}
							/>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		onSelectTimeSpan(tab) {
			this.dialog.dismiss()
			this.setState({
				timeSpan: tab
			})

		}

		renderTrendingDialog() {
			return <TrendingDialog 
				ref={dialog => this.dialog = dialog}
				onSelect={tab => this.onSelectTimeSpan(tab)}
			/>
		}

    _tabNav() {
      const {theme} = this.props
			this.theme = theme
			this.tabNav = createAppContainer(createMaterialTopTabNavigator(
				this._genTab(),{
					tabBarOptions: {
						tabStyle: styles.tabStyle,
						upperCaseLabel: false,
						scrollEnabled: true,
						style: {
							backgroundColor: theme.themeColor,
							height: 30,
						},
						indicatorStyle: styles.indicatorStyle,
						labelStyle: styles.labelStyle
					},
					lazy: true
				}
			))
			return this.tabNav
		}
    render() {
			const {keys, theme} = this.props;
			let statusBar = {
				backgroundColor: theme.themeColor,
				barStyle: 'light-content'
			}
			let navigationBar = <NavigationBar 
				titleView={this.renderTitleView()}
				statusBar={statusBar}
				style={theme.styles.navBar}
			/>

			const TabNavigator = keys.length ? this._tabNav() : null;
        return (
            <View style={styles.container}>
							{navigationBar}
							{TabNavigator && <TabNavigator/>}
							{this.renderTrendingDialog()}
            </View>
        )
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme
})

const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(action.onLoadLanguage(flag))
})

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)

class TrendingTab extends Component {
	constructor(props){
		super(props)
	}
	render() {
		return (
			<View >
				<Text>{this.props.tabLabel}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	tabStyle: {
		padding: 10,
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white'
	},
	labelStyle: {
		fontSize: 13,
    margin: 0,
	},
	indicatorContainer: {
		alignItems: "center"
	},
	indicator: {
		color: 'red',
		margin: 10
	}
})