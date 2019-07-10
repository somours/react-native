import React, { component } from 'react'
import GlobalStyles from '../../res/styles/GlobalStyles'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import config from '../../res/data/config.json'
import ViewUtil from '../../util/ViewUtil'

export default class AboutPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about
    }, data => this.setState({ ...data }))
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
    const
  }

}