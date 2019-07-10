import React, { Component } from 'react'
import BackPressComponent from '../../common/BackPressComponent';
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import GlobalStyles from '../../res/styles/GlobalStyles'
import { View, Text, Dimensions, DeviceInfo, Platform, StyleSheet } from 'react-native'
import { Global } from '@jest/types';
import ViewUtil from '../../util/ViewUtil';


export const FLAG_ABOUT = { flag_about: 'about', flag_about_me: 'about_me' };

export default class AboutCommon {
  constructor(props, updateState) {
    super(props)
    this.props = props
    this.updateState = updateState
    this.backPress = new BackPressComponent(() => this.onBackPress())
  }

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnMount() {
    this.backPress.componentWillUnmount()
  }

  getParllaxRenderConfig(params) {
    let config = {}
    let avatar = typeof (param.avatar) === 'string' ? { uri: params.avatar } : params.avatar
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT
          }}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height={ PARALLAX_HEADER_HEIGHT }
        }}></View>
      </View>
    )

    config.renderForeground = () => (
      <View key="parallax-header" styles={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar} />
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    )

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    )

    return config
  }

  render(contentView, params) {
    const { theme } = this.props
    const renderConfig = this.getParllaxRenderConfig(params)
    return (
      <ParallaxScrollView
        backgroundColor={theme.themeColor}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}
      >
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const window = Dimensions.get('window')
const AVATAR_SIZE = 90
const PARALLAX_HEADER_HEIGHT = 270
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIphoneX_deprecated ? 24 : 0) : 0
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  }
})