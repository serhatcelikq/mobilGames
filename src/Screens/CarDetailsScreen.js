import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {useFavorites} from '../context/FavoritesContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDatabase, ref, get} from 'firebase/database';
import {initializeApp} from 'firebase/app';

// Firebase config


// Initialize Firebase if not already initialized
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // App already initialized
  console.log('Firebase already initialized');
}

// Get database reference
const database = getDatabase(app);

// Get a car by ID
const getCarById = async carId => {
  try {
    const carRef = ref(database, `cars/${carId}`);
    const snapshot = await get(carRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('Bu ID ile araç bulunamadı:', carId);
      return null;
    }
  } catch (error) {
    console.error('Araç bilgisi alınırken hata oluştu:', error);
    throw error;
  }
};

export default function CarDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {favorites, toggleFavorite} = useFavorites();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID parametresini route'dan al
  const carId = route.params?.carId;

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const {carId} = route.params;

        if (!carId) {
          setError('Araç ID bilgisi bulunamadı');
          setLoading(false);
          return;
        }

        const carData = await getCarById(carId);

        if (!carData) {
          setError('Araç bulunamadı');
        } else {
          setCar(carData);
        }
      } catch (err) {
        console.error('Araç verileri yüklenirken hata oluştu:', err);
        setError('Araç verileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [route.params]);

  const handleContactPress = () => {
    // İletişime geç butonuna tıklandığında mesajlaşma sayfasına yönlendir
    navigation.navigate('Messages', {contactId: car.sellerId, car: car});
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentColor} />
          <Text style={[styles.loadingText, {color: theme.textColor}]}>
            Araç bilgileri yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !car) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.textColor}]}>
            {error || 'Araç bilgisi bulunamadı'}
          </Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.accentColor}]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.buttonText, {color: '#fff'}]}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, {color: theme.textColor}]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.textColor}]}>
          Araç Detayları
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(car)}>
          <Text style={styles.favoriteIcon}>
            {favorites.includes(car.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                car.imageUrl ||
                'https://via.placeholder.com/400x200?text=Araç+Resmi',
            }}
            style={styles.carImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.carTitle, {color: theme.textColor}]}>
              {car.year} {car.make} {car.model}
            </Text>
            <Text style={[styles.carPrice, {color: theme.accentColor}]}>
              {car.price
                ? `${Number(car.price).toLocaleString('tr-TR')} TL`
                : 'Fiyat belirtilmemiş'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.creditButton, {borderColor: theme.accentColor}]}>
            <Text style={[styles.creditButtonText, {color: theme.accentColor}]}>
              Kredi Teklifi Al
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.locationContainer,
              {borderColor: theme.borderColor},
            ]}>
            <Text
              style={[styles.locationText, {color: theme.secondaryTextColor}]}>
              {car.location || 'Konum belirtilmemiş'}
            </Text>
          </View>

          <View style={styles.specsContainer}>
            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                İlan No
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.id || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                İlan Tarihi
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.createdAt
                  ? new Date(car.createdAt).toLocaleDateString('tr-TR')
                  : ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Marka
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.make || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Seri
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.series || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Model
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.model || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Yıl
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.year || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Yakıt
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.fuelType || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Vites
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.transmission || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Araç Durumu
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.condition || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                KM
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.mileage ? Number(car.mileage).toLocaleString('tr-TR') : ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Kasa Tipi
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.bodyType || ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Motor Gücü
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.enginePower ? `${car.enginePower} hp` : ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Motor Hacmi
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.engineCapacity ? `${car.engineCapacity} cc` : ''}
              </Text>
            </View>

            <View style={[styles.specRow, {borderColor: theme.borderColor}]}>
              <Text
                style={[styles.specLabel, {color: theme.secondaryTextColor}]}>
                Çekiş
              </Text>
              <Text style={[styles.specValue, {color: theme.textColor}]}>
                {car.drivetrain || ''}
              </Text>
            </View>

            {car.description && (
              <View style={styles.descriptionContainer}>
                <Text
                  style={[styles.descriptionTitle, {color: theme.textColor}]}>
                  Açıklama
                </Text>
                <Text
                  style={[
                    styles.descriptionText,
                    {color: theme.secondaryTextColor},
                  ]}>
                  {car.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {backgroundColor: theme.cardColor}]}>
        <TouchableOpacity
          style={[styles.contactButton, {backgroundColor: theme.accentColor}]}
          onPress={handleContactPress}>
          <Text style={styles.contactButtonText}>İletişime Geç</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  titleRow: {
    marginBottom: 12,
  },
  carTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  creditButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  creditButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
  },
  specsContainer: {
    marginBottom: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  specLabel: {
    fontSize: 14,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actionContainer: {
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
  },
  contactButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
  },
});
