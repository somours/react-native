import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import DynamicTabNavigator from '../navigators/DynamicTabNavigator'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import NavigationUtil from '../navigators/NavigationUtil'
import {NavigationAction} from 'react-navigation'
import {connect} from 'react-redux'
import BackPressComponent from '../common/BackPressComponent'
import CustomTheme from './CustomTheme'
import action from '../action'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.backPress = new BackPressComponent({backPress: this.onBackPress})
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress = () => {
    const {dispatch, nav} = this.props
    if(nav.routes[1].index === 0) {
      return false
    }
    dispatch(NavigationAction.back())
    return true
  }

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props
    return (
      <CustomTheme 
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    )
  }
  render() { 
    NavigationUtil.navigation = this.props.navigation
    const {theme} = this.props

    return ( 
      <SafeAreaViewPlus topColor={theme.themeColor}>
        <DynamicTabNavigator />
        {this.renderCustomThemeView()}
      </SafeAreaViewPlus>
    );
  } 
} 


const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible
})

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(action.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)