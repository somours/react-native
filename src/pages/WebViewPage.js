import React, { Component } from 'react'
import {WebView} from 'react-native-webview'
import BackPressComponent from '../common/BackPressComponent'
import NavigationUtil from '../navigators/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import ViewUtil from '../util/ViewUtil'
import GlobalStyles from '../res/styles/GlobalStyles'

export default class WebViewPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { title, url } = this.params
    this.state = {
      title,
      url,
      canGoBack: false
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
      NavigationUtil.goPage(this.props.navigation)
    }
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const { theme } = this.params
    let navigationBar = <NavigationBar
      title={this.state.title}
      style={theme.styles.navBar}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
    />

    return (
      <SafeAreaViewPlus style={GlobalStyles.root_container} topColor={theme.themeColor}>
        {navigationBar}
        <WebView 
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </SafeAreaViewPlus>
    )
  }
}