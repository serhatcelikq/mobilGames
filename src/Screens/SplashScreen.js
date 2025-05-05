import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {auth} from '../../../AutoConnect/firebase';
import {useTheme} from '../context/ThemeContext';

const SplashScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = () => {
      // Kullanıcı durumunu kontrol etmeden önce kısa bir gecikme ekleyelim
      // Bu, Firebase'in yüklenip kullanıcı durumunu kontrol etmesine zaman tanır
      setTimeout(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            // Kullanıcı zaten giriş yapmış, ana sayfaya yönlendir
            console.log('Kullanıcı zaten giriş yapmış:', user.email);
            navigation.replace('MainTabs');
          } else {
            // Kullanıcı giriş yapmamış, giriş sayfasına yönlendir
            console.log('Kullanıcı giriş yapmamış');
            navigation.replace('LoginScreen');
          }
          setLoading(false);
        });

        return unsubscribe;
      }, 2000); // 2 saniye geçikme
    };

    checkAuthState();
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {/* <Image
        source={require('../../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      /> */}
      <Text style={[styles.appLogo, {color: theme.accentColor}]}>🚘</Text>
      <Text style={[styles.title, {color: theme.textColor}]}>AutoConnect</Text>
      <Text style={[styles.subtitle, {color: theme.secondaryTextColor}]}>
        Premium İkinci El Araba Pazarı
      </Text>
      <ActivityIndicator
        style={styles.loader}
        size="large"
        color={theme.accentColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
