import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage' 
import WelcomePage from '../pages/WellcomePage'

const InitNavigator = createStackNavigator({
  WelcomePage: WelcomePage
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
  }
})

const AppNavigator = createAppContainer(createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
},{
  navigationOptions: {
    header: null
  }
}));

export default AppNavigator