import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import GlobalStyles from '../res/styles/GlobalStyles'
import NavigationBar from '../common/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MORE_MENU } from '../common/MORE_MENU'
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigators/NavigationUtil'

class MyPage extends Component {
	onClick(menu) {
		const { theme } = this.props
		let RouteName, params = { theme }
		switch (menu) {
			case MORE_MENU.Tutorial:
				RouteName = 'WebViewPage'
				params.title = '教程'
				params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
				break;
			case MORE_MENU.About:
				RouteName = 'AboutPage'
				break;
		}
		if (RouteName) {
			NavigationUtil.goPage(params, RouteName)
		}
	}
	getMenuItem(menu) {
		const { theme } = this.props
		return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
	}
	render() {
		const { theme } = this.props
		let statusBar = {
			backgroundColor: theme.themeColor,
			barStyle: 'light-content'
		}
		let navigationBar = <NavigationBar
			title={'我的'}
			statusBar={statusBar}
			style={theme.styles.navBar}
		/>

		return (
			<View style={GlobalStyles.root_container}>
				{navigationBar}
				<ScrollView>
					<TouchableOpacity style={styles.item} onPress={() => this.onClick(MORE_MENU.About)}>
						<View style={styles.about_left}>
							<Ionicons
								name={MORE_MENU.About.icon}
								size={40}
								style={{
									marginRight: 10,
									color: theme.themeColor
								}}
							/>
							<Text>Github Popular</Text>
						</View>
						<Ionicons
							name={'ios-arrow-forward'}
							size={16}
							style={{
								marginRight: 10,
								alignSelf: 'center',
								color: theme.themeColor
							}}
						/>
					</TouchableOpacity>
					<View style={GlobalStyles.line}></View>
					{this.getMenuItem(MORE_MENU.Tutorial)}
					{/* 趋势管理 */}
					<Text style={styles.groupTitle}>趋势管理</Text>
					{this.getMenuItem(MORE_MENU.Custom_Language)}
					<View style={GlobalStyles.line} />
					{this.getMenuItem(MORE_MENU.Sort_Language)}
					{/* 最热管理 */}
					<Text style={styles.groupTitle}>最热管理</Text>
					{this.getMenuItem(MORE_MENU.Custom_Key)}
					<View style={GlobalStyles.line} />
					{this.getMenuItem(MORE_MENU.Sort_Key)}
					<View style={GlobalStyles.line} />
					{this.getMenuItem(MORE_MENU.Remove_Key)}
					{/* 设置 */}
					<Text style={styles.groupTitle}>设置</Text>
					{/* 自定义主题 */}
					{this.getMenuItem(MORE_MENU.Custom_Theme)}
					<View style={GlobalStyles.line} />
					{/* 关于作者 */}
					{this.getMenuItem(MORE_MENU.About_Author)}
					<View style={GlobalStyles.line} />
					{/* 反馈 */}
					{this.getMenuItem(MORE_MENU.Feedback)}
					<View style={GlobalStyles.line} />
					{this.getMenuItem(MORE_MENU.CodePush)}
				</ScrollView>
			</View>
		)
	}
}

const mapStateToProps = state => ({
	theme: state.theme.theme
})

const mapDispatchToProps = dispatch => ({
	// onShow
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 30
	},
	about_left: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	item: {
		justifyContent: 'space-between',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		height: 90,
		backgroundColor: 'white'
	},
	groupTitle: {
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 5,
		fontSize: 12,
		color: 'gray'
	}
})