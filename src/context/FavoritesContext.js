import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Favoriler için context oluştur
const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Favori araçları AsyncStorage'dan yükle
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('@favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Favoriler yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Favori değişikliklerini AsyncStorage'a kaydet
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Favoriler kaydedilirken hata oluştu:', error);
      }
    };

    if (!isLoading) {
      saveFavorites();
    }
  }, [favorites, isLoading]);

  // Favori ekleme
  const addFavorite = vehicle => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(item => item.id === vehicle.id)) {
        return [...prevFavorites, vehicle];
      }
      return prevFavorites;
    });
  };

  // Favori kaldırma
  const removeFavorite = vehicleId => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(item => item.id !== vehicleId),
    );
  };

  // Favori durumu kontrolü
  const isFavorite = vehicleId => {
    return favorites.some(item => item.id === vehicleId);
  };

  // Favori durumunu değiştirme (ekle/kaldır)
  const toggleFavorite = vehicle => {
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        isLoading,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Favorilere erişmek için hook
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      'useFavorites hook must be used within a FavoritesProvider',
    );
  }
  return context;
};
