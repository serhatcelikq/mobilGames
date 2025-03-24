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
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

const {width} = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {theme, isDarkMode, toggleTheme} = useTheme();

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
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{translateY: slideAnim}],
  };

  // Kullanıcı işlevleri
  const handleLogout = () => {
    // Çıkış yapma işlevi
    navigation.navigate('LoginScreen');
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
                uri: 'https://randomuser.me/api/portraits/men/72.jpg',
              }}
              style={styles.profileImage}
            />
            <View
              style={[styles.statusIndicator, {backgroundColor: '#4CAF50'}]}
            />
          </View>
          <Text style={[styles.userName, {color: theme.textColor}]}>
            Ahmet Yılmaz
          </Text>
          <Text style={[styles.userEmail, {color: theme.secondaryTextColor}]}>
            ahmet.yilmaz@example.com
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: theme.textColor}]}>
                12
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
                24
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
                8
              </Text>
              <Text
                style={[styles.statLabel, {color: theme.secondaryTextColor}]}>
                Teklifler
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
    height: 150,
    width: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggleButton: {
    borderRadius: 20,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
  },
  profileContainer: {
    position: 'relative',
    zIndex: 1,
    marginTop: -60,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    bottom: 5,
    right: 0,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIconText: {
    fontSize: 16,
  },
  settingText: {
    fontSize: 16,
  },
  settingArrow: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
  },
});
