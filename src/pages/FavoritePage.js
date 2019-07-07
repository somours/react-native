import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import NavigationBar from '../common/NavigationBar'
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from "../expand/dao/DataStore";


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
        screen: props => { },
        navigationOptions: {
          title: '最热'
        }
      },
      'Trending': {
        screen: props => { },
        navigationOptions: {
          title: '收藏'
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
      <View>
        <Text>this is FavoritePage</Text>
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
  componnetDidMount() { }
  componentWillMount() { }
  loadData(isLoading) { }
  render() {
    return ()
  }
}

const mapStateToProps = state => ({
  // favorite: state.favorite
})

const mapDisPatchToProps = dispatch => ({
  // onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)) 
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