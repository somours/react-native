import {AsyncStorage} from 'react-native'
import {ThemeFlags} from '../../res/styles/ThemeFactory'
import ThemeFactory from '../../res/styles/ThemeFactory'

const THEME_KEY = 'theme_key'

export default class ThemeDao{
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if(error) {
          reject(error)
        }
        if(!result) {
          this.save(ThemeFlags.default)
          result = ThemeFlags.default
        }
        resolve(ThemeFactory.createTheme(result))
      })
    })
  }
  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, (error) => {})
  } 
}