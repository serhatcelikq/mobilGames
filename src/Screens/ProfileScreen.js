import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  Animated,
  Dimensions,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {auth, database} from '../../../AutoConnect/firebase';
import {ref, get, onValue} from 'firebase/database';
import {signOut} from 'firebase/auth';

const {width} = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {theme, isDarkMode, toggleTheme} = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Ekran açıldığında animasyon
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Kullanıcı verilerini Firebase'den çek
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    setLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = ref(database, 'users/' + currentUser.uid);

      // Bir kerelik veri çekme
      get(userRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log('Kullanıcı verisi bulunamadı!');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Veri çekme hatası:', error);
          setLoading(false);
        });

      // Gerçek zamanlı güncelleme dinleyicisi
      const unsubscribe = onValue(userRef, snapshot => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      });

      // Temizleme fonksiyonu
      return () => unsubscribe();
    } else {
      setLoading(false);
      console.log('Oturum açmış kullanıcı yok!');
    }
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{translateY: slideAnim}],
  };

  // Kullanıcı işlevleri
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Ayarlar listesi
  const settingsItems = [
    {
      id: '1',
      icon: '👤',
      title: 'Profil Bilgileri',
      iconBg: '#4CAF5020',
      action: () => {},
    },
    {
      id: '2',
      icon: '🔔',
      title: 'Bildirimler',
      iconBg: '#FF980020',
      action: () => {},
    },
    {
      id: '3',
      icon: '🔒',
      title: 'Güvenlik',
      iconBg: '#2196F320',
      action: () => {},
    },
    {
      id: '4',
      icon: '💳',
      title: 'Ödeme Yöntemleri',
      iconBg: '#9C27B020',
      action: () => {},
    },
    {
      id: '5',
      icon: '🚪',
      title: 'Çıkış Yap',
      iconBg: '#F4433620',
      isLogout: true,
      action: handleLogout,
    },
  ];

  const renderSettingItem = ({item, index}) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          borderBottomColor: theme.borderColor,
          borderBottomWidth: index === settingsItems.length - 1 ? 0 : 1,
        },
      ]}
      onPress={item.action}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, {backgroundColor: item.iconBg}]}>
          <Text style={styles.settingIconText}>{item.icon}</Text>
        </View>
        <Text
          style={[
            styles.settingText,
            item.isLogout
              ? {color: '#F44336', fontWeight: '600'}
              : {color: theme.textColor},
          ]}>
          {item.title}
        </Text>
      </View>
      <Text
        style={[
          styles.settingArrow,
          item.isLogout
            ? {color: '#F44336'}
            : {color: theme.secondaryTextColor},
        ]}>
        →
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.backgroundColor},
        ]}>
        <ActivityIndicator size="large" color={theme.accentColor} />
        <Text style={[styles.loadingText, {color: theme.textColor}]}>
          Yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <ImageBackground
        source={{
          uri: isDarkMode
            ? 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'
            : 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
        }}
        style={styles.headerBackground}
        blurRadius={5}>
        <View style={styles.headerOverlay} />
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {backgroundColor: `${theme.cardColor}80`},
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, {color: theme.textColor}]}>
              ←
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeToggleButton,
              {backgroundColor: `${theme.cardColor}80`},
            ]}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isDarkMode ? '#4CAF50' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Animated.View style={[styles.profileContainer, animatedStyle]}>
        <View style={[styles.profileCard, {backgroundColor: theme.cardColor}]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  userData?.photoURL ||
                  'https://randomuser.me/api/portraits/men/72.jpg',
              }}
              style={styles.profileImage}
            />
            <View
              style={[styles.statusIndicator, {backgroundColor: '#4CAF50'}]}
            />
          </View>
          <Text style={[styles.userName, {color: theme.textColor}]}>
            {userData?.displayName || 'İsimsiz Kullanıcı'}
          </Text>
          <Text style={[styles.userEmail, {color: theme.secondaryTextColor}]}>
            {userData?.email || 'E-posta bulunamadı'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: theme.textColor}]}>
                {userData?.stats?.listedCars || 0}
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.secondaryTextColor}]}>
                İlanlar
              </Text>
            </View>
            <View
              style={[styles.statDivider, {backgroundColor: theme.borderColor}]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: theme.textColor}]}>
                {userData?.activity?.favoriteCount || 0}
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.secondaryTextColor}]}>
                Favoriler
              </Text>
            </View>
            <View
              style={[styles.statDivider, {backgroundColor: theme.borderColor}]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: theme.textColor}]}>
                {userData?.stats?.soldCars || 0}
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.secondaryTextColor}]}>
                Satışlar
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.contentContainer}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Ayarlar
        </Text>
        <View style={[styles.settingsCard, {backgroundColor: theme.cardColor}]}>
          <FlatList
            data={settingsItems}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.sectionTitle,
              {color: theme.textColor, marginTop: 20},
            ]}>
            Kullanıcı Bilgileri
          </Text>
          <View style={[styles.infoCard, {backgroundColor: theme.cardColor}]}>
            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Telefon
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.profile?.phone || 'Telefon bulunamadı'}
              </Text>
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Konum
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.profile?.location || 'Konum bulunamadı'}
              </Text>
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Üyelik Tarihi
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString('tr-TR')
                  : 'Bilinmiyor'}
              </Text>
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Son Giriş
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.lastLogin
                  ? new Date(userData.lastLogin).toLocaleDateString('tr-TR')
                  : 'Bilinmiyor'}
              </Text>
            </View>
            {userData?.profile?.bio && (
              <>
                <View
                  style={[
                    styles.infoDivider,
                    {backgroundColor: theme.borderColor},
                  ]}
                />
                <View style={styles.infoItem}>
                  <Text
                    style={[
                      styles.infoLabel,
                      {color: theme.secondaryTextColor},
                    ]}>
                    Hakkımda
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {color: theme.textColor, flex: 1, textAlign: 'right'},
                    ]}>
                    {userData.profile.bio}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.sectionTitle,
              {color: theme.textColor, marginTop: 20},
            ]}>
            Tercihler
          </Text>
          <View style={[styles.infoCard, {backgroundColor: theme.cardColor}]}>
            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Bildirimler
              </Text>
              <Switch
                trackColor={{false: '#767577', true: theme.accentColor}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={userData?.preferences?.notifications}
                disabled={true}
              />
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Karanlık Mod
              </Text>
              <Switch
                trackColor={{false: '#767577', true: theme.accentColor}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={userData?.preferences?.darkMode}
                disabled={true}
              />
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Dil
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.preferences?.language === 'tr'
                  ? 'Türkçe'
                  : userData?.preferences?.language === 'en'
                  ? 'İngilizce'
                  : userData?.preferences?.language || 'Belirtilmemiş'}
              </Text>
            </View>
            <View
              style={[styles.infoDivider, {backgroundColor: theme.borderColor}]}
            />

            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, {color: theme.secondaryTextColor}]}>
                Toplam Giriş Sayısı
              </Text>
              <Text style={[styles.infoValue, {color: theme.textColor}]}>
                {userData?.activity?.totalLogins || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, {color: theme.secondaryTextColor}]}>
            AutoConnect v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    height: 180,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  themeToggleButton: {
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  profileContainer: {
    marginTop: -50,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    marginTop: -50,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 5,
    right: 0,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingsCard: {
    borderRadius: 12,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingIconText: {
    fontSize: 18,
  },
  settingText: {
    fontSize: 16,
  },
  settingArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    marginTop: 20,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
  },
  infoDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
