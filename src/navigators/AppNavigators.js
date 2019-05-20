import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from '../pages/Home'
import DetailsScreen from '../pages/Detail' 

const Navigator = createStackNavigator(
    {
      Home: HomeScreen,
      Details: DetailsScreen
    },
    {
      initialRouteName: "Home"
    }
);

const AppNavigator = createAppContainer(Navigator);

export default AppNavigator