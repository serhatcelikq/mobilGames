import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function FavoritesScreen() {
  return (
    <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Favoriler Ekranı</Text>
  </View>
  )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
      },
      screenText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
})