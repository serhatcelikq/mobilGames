import {getDatabase, ref, set, push} from 'firebase/database';
import {initializeApp} from 'firebase/app';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAjG2vuMDwxFB7gNHnId0e2HZo6bL1Ar2s',
  authDomain: 'webandmobilproject.firebaseapp.com',
  projectId: 'webandmobilproject',
  storageBucket: 'webandmobilproject.appspot.com',
  messagingSenderId: '958510699765',
  appId: '1:958510699765:android:3ca76a3564d7a305fae1bc',
  databaseURL: 'https://webandmobilproject-default-rtdb.firebaseio.com',
};

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

// Add a car directly to the database
const addCarDirectly = async carData => {
  try {
    // Generate a new car reference with auto-id
    const carsRef = ref(database, 'cars');
    const newCarRef = push(carsRef);

    // Add timestamp and ID to the car data
    const timestamp = new Date().toISOString();
    const enhancedCarData = {
      ...carData,
      id: newCarRef.key,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Set the data
    await set(newCarRef, enhancedCarData);
    console.log('Araç başarıyla eklendi, ID:', newCarRef.key);
    return newCarRef.key;
  } catch (error) {
    console.error('Araç eklenirken hata oluştu:', error);
    throw error;
  }
};

// Örnek araç verileri
export const sampleCars = [
  {
    make: 'Peugeot',
    model: '1.2 Puretech Allure',
    series: '308',
    year: 2024,
    price: 1515000,
    mileage: 6150,
    fuelType: 'Benzin',
    transmission: 'Otomatik',
    condition: 'İkinci El',
    bodyType: 'Hatchback 5 kapı',
    enginePower: 130,
    engineCapacity: 1199,
    drivetrain: 'Önden Çekiş',
    color: 'Mavi',
    imageUrl:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
    description:
      'Araç showroom kondisyonunda olup, orijinal değişensiz ve boyasızdır. Aracımız 2024 model olup sadece 6.150 kilometrededir ve fabrika garantisi devam etmektedir. İçi dışı tertemiz, anahtar teslim hazır durumdadır.',
    location: 'İstanbul / Kadıköy / Bostancı',
    sellerId: '1',
    sellerName: 'AutoConnect Premium Galeri',
    sellerType: 'Galeriden',
    hasDamageRecord: false,
    hasWarranty: true,
    features: [
      'Panoramik tavan',
      'LED farlar',
      'Dokunmatik ekran',
      'Navigasyon',
      'Apple CarPlay/Android Auto',
      'Otomatik park',
      'Geri görüş kamerası',
      'Çarpışma önleme sistemi',
    ],
  },
  {
    make: 'Toyota',
    model: 'Corolla',
    series: '1.6 Vision',
    year: 2023,
    price: 1250000,
    mileage: 12500,
    fuelType: 'Benzin',
    transmission: 'CVT',
    condition: 'İkinci El',
    bodyType: 'Sedan',
    enginePower: 132,
    engineCapacity: 1598,
    drivetrain: 'Önden Çekiş',
    color: 'Beyaz',
    imageUrl:
      'https://images.unsplash.com/photo-1473676899407-6044aeceb001?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
    description:
      'Toyota garantisi devam eden, bakımları düzenli yapılmış temiz araç. Arka kaporta ve sağ arka kapı lokal boyalıdır. Başka bir işlem yoktur. Araç ilk sahibinden satılıktır.',
    location: 'Ankara / Çankaya / Bahçelievler',
    sellerId: '2',
    sellerName: 'Ahmet Yılmaz',
    sellerType: 'Sahibinden',
    hasDamageRecord: false,
    hasWarranty: true,
    features: [
      'Geri görüş kamerası',
      'Adaptif hız kontrolü',
      'Şerit takip asistanı',
      'Dokunmatik ekran',
      'Apple CarPlay/Android Auto',
      'LED farlar',
      'Otomatik klima',
    ],
  },
  {
    make: 'BMW',
    model: '320i',
    series: '3 Serisi',
    year: 2022,
    price: 2350000,
    mileage: 23000,
    fuelType: 'Benzin',
    transmission: 'Otomatik',
    condition: 'İkinci El',
    bodyType: 'Sedan',
    enginePower: 170,
    engineCapacity: 1998,
    drivetrain: 'Arkadan İtiş',
    color: 'Siyah',
    imageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
    description:
      'BMW Premium Plus paket, M Sport gövde kiti, 19 inç jantlar, panoramik cam tavan, elektrikli bagaj, keyless go, harman kardon ses sistemi, hafızalı elektrikli koltuklar ve daha fazlası. Araç sorunsuz ve bakımlıdır.',
    location: 'İzmir / Karşıyaka',
    sellerId: '3',
    sellerName: 'Boğaziçi Otomotiv',
    sellerType: 'Galeriden',
    hasDamageRecord: false,
    hasWarranty: true,
    features: [
      'M Sport Paket',
      'Panoramik tavan',
      'Harman Kardon ses sistemi',
      'Elektrikli bagaj',
      'Hafızalı koltuklar',
      'Head-up display',
      'LED farlar',
      'Deri döşeme',
    ],
  },
];

// Örnek araçları Firebase'e eklemek için yardımcı fonksiyon
export const addSampleCarsToFirebase = async () => {
  try {
    const promises = sampleCars.map(car => addCarDirectly(car));
    const results = await Promise.all(promises);
    console.log("Örnek araçlar başarıyla eklendi, ID'ler:", results);
    return results;
  } catch (error) {
    console.error('Örnek araçlar eklenirken hata oluştu:', error);
    throw error;
  }
};

// Tek bir örnek araç eklemek için yardımcı fonksiyon
export const addSampleCarToFirebase = async (index = 0) => {
  try {
    if (index >= sampleCars.length) {
      throw new Error('Geçersiz araç indeksi');
    }

    const car = sampleCars[index];
    const carId = await addCarDirectly(car);
    console.log('Örnek araç başarıyla eklendi, ID:', carId);
    return carId;
  } catch (error) {
    console.error('Örnek araç eklenirken hata oluştu:', error);
    throw error;
  }
};
