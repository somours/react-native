import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme'
import { onLoadLanguage } from './language'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending'
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular'
import { onLoadFavoriteData } from './favorite'

export default {
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  onLoadLanguage,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onLoadFavoriteData
}