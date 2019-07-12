import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import BackPressComponent from '../common/BackPressComponent';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../res/styles/GlobalStyles';
import CheckBox from 'react-native-check-box'
import actions from '../action/index'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ArrayUtil from '../util/ArrayUtil'
import NavigationUtil from '../navigators/NavigationUtil';

class CustomKeyPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.changeValues = []
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) })
    this.isRemoveKey = !!this.params.isRemoveKey
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }
  static _keys(props, original, state) {
    const { flag, isRemoveKey } = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    if (isRemoveKey && !original) {
      //如果state中的keys为空则从props中取
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
        return { //不直接修改props，copy一份
          ...val,
          checked: false
        }
      })
    } else { //自定义语言页面与自定义标签页面的列表值
      return props.language[key]
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState)
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()
    //如果props中标签或者语言的值为空，则从本地load
    if (CustomKeyPage._keys(this.props).length === 0) {
      let { onLoadLanguage } = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }
  componentWillUnMount() {
    this.backPress.componentWillUnmount()
  }
  onBackPress() {
    this.onBack()
    return true
  }
  onBack() {
    if (this.changeValues.length > 0) {
      Alert.alert('提示', '要保存修改吗', [
        {
          text: '是', onPress: () => {
            this.onSave()
          }
        },
        {
          text: '否', onPress: () => {
            NavigationUtil.goBack(this.props.navigation)
          }
        }
      ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }
  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation)
      return
    }
    let keys
    if (this.isRemoveKey) { //移除标签的处理
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name')
      }
    }
    //先更新存到本地的{localStorage}的数据， 再用onLoadLanguage更新store,
    this.languageDao.save(keys || this.state.keys)
    const { onLoadLanguage } = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }
  onClick(data, index) {
    data.checked = !data.checked
    ArrayUtil.updateArray(this.changeValues, data)
    this.state.keys[index] = data //更新state, 先该表的数据，再用setState更新视图
    this.setState({
      keys: this.state.keys
    })
  }
  _checkedImage(checked) {
    const { theme } = this.params
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{ color: theme.themeColor }}
    />
  }
  renderCheckBox(data, index) {
    return <CheckBox
      style={{ flex: 1, padding: 10 }}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />
  }
  renderView() {
    let dataArray = this.state.keys
    if (!dataArray || dataArray.length === 0) return
    let len = dataArray.length
    let views = []
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={GlobalStyles.line} />
        </View>
      )
    }
    return views
  }
  render() {
    const { theme } = this.params
    let title = this.isRemoveKey ? '标签移除' : '自定义标签'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      style={theme.styles.navBar}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
    />
    return <SafeAreaViewPlus style={styles.container} topColor={theme.themeColor}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </SafeAreaViewPlus>
  }
}

const mapStateToProps = state => ({
  language: state.language //此处的language是reducer中最外层的language,包括langauge和keys两种
})

const mapDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  }
})