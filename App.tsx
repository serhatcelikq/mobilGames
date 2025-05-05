import {View, Text, StatusBar} from 'react-native';

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import SplashScreen from './src/Screens/SplashScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import PaymentMethodsScreen from './src/Screens/PaymentMethodsScreen';
import {
  ThemeProvider,
  useTheme,
  ThemeContext,
} from './src/context/ThemeContext';
import {FavoritesProvider} from './src/context/FavoritesContext';
// Import Firebase configuration
import './firebase';

const Stack = createNativeStackNavigator();

// StatusBar tema değişimini uygulayacak bileşen
const ThemedStatusBar = () => {
  const {theme} = useTheme();
  return (
    <StatusBar
      barStyle={theme.statusBarStyle}
      backgroundColor={theme.headerColor}
      translucent={false}
    />
  );
};

// Ana Stack Navigator bileşeni
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentMethodsScreen"
        component={PaymentMethodsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ThemedStatusBar />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
