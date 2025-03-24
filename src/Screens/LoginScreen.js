import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();

  const handleLogin = () => {
    // Navigate to MainTabs instead of MainScreen
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
        }}
        style={styles.backgroundImage}
        blurRadius={3}>
        <View style={styles.overlay} />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>AutoConnect</Text>
          <Text style={styles.headerSubtitle}>
            Premium İkinci El Araba Pazarı
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardColor,
                shadowColor: theme.shadowColor,
              },
            ]}>
            <Text style={[styles.welcomeText, {color: theme.textColor}]}>
              Tekrar Hoşgeldiniz
            </Text>
            <Text
              style={[styles.subtitleText, {color: theme.secondaryTextColor}]}>
              AutoConnect'e giriş yapın
            </Text>

            <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={[styles.buttonText, {color: theme.textColor}]}>
                Google ile Devam Et
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emailButton, {backgroundColor: theme.accentColor}]}
              onPress={handleLogin}>
              <Text style={styles.emailButtonText}>E-posta ile Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text
                style={[styles.signupText, {color: theme.secondaryTextColor}]}>
                Hesabınız yok mu?
              </Text>
              <TouchableOpacity>
                <Text style={[styles.signupLink, {color: theme.accentColor}]}>
                  Kaydol
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔎</Text>
            <Text style={styles.featureText}>Onaylı ikinci el arabalar</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>En iyi piyasa fiyatları</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Güvenli işlemler</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#4285F4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emailButton: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  emailButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  featureItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
