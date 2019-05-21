import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import HomeScreen from '../pages/Home'
import DetailsScreen from '../pages/Detail' 

const Navigator = createStackNavigator(
    // {
    //   HomeScreen: {
    //     screen: HomeScreen,
    //     navigationOptions: {
    //       header: null
    //     }
    //   },
    //   DetailsScreen: {
    //     screen: DetailsScreen,
    //     navigationOptions: {
    //       header: null
    //     }
    //   }
    // }
    // {
    //   initialRouteName: "Home"
    // }
    {
      HomeScreen: HomeScreen,
      DetailsScreen: DetailsScreen
    }
);

const AppNavigator = createAppContainer(Navigator);

export default AppNavigator