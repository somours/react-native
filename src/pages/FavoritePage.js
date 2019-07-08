import React, { Component } from 'react'
import { View, Text, StyleSheet, RefreshControl, FlatList } from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from '../common/NavigationBar'
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import Toast from 'react-native-easy-toast'
import TrendingItem from '../common/TrendingItem'
import PopularItem from '../common/PopularItem'
import NavigationUtil from '../navigators/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil'
import actions from '../action/index'
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";


class FavoritePage extends Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    let { theme } = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    //创建tab
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme} />,
        navigationOptions: {
          title: '最热'
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,
        navigationOptions: {
          title: '趋势'
        }
      }
    }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: theme.themeColor,
            height: 30
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }))
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
      </View>
    )
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme
})

export default connect(mapFavoriteStateToProps)(FavoritePage)

class FavoriteTab extends Component {
  constructor(props) {
    super(props)
    const { flag } = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(flag)
  }
  componentDidMount() {
    this.loadData(true)
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = (data) => {
      if (data.to === 2) {
        this.loadData(false)
      }
    })
  }
  componentWillMount() {
    EventBus.getInstance().removeListener(this.listener)
  }
  loadData(isShowLoading) {
    const { onLoadFavoriteData } = this.props
    onLoadFavoriteData(this.storeName, isShowLoading)
  }
  _store() {
    const { favorite } = this.props
    let store = favorite[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [] //这是要显示的数据，这里没有分页，所以items一样大小
      }
    }
    return store
  }
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
    }
  }
  renderItem(data) {
    const { theme } = this.props
    const item = data.item
    //组件Item
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }
  render() {
    let store = this._store()
    const { theme } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
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
  favorite: state.favorite
})

const mapDisPatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
})

const FavoriteTabPage = connect(mapStateToProps, mapDisPatchToProps)(FavoriteTab)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabStyle: {
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
})