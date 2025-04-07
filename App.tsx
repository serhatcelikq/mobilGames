import {View, Text, StatusBar} from 'react-native';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import {
  ThemeProvider,
  useTheme,
  ThemeContext,
} from './src/context/ThemeContext';
import {FavoritesProvider} from './src/context/FavoritesContext';

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
    <Stack.Navigator>
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
