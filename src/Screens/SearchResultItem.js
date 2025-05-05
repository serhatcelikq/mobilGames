import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

const SearchResultItem = ({item}) => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.resultItem, {backgroundColor: theme.cardColor}]}
      onPress={() => navigation.navigate('CarDetails', {carId: item.id})}>
      <Image source={{uri: item.image}} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={[styles.resultTitle, {color: theme.textColor}]}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={[styles.resultPrice, {color: theme.accentColor}]}>
          {item.price}
        </Text>
        {item.location && (
          <Text
            style={[styles.resultLocation, {color: theme.secondaryTextColor}]}>
            {item.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  resultImage: {
    width: 100,
    height: 80,
  },
  resultInfo: {
    flex: 1,
    padding: 10,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  resultLocation: {
    fontSize: 13,
    marginTop: 4,
  },
});

export default SearchResultItem;
