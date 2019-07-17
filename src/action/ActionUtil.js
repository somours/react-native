import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Util'

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, params) {
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }

  let showItems = pageSize > fixItems.length ? fixItems.length : fixItems.slice(0, pageSize)
  _projectModel(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params
    })
  })
}


export async function _projectModel(showItems, favoriteDao, callback) {
  let keys = []
  try {
    keys = await favoriteDao.getFavoriteKeys()
  } catch (e) {
    console.log(e)
  }
  let projectModels = []
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
  }
  doCallBack(callback, projectModels)
}


export const doCallBack = (callback, object) => {
  if (typeof callback === 'function') {
    callback(object)
  }
}

