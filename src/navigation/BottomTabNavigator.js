import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, View, StyleSheet} from 'react-native';
import MainScreen from '../Screens/MainScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import {useTheme} from '../context/ThemeContext';

// Şimdilik boş ekranlar oluşturalım
const FavoritesScreen = () => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.screenContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Text style={[styles.screenText, {color: theme.textColor}]}>
        Favoriler Ekranı
      </Text>
    </View>
  );
};

const SellScreen = () => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.screenContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Text style={[styles.screenText, {color: theme.textColor}]}>
        Satış Ekranı
      </Text>
    </View>
  );
};

const MessagesScreen = () => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.screenContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Text style={[styles.screenText, {color: theme.textColor}]}>
        Mesajlar Ekranı
      </Text>
    </View>
  );
};

// Ana ekran için stack navigator oluşturuyoruz
const MainStack = createNativeStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="MainHome"
      component={MainScreen}
      options={{headerShown: false}}
    />
    <MainStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{headerShown: false}}
    />
  </MainStack.Navigator>
);

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const {theme} = useTheme();

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
        name="Sat"
        component={SellScreen}
        options={{
          tabBarLabel: 'Sat',
          tabBarIcon: ({color}) => (
            <Text style={[styles.tabIcon, {color}]}>➕</Text>
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
