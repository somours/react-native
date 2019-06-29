import React, { Component } from 'react'
import { View, Text, StyleSheet, WebView, TouchableOpacity } from 'react-native'
import BackPressComponent from '../common/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil';
import NavigationBar, { NAVIGATION_BAR_HEIGHT } from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";

const TRENDING_URL = 'https://github.com/'

export default class DetailPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { projectModel, flag } = this.params
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName
    const title = projectModel.item.full_name || projectModel.item.fullName
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
    }
    this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() })
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack()
    return true
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.naviogation)
    }
  }

  renderRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => this.onFavoriteButtonClick()}
        >
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{ color: 'white', marginRight: 10 }}
          />
        </TouchableOpacity>
        {
          ViewUtil.getShareButton(() => {
            // let shareApp = share
          })
        }
      </View>
    )
  }
  onFavoriteButtonClick() { }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    const { theme } = this.params
    const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={[styles.navBar, theme.styles.navBar]}
      rightButton={this.renderRightButton()}
    />
    return (
      <SafeAreaViewPlus
        topColor={theme.themeColor}
      >
        <View style={styles.container}>
          <WebView
            style={{ marginTop: NAVIGATION_BAR_HEIGHT }}
            ref={(webView => this.webView = webView)}
            startInLoadingState={true}
            onNavigationStateChange={e => this.onNavigationStateChange(e)}
            source={{ uri: this.state.url }}
          />
          {navigationBar}
        </View>
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0
  }
})