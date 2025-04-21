import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, View, StyleSheet} from 'react-native';
import MainScreen from '../Screens/MainScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import FavoritesScreen from '../Screens/FavoritesScreen';
import CarDetailsScreen from '../Screens/CarDetailsScreen';
import MessagesScreen from '../Screens/MessagesScreen';
import SellScreen from '../Screens/SellScreen';
import TestScreen from '../Screens/TestScreen';
import {useTheme} from '../context/ThemeContext';

// Ana ekran için stack navigator oluşturuyoruz
const MainStack = createNativeStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="CarDetails" component={CarDetailsScreen} />
      <MainStack.Screen name="Messages" component={MessagesScreen} />
      <MainStack.Screen name="Test" component={TestScreen} />
    </MainStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const {theme} = useTheme();

  // Toplam okunmamış mesaj sayısını hesapla
  const getUnreadCount = () => {
    // Gerçek uygulamada bu değer context'ten veya backend'den gelebilir
    return 3;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.tabBarActiveColor,
        tabBarInactiveTintColor: theme.tabBarInactiveColor,
        tabBarStyle: {
          paddingVertical: 5,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor,
          backgroundColor: theme.tabBarBackground,
          height: 60,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="AnaSayfa"
        component={MainStackScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({color}) => (
            <Text style={[styles.tabIcon, {color}]}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Sat"
        component={SellScreen}
        options={{
          tabBarLabel: 'Sat',
          tabBarIcon: ({color}) => (
            <Text style={[styles.tabIcon, {color}]}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favoriler"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoriler',
          tabBarIcon: ({color}) => (
            <Text style={[styles.tabIcon, {color}]}>❤️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mesajlar"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Mesajlar',
          tabBarIcon: ({color}) => (
            <Text style={[styles.tabIcon, {color}]}>💬</Text>
          ),
          tabBarBadge: getUnreadCount() > 0 ? getUnreadCount() : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
