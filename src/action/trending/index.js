import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {_projectModels, handData} from '../ActionUtil'

export function onFreshTrending(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH, 
      storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending).then((data) => {
      handData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
    }).catch((error) => {
      dispatch({
        type: Types.TRENDING_REFRESH_FAIL,
        storeName,
        error
      })
    })
  }
}

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {
      if((pageIndex - 1) * pageSize >= dataArray.length) {
        if(typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModels: dataArray
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data
          })
        })
      }
    }, 500)
  }
}

export default onFlushTrendingFavorite(){}