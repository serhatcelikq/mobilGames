import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';
import {useFavorites} from '../context/FavoritesContext';

const {width} = Dimensions.get('window');

export default function FavoritesScreen() {
  const {theme} = useTheme();
  const {favorites, removeFavorite} = useFavorites();

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon]}>💔</Text>
      <Text style={[styles.emptyTitle, {color: theme.textColor}]}>
        Henüz favoriniz yok
      </Text>
      <Text style={[styles.emptyText, {color: theme.secondaryTextColor}]}>
        Ana sayfa'dan araçları favorilerinize ekleyebilirsiniz.
      </Text>
    </View>
  );

  const renderCarItem = ({item}) => (
    <View
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
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => removeFavorite(item.id)}>
        <Text style={styles.favoriteIcon}>❤️</Text>
      </TouchableOpacity>
      <View style={styles.carDetails}>
        <Text style={[styles.carTitle, {color: theme.textColor}]}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={[styles.carPrice, {color: theme.accentColor}]}>
          {item.price}
        </Text>
        {item.mileage && (
          <View style={styles.carInfoRow}>
            <Text style={[styles.carInfo, {color: theme.secondaryTextColor}]}>
              {item.mileage}
            </Text>
            {item.location && (
              <Text
                style={[styles.carLocation, {color: theme.secondaryTextColor}]}>
                {item.location}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <Text style={[styles.headerTitle, {color: theme.accentColor}]}>
          Favorilerim
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
  },
  carItem: {
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
});
