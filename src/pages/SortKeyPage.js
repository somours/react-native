import React, { Component } from 'react'
import { View, TouchableHighlight, StyleSheet, Text, Alert } from 'react-native'
import BackPressComponent from '../common/BackPressComponent'
import NavigationBar from '../common/NavigationBar'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import SortableListView from 'react-native-sortable-listview'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../res/styles/GlobalStyles';
import { connect } from 'react-redux'
import actions from '../action/index'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NavigationUtil from '../navigators/NavigationUtil';
import ArrayUtil from '../util/ArrayUtil';

class SortKeyPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) })
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      checkedArray: SortKeyPage._keys(this.props) //如果SortKeyPage._keys(this.props)为空数组，则会条用componentDidMount里的加载本地数据
    }
  }

  static _keys(props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props)
    let dataArray = props.language[flag] || []
    let keys = []
    dataArray.forEach((item) => {
      if (item.checked) {
        keys.push(item)
      }
    })
    return keys
  }
  static _flag(props) {
    const { flag } = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages' //这里的值对应于reducer中language下的值
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
    if (prevState.keys !== checkedArray) {
      return {
        keys: checkedArray
      }
    }
    return null
  }

  componentDidMount() {
    this.backPress.componentDidMount()
    //获取初始数据
    //如果props中标签为空则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let { onLoadLanguage } = this.props
      onLoadLanguage(this.params.flag)
    }
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }


  onBackPress() {
    this.onBack()
    return true
  }
  onBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('提示', '要保存修改吗？', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.goBack(this.props.navigation)
          }
        },
        {
          text: '是',
          onPress: () => {
            this.onSave(true) //这里已经确认过有变动，需要保存了，所以传true， 在onSave时可以不用在比较了
          }
        }
      ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }
  onSave(hasChecked) {
    if (!hasChecked) { //因为在返回键的时候会自己判断比较一次，所以这里不用比较，直接进行后面的操作
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return
      }
    }
    //保存排序后的数剧到本地
    this.languageDao.save(this.getSortResult())
    //更新store的数据
    const { onLoadLanguage } = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }
  getSortResult() {
    const flag = SortKeyPage._flag(this.props)
    //获取拷贝原始数据， 尚未保存更新时的
    let unUpdateArray = this.props.language[flag]
    let sortResultArray = ArrayUtil.clone(unUpdateArray)
    //获取排序之前的数据
    const originalCheckedArray = SortKeyPage._keys(this.props)
    // 遍历逐个替换
    for (let i = 0, l = originalCheckedArray.length; i < l; i++) {
      let item = originalCheckedArray[i]
      let index = unUpdateArray.indexOf(item)
      //逐个进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]) //插件改变的应该是state.checkedArray，因为用的这个
    }
    return sortResultArray
  }

  render() {
    const { theme } = this.params
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      style={theme.styles.navBar}
      rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
    />

    return <SafeAreaViewPlus style={GlobalStyles.root_container} topColor={theme.themeColor}>
      {navigationBar}
      <SortableListView
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <RowComponent data={row} {...this.params} />}
      />
    </SafeAreaViewPlus>
  }
}

class RowComponent extends Component {
  render() {
    const { theme } = this.props
    //this.props.data的值为checkedArray中每个key所对应的值
    //this.props.sortHandlers这个应该是插件的东东，不知道是什么
    return <TouchableHighlight
      underlayColor={'#eee'}
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}
    >
      <View style={{ marginLeft: 10, flexDirection: 'row' }}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{ marginRight: 10, color: theme.themeColor }}
        />
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapStateToProps = state => ({
  language: state.language
})

const mapDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapStateToProps, mapDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  hidden: {
    height: 0
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  },
  item: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  }
})