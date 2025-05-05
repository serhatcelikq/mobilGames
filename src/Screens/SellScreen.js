import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../context/ThemeContext';

// Araç markaları
const carBrands = [
  'Acura',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Chevrolet',
  'Dodge',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Jaguar',
  'Jeep',
  'Kia',
  'Land Rover',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Nissan',
  'Opel',
  'Peugeot',
  'Porsche',
  'Renault',
  'Subaru',
  'Suzuki',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

// Yakıt tipleri
const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit'];

// Vites tipleri
const transmissionTypes = ['Manuel', 'Otomatik', 'Yarı Otomatik'];

// Renk seçenekleri
const colors = [
  'Siyah',
  'Beyaz',
  'Gri',
  'Kırmızı',
  'Mavi',
  'Yeşil',
  'Sarı',
  'Kahverengi',
  'Turuncu',
  'Mor',
  'Pembe',
  'Lacivert',
  'Gümüş',
  'Altın',
  'Bordo',
];

export default function SellScreen() {
  const {theme} = useTheme();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    kilometer: '',
    fuelType: '',
    transmission: '',
    color: '',
    price: '',
    description: '',
    features: {
      abs: false,
      esp: false,
      airbag: false,
      sunroof: false,
      leather: false,
      navigation: false,
      parking: false,
      camera: false,
      bluetooth: false,
      cruise: false,
    },
  });

  // Form verilerini güncelle
  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Özellikleri güncelle
  const toggleFeature = feature => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  // Resim ekleme
  const handleAddImage = () => {
    // Burada resim seçme işlemi yapılacak
    Alert.alert('Bilgi', 'Resim ekleme özelliği yakında eklenecek');
  };

  // Form gönderme
  const handleSubmit = () => {
    // Form validasyonu
    if (
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.price
    ) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
      return;
    }

    // Burada form verilerini Firebase'e gönderme işlemi yapılacak
    Alert.alert('Başarılı', 'İlanınız başarıyla oluşturuldu');
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}
      showsVerticalScrollIndicator={false}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <Text style={[styles.headerTitle, {color: theme.textColor}]}>
          Aracını Sat
        </Text>
      </View>

      {/* Resim Yükleme Alanı */}
      <View style={[styles.imageSection, {backgroundColor: theme.cardColor}]}>
        <TouchableOpacity
          style={[styles.addImageButton, {borderColor: theme.borderColor}]}
          onPress={handleAddImage}>
          <Text style={[styles.addImageIcon, {color: theme.accentColor}]}>
            📷
          </Text>
          <Text style={[styles.addImageText, {color: theme.textColor}]}>
            Fotoğraf Ekle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Temel Bilgiler */}
      <View style={[styles.section, {backgroundColor: theme.cardColor}]}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Temel Bilgiler
        </Text>

        {/* Marka */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>Marka</Text>
          <View
            style={[styles.selectContainer, {borderColor: theme.borderColor}]}>
            <Text style={[styles.selectText, {color: theme.textColor}]}>
              {formData.brand || 'Marka Seçin'}
            </Text>
            <Text style={styles.dropdownIcon}>🔽</Text>
          </View>
        </View>

        {/* Model */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>Model</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
              },
            ]}
            placeholder="Model"
            placeholderTextColor={theme.secondaryTextColor}
            value={formData.model}
            onChangeText={value => updateFormData('model', value)}
          />
        </View>

        {/* Yıl */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>Yıl</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
              },
            ]}
            placeholder="Yıl"
            placeholderTextColor={theme.secondaryTextColor}
            value={formData.year}
            onChangeText={value => updateFormData('year', value)}
            keyboardType="numeric"
          />
        </View>

        {/* Kilometre */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>
            Kilometre
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
              },
            ]}
            placeholder="Kilometre"
            placeholderTextColor={theme.secondaryTextColor}
            value={formData.kilometer}
            onChangeText={value => updateFormData('kilometer', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Teknik Özellikler */}
      <View style={[styles.section, {backgroundColor: theme.cardColor}]}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Teknik Özellikler
        </Text>

        {/* Yakıt Tipi */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>
            Yakıt Tipi
          </Text>
          <View
            style={[styles.selectContainer, {borderColor: theme.borderColor}]}>
            <Text style={[styles.selectText, {color: theme.textColor}]}>
              {formData.fuelType || 'Yakıt Tipi Seçin'}
            </Text>
            <Text style={styles.dropdownIcon}>🔽</Text>
          </View>
        </View>

        {/* Vites */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>Vites</Text>
          <View
            style={[styles.selectContainer, {borderColor: theme.borderColor}]}>
            <Text style={[styles.selectText, {color: theme.textColor}]}>
              {formData.transmission || 'Vites Tipi Seçin'}
            </Text>
            <Text style={styles.dropdownIcon}>🔽</Text>
          </View>
        </View>

        {/* Renk */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: theme.textColor}]}>Renk</Text>
          <View
            style={[styles.selectContainer, {borderColor: theme.borderColor}]}>
            <Text style={[styles.selectText, {color: theme.textColor}]}>
              {formData.color || 'Renk Seçin'}
            </Text>
            <Text style={styles.dropdownIcon}>🔽</Text>
          </View>
        </View>
      </View>

      {/* Fiyat */}
      <View style={[styles.section, {backgroundColor: theme.cardColor}]}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Fiyat
        </Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
              },
            ]}
            placeholder="Fiyat (TL)"
            placeholderTextColor={theme.secondaryTextColor}
            value={formData.price}
            onChangeText={value => updateFormData('price', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Özellikler */}
      <View style={[styles.section, {backgroundColor: theme.cardColor}]}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Özellikler
        </Text>
        <View style={styles.featuresGrid}>
          {Object.entries(formData.features).map(([feature, value]) => (
            <TouchableOpacity
              key={feature}
              style={[
                styles.featureItem,
                {
                  backgroundColor: value
                    ? theme.accentColor
                    : theme.backgroundColor,
                  borderColor: theme.borderColor,
                },
              ]}
              onPress={() => toggleFeature(feature)}>
              <Text style={{fontSize: 18, marginRight: 8}}>
                {getFeatureEmoji(feature)}
              </Text>
              <Text
                style={[
                  styles.featureText,
                  {color: value ? 'white' : theme.textColor},
                ]}>
                {getFeatureLabel(feature)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Açıklama */}
      <View style={[styles.section, {backgroundColor: theme.cardColor}]}>
        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Açıklama
        </Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
              },
            ]}
            placeholder="Aracınız hakkında detaylı bilgi verin..."
            placeholderTextColor={theme.secondaryTextColor}
            value={formData.description}
            onChangeText={value => updateFormData('description', value)}
            multiline
            numberOfLines={6}
          />
        </View>
      </View>

      {/* Gönder Butonu */}
      <TouchableOpacity
        style={[styles.submitButton, {backgroundColor: theme.accentColor}]}
        onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>İlanı Yayınla</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Özellik ikonlarını getir
const getFeatureEmoji = feature => {
  const icons = {
    abs: '🛑',
    esp: '⚠️',
    airbag: '💨',
    sunroof: '⛅',
    leather: '🪑',
    navigation: '🧭',
    parking: '🅿️',
    camera: '📷',
    bluetooth: '📱',
    cruise: '⚙️',
  };
  return icons[feature] || '🚗';
};

// Özellik etiketlerini getir
const getFeatureLabel = feature => {
  const labels = {
    abs: 'ABS',
    esp: 'ESP',
    airbag: 'Airbag',
    sunroof: 'Sunroof',
    leather: 'Deri Döşeme',
    navigation: 'Navigasyon',
    parking: 'Park Sensörü',
    camera: 'Geri Görüş Kamerası',
    bluetooth: 'Bluetooth',
    cruise: 'Hız Sabitleyici',
  };
  return labels[feature] || feature;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  selectContainer: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectText: {
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  submitButton: {
    margin: 16,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  addImageButton: {
    width: '100%',
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 8,
    fontSize: 16,
  },
  dropdownIcon: {
    fontSize: 16,
  },
  addImageIcon: {
    fontSize: 32,
  },
});
