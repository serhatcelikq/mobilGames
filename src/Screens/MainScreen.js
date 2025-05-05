import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {useFavorites} from '../context/FavoritesContext';

// Sample data for car listings
const carListings = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2019,
    price: '225.000 TL',
    mileage: '45.000 km',
    image:
      'https://images.unsplash.com/photo-1626072778346-0ab6604d39c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    location: 'İstanbul',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2018,
    price: '245.000 TL',
    mileage: '60.000 km',
    image:
      'https://images.unsplash.com/photo-1605816988069-b11383b50717?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    location: 'Ankara',
  },
  {
    id: '3',
    make: 'Volkswagen',
    model: 'Passat',
    year: 2020,
    price: '375.000 TL',
    mileage: '30.000 km',
    image:
      'https://images.unsplash.com/photo-1632038229229-06c76eba7982?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    location: 'İzmir',
  },
  {
    id: '4',
    make: 'Mercedes',
    model: 'C-Class',
    year: 2017,
    price: '450.000 TL',
    mileage: '70.000 km',
    image:
      'https://images.unsplash.com/photo-1549399542-7e8ee6e432b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    location: 'Bursa',
  },
];

// Featured car listings
const featuredCars = [
  {
    id: '5',
    make: 'BMW',
    model: 'X5',
    year: 2021,
    price: '750.000 TL',
    image:
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '6',
    make: 'Audi',
    model: 'A6',
    year: 2020,
    price: '650.000 TL',
    image:
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
  },
];

// Categories
const categories = [
  {id: '1', name: 'Sedan', icon: '🚗'},
  {id: '2', name: 'SUV', icon: '🚙'},
  {id: '3', name: 'Hatchback', icon: '🏎️'},
  {id: '4', name: 'Lüks', icon: '✨'},
  {id: '5', name: 'Elektrikli', icon: '⚡'},
];

export default function MainScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {favorites, addFavorite, removeFavorite, isFavorite} = useFavorites();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCars, setFilteredCars] = useState(carListings);

  // Tüm araçları birleştir (normal listeler ve öne çıkanlar)
  const allCars = [...carListings, ...featuredCars];

  // Arama sonuçlarını filtreleme
  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchText.toLowerCase().trim();
    const filtered = allCars.filter(car => {
      return (
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.year.toString().includes(query) ||
        (car.location && car.location.toLowerCase().includes(query))
      );
    });

    setSearchResults(filtered);
  }, [searchText]);

  // Kategori seçildiğinde filtreleme
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredCars(carListings);
      return;
    }

    // Şimdilik basit bir filtreleme yapalım. Gerçek uygulamada araçların kategori bilgisi olmalı
    let filtered = [];
    switch (selectedCategory) {
      case 'Sedan':
        filtered = carListings.filter(car =>
          ['Corolla', 'Civic', 'C-Class'].includes(car.model),
        );
        break;
      case 'SUV':
        filtered = carListings.filter(car => car.model === 'X5');
        break;
      case 'Hatchback':
        filtered = carListings.filter(car => ['Civic'].includes(car.model));
        break;
      case 'Lüks':
        filtered = carListings.filter(car =>
          ['Mercedes', 'BMW', 'Audi'].includes(car.make),
        );
        break;
      case 'Elektrikli':
        // Örnek veri setinde elektrikli araç yok, gerçek uygulamada olacaktır
        filtered = [];
        break;
      default:
        filtered = carListings;
    }

    setFilteredCars(filtered);
  }, [selectedCategory]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleTestScreenPress = () => {
    navigation.navigate('Test');
  };

  // Favori ekleme/çıkarma işlevi
  const toggleFavorite = car => {
    if (isFavorite(car.id)) {
      removeFavorite(car.id);
    } else {
      addFavorite(car);
    }
  };

  // Kategori seçme işlevi
  const handleCategorySelect = categoryName => {
    if (selectedCategory === categoryName) {
      // Aynı kategoriye tekrar tıklandığında filtreyi kaldır
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const CarItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.carItem,
        {
          backgroundColor: theme.cardColor,
          shadowColor: theme.shadowColor,
        },
      ]}
      onPress={() => navigation.navigate('CarDetails', {carId: item.id})}>
      <Image
        source={{uri: item.image}}
        style={styles.carImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item)}>
        <Text style={styles.favoriteIcon}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
      <View style={styles.carDetails}>
        <Text style={[styles.carTitle, {color: theme.textColor}]}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={[styles.carPrice, {color: theme.accentColor}]}>
          {item.price}
        </Text>
        <View style={styles.carInfoRow}>
          <Text style={[styles.carInfo, {color: theme.secondaryTextColor}]}>
            {item.mileage}
          </Text>
          <Text style={[styles.carLocation, {color: theme.secondaryTextColor}]}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FeaturedCarItem = ({item}) => (
    <TouchableOpacity
      style={styles.featuredCarItem}
      onPress={() => navigation.navigate('CarDetails', {carId: item.id})}>
      <Image
        source={{uri: item.image}}
        style={styles.featuredCarImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.featuredFavoriteButton}
        onPress={() => toggleFavorite(item)}>
        <Text style={styles.favoriteIcon}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
      <View style={styles.featuredCarOverlay}>
        <Text style={styles.featuredCarTitle}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.featuredCarPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && {
          backgroundColor: theme.accentColor + '20', // %20 opacity
          borderRadius: 8,
        },
      ]}
      onPress={() => handleCategorySelect(item.name)}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryName,
          {
            color:
              selectedCategory === item.name
                ? theme.accentColor
                : theme.textColor,
          },
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Arama Sonuçları İçin Car Item
  const SearchResultItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.searchResultItem,
        {
          backgroundColor: theme.cardColor,
          shadowColor: theme.shadowColor,
        },
      ]}
      onPress={() => navigation.navigate('CarDetails', {car: item})}>
      <Image
        source={{uri: item.image}}
        style={styles.searchResultImage}
        resizeMode="cover"
      />
      <View style={styles.searchResultDetails}>
        <Text style={[styles.searchResultTitle, {color: theme.textColor}]}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={[styles.searchResultPrice, {color: theme.accentColor}]}>
          {item.price}
        </Text>
        {item.location && (
          <Text
            style={[
              styles.searchResultLocation,
              {color: theme.secondaryTextColor},
            ]}>
            {item.location}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.searchResultFavoriteButton}
        onPress={e => {
          e.stopPropagation();
          toggleFavorite(item);
        }}>
        <Text style={styles.favoriteIcon}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <Text style={[styles.headerTitle, {color: theme.accentColor}]}>
          AutoConnect
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestScreenPress}>
            <Text style={styles.testButtonText}>🔧 Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileButton,
              {backgroundColor: theme.iconBackground},
            ]}
            onPress={handleProfilePress}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.cardColor,
              shadowColor: theme.shadowColor,
              borderColor: theme.borderColor,
            },
          ]}>
          <Text style={{color: theme.secondaryTextColor, marginRight: 8}}>
            🔍
          </Text>
          <TextInput
            style={[styles.searchInput, {color: theme.textColor}]}
            placeholder="Marka, model veya konum ara..."
            placeholderTextColor={theme.secondaryTextColor}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={{color: theme.secondaryTextColor}}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, {backgroundColor: theme.buttonColor}]}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {searchText.trim() !== '' ? (
        <FlatList
          data={searchResults}
          renderItem={({item}) => <SearchResultItem item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.searchResultsContainer}
          ListEmptyComponent={
            <View style={styles.emptyResultsContainer}>
              <Text style={[styles.emptyResultsText, {color: theme.textColor}]}>
                "{searchText}" için sonuç bulunamadı
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.categoryHeaderContainer}>
            <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
              Kategoriler
            </Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text
                  style={[styles.clearFilterText, {color: theme.accentColor}]}>
                  Filtreyi Temizle
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={({item}) => <CategoryItem item={item} />}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
            Öne Çıkan Araçlar
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredContainer}>
            {featuredCars.map(car => (
              <FeaturedCarItem key={car.id} item={car} />
            ))}
          </ScrollView>

          <View style={styles.listHeaderContainer}>
            <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
              {selectedCategory
                ? `${selectedCategory} Araçları`
                : 'Son İlanlar'}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, {color: theme.accentColor}]}>
                Tümünü Gör
              </Text>
            </TouchableOpacity>
          </View>

          {filteredCars.length > 0 ? (
            filteredCars.map(car => <CarItem key={car.id} item={car} />)
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={[styles.noResultsText, {color: theme.textColor}]}>
                Seçili kategoride araç bulunamadı.
              </Text>
              <TouchableOpacity
                style={[
                  styles.clearFilterButton,
                  {backgroundColor: theme.accentColor},
                ]}
                onPress={() => setSelectedCategory(null)}>
                <Text style={[styles.clearFilterButtonText, {color: '#fff'}]}>
                  Filtreyi Temizle
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingLeft: 8,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
  },
  featuredContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCarItem: {
    width: width * 0.75,
    height: 180,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredCarImage: {
    width: '100%',
    height: '100%',
  },
  featuredFavoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  featuredCarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
  },
  featuredCarTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredCarPrice: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  carItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  carDetails: {
    padding: 12,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  carInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  carInfo: {
    fontSize: 14,
  },
  carLocation: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  searchResultsContainer: {
    padding: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchResultImage: {
    width: 80,
    height: 80,
  },
  searchResultDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  searchResultLocation: {
    fontSize: 14,
    marginTop: 2,
  },
  searchResultFavoriteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noResultsText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  clearFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearFilterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
