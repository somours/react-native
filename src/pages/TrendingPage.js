import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import action from '../action';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FavoraiteDao from '../expand/dao/FavoriteDao'
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import NavigationUtil from '../navigators/NavigationUtil'
import Toast from 'react-native-easy-toast'
import FavoriteUtil from '../util/FavoriteUtil'

const favoriteDao = new FavoraiteDao(FLAG_STORAGE.flag_trending)
const URL = 'https://github.com/trending/';
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const pageSize = 10;//设为常量，防止修改

class TrendingPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			timeSpan: TimeSpans[0]
		}
		const { onLoadLanguage } = this.props
		onLoadLanguage(FLAG_LANGUAGE.flag_language)
	}
	_genTab() {
		const tabs = {}
		const { keys, theme } = this.props
		keys.forEach((item, index) => {
			if (item.checked) {
				tabs[`tab${index}`] = {
					screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} theme={theme} tabLabel={item.name} />,
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
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ fontSize: 18, color: '#fff', fontWeight: '400' }}>
							趋势 {this.state.timeSpan.showText}
						</Text>
						<MaterialIcons
							name={'arrow-drop-down'}
							size={22}
							style={{ color: 'white' }}
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
		const { theme } = this.props
		this.theme = theme
		this.tabNav = createAppContainer(createMaterialTopTabNavigator(
			this._genTab(), {
				tabBarOptions: {
					tabStyle: styles.tabStyle,
					upperCaseLabel: false,
					scrollEnabled: true,
					style: {
						backgroundColor: theme.themeColor,
						height: 40,
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
		const { keys, theme } = this.props;
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
				{TabNavigator && <TabNavigator />}
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
	constructor(props) {
		super(props)
		const { tabLabel, timeSpan } = this.props
		this.storeName = tabLabel
		this.timeSpan = timeSpan
		this.isFavoriteChanged = false
	}
	getFetchUrl(key) {
		return URL + key + '?' + this.timeSpan.searchText
	}

	_store() {
		const { trending } = this.props
		let store = trending[this.storeName]
		if (!store) {
			store = {
				items: [],
				isLoading: false,
				projectModels: [], //页面上要显示的数据
				hideLoadingMore: true //控制加载更多的显示与隐藏
			}
		}
		return store
	}

	componentDidMount() {
		this.loadData()
	}

	loadData(loadMore, refreshFavorite) {
		const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props
		const store = this._store()
		const url = this.getFetchUrl(this.storeName)
		if (loadMore) {
			onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, () => {
				this.$refs.toast.show('没有更多了')
			})
		} else if (refreshFavorite) {
			onFlushTrendingFavorite(thsi.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao)
		} else {
			onRefreshTrending(this.storeName, url, store.pageSize, favoriteDao)
		}
	}

	renderItem(data) {
		console.log('data', data)
		const item = data.item
		console.log(item)
		const { theme } = this.props
		return <TrendingItem
			projectModel={item}
			theme={theme}
			onSelect={(callBack) => {
				NavigationUtil.goPage({
					theme,
					projectModel: item,
					flag: FLAG_STORAGE.flag_trending,
					callBack
				}, 'DetailPage')
			}}
			onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
		/>
		// onFavorite={(item, isFavorite) => }
	}

	genIndicator() {
		return this._store().hideLoadingMore ? null : <View style={styles.indicatorContainer}>
			<ActivityIndicator style={styles.indicatorStyle} />
			<Text>正在加载更多</Text>
		</View>
	}

	render() {
		let store = this._store()
		const { theme } = this.props
		console.log(store)
		return (
			<View style={styles.container}>
				<FlatList
					data={store.projectModels}
					renderItem={data => this.renderItem(data)}
					keyExtractor={item => '' + item.item.fullName}
					refreshControl={
						<RefreshControl
							title={'loading'}
							colors={[theme.themeColor]}
							titleColor={theme.themeColor}
							refreshing={store.isLoading}
							onRefresh={() => this.loadData()}
							tintColor={theme.themeColor}
						/>
					}
					ListFooterComponent={() => this.genIndicator()}
					onEndReached={() => {
						console.log('onEndReached')
						setTimeout(() => {
							this.loadData()
						}, 100)
					}}
					onEndReachedThreshold={0.5}
				/>
				<Toast ref={'toast'} position={'center'} />
			</View>
		)
	}
}

const mapStateToProps = state => ({
	trending: state.trending
})

const mapDispatchToProps = dispatch => ({
	onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(action.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
	onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(storeName, pageIndex, pageSize, items, favoriteDao, callBack),
	onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(storeName, pageIndex, pageSize, items, favoriteDao)
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	tabStyle: {
		padding: 10,
	},
	indicatorStyle: {
		height: 1,
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