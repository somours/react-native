import Tpyes from '../types'
import LanguageDao from '../../expand/dao/LanguageDao'

export function onLoadLanguage(flagkey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagkey).fetch()
      dispatch({
        type: Tpyes.LANGUAGE_LOAD_SUCCESS,
        languages,
        flag: flagkey
      })
    } catch(e) {
      console.error(e)
    }
  }
}