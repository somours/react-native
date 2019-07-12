import React, { Component } from 'react'
import { View } from 'react-native'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import config from '../../res/data/config.json'
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'


export default class AboutMePage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    }, data => this.setState({ ...data }))
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }

  componnetDidMount() {
    this.aboutCommon.componentDidMount()
  }
  componentWillUnMount() {
    this.aboutCommon.componentWillUnMount()
  }

  onClick() { }

  _item(data, isShow, key) {
    const { theme } = this.params
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }
  renderItems(dic, isShowAccount) {
    if (!dic) return null
    const { theme } = this.params
    let views = []
    for (let i in dic) {
      let title = isShowAccount ? (dic[i].title + ':' + dic[i].account) : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, theme.themeColor)}
          <View style={GlobalStyles.line} />
        </View>
      )
    }
    return views
  }

  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line} />
      {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles} />
      {this.state.showBlog ? this.renderItemsss(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line} />
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line} />
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
    </View>

    return <View style={{ flex: 1 }}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast
        ref={toast => this.toast = toast}
        position={'center'}
      />
    </View>
  }
}