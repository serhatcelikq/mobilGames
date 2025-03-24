import React, {createContext, useState, useContext, useEffect} from 'react';
import {Appearance} from 'react-native';

// Tema renkleri
export const lightTheme = {
  backgroundColor: '#f8f8f8',
  cardColor: '#ffffff',
  textColor: '#333333',
  secondaryTextColor: '#666666',
  accentColor: '#2E7D32',
  headerColor: '#ffffff',
  borderColor: '#f0f0f0',
  buttonColor: '#2E7D32',
  iconBackground: '#f0f0f0',
  inputBackground: '#ffffff',
  shadowColor: '#000000',
  tabBarBackground: '#ffffff',
  tabBarActiveColor: '#2E7D32',
  tabBarInactiveColor: '#999999',
  statusBarStyle: 'dark-content',
};

export const darkTheme = {
  backgroundColor: '#121212',
  cardColor: '#1E1E1E',
  textColor: '#FFFFFF',
  secondaryTextColor: '#AAAAAA',
  accentColor: '#4CAF50',
  headerColor: '#1E1E1E',
  borderColor: '#333333',
  buttonColor: '#4CAF50',
  iconBackground: '#333333',
  inputBackground: '#333333',
  shadowColor: '#000000',
  tabBarBackground: '#1E1E1E',
  tabBarActiveColor: '#4CAF50',
  tabBarInactiveColor: '#888888',
  statusBarStyle: 'light-content',
};

// Context oluşturma
export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  // Cihazın tema ayarını kontrol et
  const deviceColorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');
  const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);

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
      setIsDarkMode(colorScheme === 'dark');
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
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
