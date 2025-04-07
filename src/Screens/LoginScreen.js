import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {GoogleAuthProvider, signInWithCredential} from 'firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {ref, set, get} from 'firebase/database';
import {auth, database} from '../../../AutoConnect/firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();

  // Kullanıcı bilgilerini kaydet
  const saveUserToDatabase = user => {
    console.log('Kullanıcı bilgileri veritabanına kaydediliyor...');

    try {
      // Kullanıcı referansını al
      const userRef = ref(database, 'users/' + user.uid);

      // Kullanıcının daha önce kaydolup olmadığını kontrol et
      get(userRef)
        .then(snapshot => {
          // Mevcut veriler (kullanıcı varsa)
          const existingData = snapshot.exists() ? snapshot.val() : {};
          const currentTime = new Date().toISOString();

          // Kaydedilecek kullanıcı verisi
          const userData = {
            // Temel kullanıcı bilgileri
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            lastLogin: currentTime,

            // İlk kayıt tarihi (sadece ilk kez kaydolurken set edilecek)
            createdAt: snapshot.exists()
              ? existingData.createdAt || currentTime
              : currentTime,

            // Kullanıcı profil bilgileri (değişmediyse mevcut değerleri koru)
            profile: {
              phone: existingData.profile?.phone || '',
              location: existingData.profile?.location || '',
              bio: existingData.profile?.bio || '',
            },

            // Kullanıcı tercihleri
            preferences: {
              notifications:
                existingData.preferences?.notifications !== undefined
                  ? existingData.preferences.notifications
                  : true,
              darkMode:
                existingData.preferences?.darkMode !== undefined
                  ? existingData.preferences.darkMode
                  : false,
              language: existingData.preferences?.language || 'tr',
            },

            // Kullanıcı aktivite verileri
            activity: {
              totalLogins: (existingData.activity?.totalLogins || 0) + 1,
              favoriteCount: existingData.activity?.favoriteCount || 0,
              lastActive: currentTime,
            },

            // Kullanıcı istatistikleri
            stats: {
              listedCars: existingData.stats?.listedCars || 0,
              soldCars: existingData.stats?.soldCars || 0,
              viewedCars: existingData.stats?.viewedCars || 0,
              rating: existingData.stats?.rating || 0,
              reviewCount: existingData.stats?.reviewCount || 0,
            },
          };

          console.log('Kaydedilecek veri:', JSON.stringify(userData));

          // Veritabanına yaz
          return set(userRef, userData);
        })
        .then(() => {
          console.log('Kullanıcı bilgileri başarıyla kaydedildi.');
        })
        .catch(error => {
          console.error(
            'Kullanıcı bilgileri kaydedilirken hata oluştu:',
            error,
          );
        });
    } catch (error) {
      console.error('Veritabanı işleminde hata:', error);
    }
  };

  React.useEffect(() => {
    console.log('GoogleSignin yapılandırması başlatılıyor...');
    try {
      GoogleSignin.configure({
        webClientId:
          '958510699765-0peh74qe9lu6d8282nam71gbrv1mq3gk.apps.googleusercontent.com',
        offlineAccess: true,
      });
      console.log('GoogleSignin başarıyla yapılandırıldı');
    } catch (error) {
      console.error('GoogleSignin yapılandırma hatası:', error);
    }
  }, []);

  const handleGoogleLogin = async () => {
    console.log('Google ile giriş başlatılıyor...');
    try {
      // Önce mevcut oturumu sonlandır
      await GoogleSignin.signOut();
      console.log('Önceki oturum sonlandırıldı');

      console.log('Google Play Services kontrol ediliyor...');
      await GoogleSignin.hasPlayServices();
      console.log('Google Play Services mevcut');

      console.log('Google hesap seçimi başlatılıyor...');
      const userInfo = await GoogleSignin.signIn();
      console.log(
        'Google hesap seçimi başarılı, tüm veri:',
        JSON.stringify(userInfo),
      );

      // idToken'ı veri yapısından alma
      let idToken = null;

      if (userInfo.idToken) {
        idToken = userInfo.idToken;
        console.log('userInfo.idToken içinden idToken alındı');
      } else if (userInfo.data && userInfo.data.idToken) {
        idToken = userInfo.data.idToken;
        console.log('userInfo.data.idToken içinden idToken alındı');
      } else {
        console.log('Veri yapısı:', userInfo);
        throw new Error('Google Sign-In idToken bulunamadı');
      }

      console.log('ID Token alındı:', idToken);

      console.log('Firebase credential oluşturuluyor...');
      const credential = GoogleAuthProvider.credential(idToken);
      console.log('Firebase credential oluşturuldu');

      console.log('Firebase ile giriş yapılıyor...');
      const result = await signInWithCredential(auth, credential);
      console.log('Firebase girişi başarılı');

      // Kullanıcı bilgilerini veritabanına kaydet
      saveUserToDatabase(result.user);

      console.log('MainTabs ekranına yönlendiriliyor...');
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Google giriş hatası:', error);
      console.error('Hata tipi:', typeof error);
      console.error('Hata detayı:', {
        code: error.code,
        message: error.message,
      });

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('İptal', 'Giriş işlemi iptal edildi');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Bekleyin', 'Giriş işlemi devam ediyor');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Hata', 'Google Play Services mevcut değil');
      } else if (error.code === 'auth/argument-error') {
        Alert.alert(
          'Hata',
          'Firebase kimlik doğrulama hatası. IdToken geçersiz veya eksik.',
        );
      } else {
        Alert.alert(
          'Hata',
          'Google ile giriş yapılırken bir hata oluştu: ' + error.message,
        );
      }
    }
  };

  const handleEmailLogin = () => {
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

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}>
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={[styles.buttonText, {color: theme.textColor}]}>
                Google ile Devam Et
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emailButton, {backgroundColor: theme.accentColor}]}
              onPress={handleEmailLogin}>
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
