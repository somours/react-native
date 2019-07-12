import React, { Component } from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{ padding: 8, paddingLeft: 12 }}
      onPress={callBack}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{ color: 'white' }}
      />
    </TouchableOpacity>
  }

  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{ opacity: 0.9, marginRight: 10, color: 'white' }}
      />
    </TouchableOpacity>
  }

  static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.setting_item_container}
      >
        <View style={{ alignItems: "center", flexDirection: 'row' }}>
          {
            Icons && icon ?
              <Icons
                name={icon}
                size={16}
                style={{ color: color, marginRight: 10 }}
              /> :
              <View style={{ opacity: 1, width: 16, height: 16, marginRight: 10 }}></View>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'balck'
          }}
        />
      </TouchableOpacity>
    )
  }

  static getMenuItem(callBack, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco)
  }

  static getRightButton(title, callBack) {
    return <TouchableOpacity style={{
      alignItems: 'center'
    }}
      onPress={callBack}
    >
      <Text style={{ fontSize: 20, color: '#fff', marginRight: 10 }}>{title}</Text>
    </TouchableOpacity>
  }
}


const styles = StyleSheet.create({
  setting_item_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white',
    padding: 10
  }
})