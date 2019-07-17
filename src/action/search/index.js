import Types from '../types'
import { _projectModels, doCallBack, handleData } from '../ActionUtil'
import ArrayUtil from '../../util/ArrayUtil'
import Util from '../../util/Util'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const CANCEL_TOKENS = []

function getFetchUrl(key) {
  return API_URL + key + QUERY_STR
}

function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token)
    return true
  }
  return false
}

export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({ type: Types.SEARCH_REFRESH })
    fetch(getFetchUrl(inputKey)).then((response) => {
      return hasCancel(token) ? null : response.json()
    }).then((responseData) => {
      if (hasCancel(token, true)) {
        console.log('user cancel')
        return
      }
      if (!responseData || !responseData.items || responseData.items.length === 0) {
        dispatch({ type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目` })
        doCallBack(callBack, `没有找到关于${inputKey}的项目`)
        return
      }
      let items = responseData.items
      handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', { data: items }, pageSize, favoriteDao, {
        showBottomButton: !Util.checkKeyIsExist(popularKeys, inputKey),
        inputKey
      })
    }).catch((e) => {
      console.log(e)
      dispatch({ type: Types.SEARCH_FAIL, error: e })
    })
  }
}

export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => { //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex
        })
      } else {
        let max = pageIndex * pageSize > dataArray.length ? dataArray.length : pageIndex * pageSize
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data
          })
        })
      }
    }, 500)
  }
}


export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({ type: Types.SEARCH_CANCEL })
  }
}
