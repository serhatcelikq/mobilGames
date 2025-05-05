import React, {createContext, useState, useContext, useEffect} from 'react';
import {Appearance} from 'react-native';
import {auth, database} from '../../firebase';
import {ref, get, onValue} from 'firebase/database';

// Tema renkleri
export const lightTheme = {
  backgroundColor: '#F7F8FA',
  headerColor: '#FFFFFF',
  cardColor: '#FFFFFF',
  buttonColor: '#EFEFEF',
  accentColor: '#FF5A5F',
  textColor: '#333333',
  secondaryTextColor: '#717171',
  borderColor: '#E0E0E0',
  iconBackground: '#F0F0F0',
  shadowColor: '#000000',
  statusBarStyle: 'dark-content',
  tabBarBackground: '#FFFFFF',
  tabBarActiveColor: '#FF5A5F',
  tabBarInactiveColor: '#717171',
};

export const darkTheme = {
  backgroundColor: '#121212',
  headerColor: '#1E1E1E',
  cardColor: '#1E1E1E',
  buttonColor: '#2C2C2C',
  accentColor: '#FF5A5F',
  textColor: '#FFFFFF',
  secondaryTextColor: '#AAAAAA',
  borderColor: '#333333',
  iconBackground: '#2C2C2C',
  shadowColor: '#000000',
  statusBarStyle: 'light-content',
  tabBarBackground: '#1E1E1E',
  tabBarActiveColor: '#FF5A5F',
  tabBarInactiveColor: '#AAAAAA',
};

// Context oluşturma
export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  // Cihazın tema ayarını kontrol et
  const deviceColorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');
  const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);

  // Firebase'den kullanıcı tema tercihini al
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Kullanıcı giriş yapmış, Firebase'den tema tercihini al
        const userPreferencesRef = ref(
          database,
          `users/${user.uid}/preferences`,
        );

        // Tema tercihini bir kez oku
        get(userPreferencesRef)
          .then(snapshot => {
            if (snapshot.exists() && snapshot.val().darkMode !== undefined) {
              const darkModePreference = snapshot.val().darkMode;
              setIsDarkMode(darkModePreference);
              setTheme(darkModePreference ? darkTheme : lightTheme);
            }
          })
          .catch(error => {
            console.error('Tema tercihi alınırken hata oluştu:', error);
          });

        // Tema tercihini gerçek zamanlı dinle
        const preferenceListener = onValue(userPreferencesRef, snapshot => {
          if (snapshot.exists() && snapshot.val().darkMode !== undefined) {
            const darkModePreference = snapshot.val().darkMode;
            setIsDarkMode(darkModePreference);
            setTheme(darkModePreference ? darkTheme : lightTheme);
          }
        });

        return () => preferenceListener();
      }
    });

    return () => unsubscribe();
  }, []);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setIsDarkMode(prevIsDarkMode => {
      const newIsDarkMode = !prevIsDarkMode;
      setTheme(newIsDarkMode ? darkTheme : lightTheme);
      return newIsDarkMode;
    });
  };

  // Cihaz tema değişikliklerini dinle
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      // Sadece kullanıcı giriş yapmadıysa cihaz temasını kullan
      if (!auth.currentUser) {
        setIsDarkMode(colorScheme === 'dark');
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{theme, isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// Kullanımı kolaylaştırmak için hook
export const useTheme = () => useContext(ThemeContext);
