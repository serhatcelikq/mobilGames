import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  addSampleCarToFirebase,
  addSampleCarsToFirebase,
  sampleCars,
} from '../utils/CarUtils';
import {ref, get} from 'firebase/database';
import {database} from '../../firebase';

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

// Get all cars
const getAllCars = async () => {
  try {
    const carsRef = ref(database, 'cars');
    const snapshot = await get(carsRef);

    if (snapshot.exists()) {
      const carsData = snapshot.val();
      return Object.keys(carsData).map(key => ({
        ...carsData[key],
        id: key,
      }));
    } else {
      console.log('Hiç araç bulunamadı');
      return [];
    }
  } catch (error) {
    console.error('Araçlar alınırken hata oluştu:', error);
    throw error;
  }
};

const TestScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cars, setCars] = useState([]);

  const handleAddSampleCar = async index => {
    setLoading(true);
    setResult(null);
    try {
      const carId = await addSampleCarToFirebase(index);
      setResult({
        type: 'success',
        message: `Araç başarıyla eklendi! ID: ${carId}`,
      });
      Alert.alert('Başarılı', `Araç başarıyla eklendi!\nID: ${carId}`, [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('CarDetails', {carId}),
        },
      ]);
    } catch (error) {
      setResult({type: 'error', message: `Hata: ${error.message}`});
      Alert.alert('Hata', `Araç eklenirken hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllCars = async () => {
    setLoading(true);
    setResult(null);
    try {
      const carIds = await addSampleCarsToFirebase();
      setResult({
        type: 'success',
        message: `${carIds.length} araç başarıyla eklendi!`,
      });
      Alert.alert('Başarılı', `${carIds.length} araç başarıyla eklendi!`);
    } catch (error) {
      setResult({type: 'error', message: `Hata: ${error.message}`});
      Alert.alert('Hata', `Araçlar eklenirken hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllCars = async () => {
    setLoading(true);
    setCars([]);
    try {
      const allCars = await getAllCars();
      setCars(allCars);
      setResult({
        type: 'success',
        message: `${allCars.length} araç başarıyla yüklendi!`,
      });
    } catch (error) {
      setResult({type: 'error', message: `Hata: ${error.message}`});
      Alert.alert('Hata', `Araçlar yüklenirken hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewCarDetails = carId => {
    navigation.navigate('CarDetails', {carId});
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Firebase Araç Test Ekranı</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Örnek Araç Ekle</Text>
        <View style={styles.buttonRow}>
          {sampleCars.map((car, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleAddSampleCar(index)}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {car.make} {car.model}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toplu İşlemler</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.wideButton]}
            onPress={handleAddAllCars}
            disabled={loading}>
            <Text style={styles.buttonText}>Tüm Örnek Araçları Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.wideButton]}
            onPress={handleGetAllCars}
            disabled={loading}>
            <Text style={styles.buttonText}>Tüm Araçları Getir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>İşlem yapılıyor...</Text>
        </View>
      )}

      {result && (
        <View
          style={[
            styles.resultContainer,
            result.type === 'error' ? styles.errorResult : styles.successResult,
          ]}>
          <Text style={styles.resultText}>{result.message}</Text>
        </View>
      )}

      {cars.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Araç Listesi ({cars.length})</Text>
          {cars.map((car, index) => (
            <TouchableOpacity
              key={car.id}
              style={styles.carItem}
              onPress={() => viewCarDetails(car.id)}>
              <Text style={styles.carTitle}>
                {car.make} {car.model} {car.series}
              </Text>
              <Text style={styles.carSubtitle}>
                {car.year} • {car.price.toLocaleString()} TL • {car.location}
              </Text>
              <Text style={styles.carId}>ID: {car.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  wideButton: {
    width: '100%',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 6,
    marginBottom: 16,
  },
  successResult: {
    backgroundColor: '#e6f7ee',
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  errorResult: {
    backgroundColor: '#ffeeee',
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  carItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  carSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  carId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default TestScreen;
