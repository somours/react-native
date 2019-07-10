import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'
import WelcomePage from '../pages/WelcomePage'
import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';

export const rootCom = 'Init' //设置跟路由

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null
    }
  }
})

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null
    }
  }
})

export const RootNavigator = createAppContainer(createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
}, {
    navigationOptions: {
      header: null
    }
  }));

export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = (state) => ({
  state: state.nav
})

export default connect(mapStateToProps)(AppWithNavigationState);