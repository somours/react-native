import React, { Component } from 'react'
import { View } from 'react-native'
import GlobalStyles from '../../res/styles/GlobalStyles'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import config from '../../res/data/config.json'
import ViewUtil from '../../util/ViewUtil'
import { MORE_MENU } from '../../common/MORE_MENU'

export default class AboutPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about
    })
    this.state = {
      data: config
    }
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount()
  }
  componentWillUnMount() {
    this.aboutCommon.componentWillUnMount()
  }
  onClick(menu) { }

  getItem(menu) {
    const { theme } = this.params
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
  }

  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line} />
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line} />
      {this.getItem(MORE_MENU.Feedback)}
    </View>

    return this.aboutCommon.render(content, this.state.data.app)
  }

}