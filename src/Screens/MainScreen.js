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
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

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

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const CarItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.carItem,
        {
          backgroundColor: theme.cardColor,
          shadowColor: theme.shadowColor,
        },
      ]}>
      <Image
        source={{uri: item.image}}
        style={styles.carImage}
        resizeMode="cover"
      />
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
    <TouchableOpacity style={styles.featuredCarItem}>
      <Image
        source={{uri: item.image}}
        style={styles.featuredCarImage}
        resizeMode="cover"
      />
      <View style={styles.featuredCarOverlay}>
        <Text style={styles.featuredCarTitle}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.featuredCarPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryItem = ({item}) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, {color: theme.textColor}]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <Text style={[styles.headerTitle, {color: theme.accentColor}]}>
          AutoConnect
        </Text>
        <TouchableOpacity
          style={[
            styles.profileButton,
            {backgroundColor: theme.iconBackground},
          ]}
          onPress={handleProfilePress}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: theme.cardColor,
                shadowColor: theme.shadowColor,
              },
            ]}>
            <Text
              style={[styles.searchText, {color: theme.secondaryTextColor}]}>
              🔍 Araba ara...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, {backgroundColor: theme.buttonColor}]}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
          Kategoriler
        </Text>
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
            Son İlanlar
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, {color: theme.accentColor}]}>
              Tümünü Gör
            </Text>
          </TouchableOpacity>
        </View>

        {carListings.map(car => (
          <CarItem key={car.id} item={car} />
        ))}
      </ScrollView>
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
  searchButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  searchText: {},
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
  },
  featuredCarImage: {
    width: '100%',
    height: '100%',
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
  },
  carImage: {
    width: '100%',
    height: 180,
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
});
