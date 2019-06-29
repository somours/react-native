import React, { Component } from 'react'
import { View, Text, StyleSheet, RefreshControl, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import actions from '../action/index'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'
import Toast from 'react-native-easy-toast'
import PopularItem from '../common/PopularItem';
import NavigationUtil from '../navigators/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil';
import NavigationBar from '../common/NavigationBar'
import Ionicons from 'react-native-vector-icons/Ionicons'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
const pageSize = 10 //设为常量

class PopularPage extends Component {
    constructor(props) {
        super(props)
        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }
    _genTabs() {
        const tabs = {}
        const { keys, theme } = this.props
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs
    }

    renderRightButton() {
        const { theme } = this.props
        return <TouchableOpacity
            onPress={() => { }}
        >
            <View style={{ padding: 5, marginRight: 8 }}>
                <Ionicons
                    name={'ios-search'}
                    size={24}
                    style={{
                        marginRight: 8,
                        alignSelf: 'center',
                        color: 'white'
                    }}
                />
            </View>
        </TouchableOpacity>
    }

    render() {
        const { keys, theme } = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }

        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />

        const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    style: {
                        backgroundColor: theme.themeColor,
                        height: 30
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                },
                lazy: true
            }
        )) : null

        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
            </View>
        )
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme
})

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

class PopularTab extends Component {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props
        this.storeName = tabLabel
        this.isFavoriteChanged = false
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(loadMore, refreshFavorite) {
        const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, () => {
                this.refs.toast.show('no more')
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
        }
    }

    _store() {
        const { popular } = this.props
        let store = popular[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [], //要显示的数据
                hideLoadingMore: true
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item
        const { theme } = this.props
        return <PopularItem
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_popular,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
        />
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    render() {
        let store = this._store()
        const { theme } = this.props
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => '' + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={'theme.themeColor'}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        console.log('.....onEndReached....')
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore = false
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true
                        console.log('...onMomentumScrollBegin...')
                    }}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    popular: state.popular
})

const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabStyle: {
        padding: 0
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }

})