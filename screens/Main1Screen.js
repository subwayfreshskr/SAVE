import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main1Screen() {
  const navigation = useNavigation();

const handleSelectPlan = async () => {
  try {
    await AsyncStorage.setItem('sourceScreen', 'save52');
    navigation.navigate('save52');
  } catch (error) {
    console.error('Error saving source screen:', error);
  }
};
  
  const handleLeftArrow = () => {
    navigation.navigate('MainScreen');
  };

  const handleRightArrow = () => {
    navigation.navigate('Main2Screen');
  };

  const handleBack = () => {
    Alert.alert(
      '登出確認',
      '您確定要登出嗎？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('sourceScreen');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* 登出按鈕 */}
      <TouchableOpacity
  style={styles.backButton}
  onPress={handleBack}
>
  <Text style={styles.backText}>登出</Text>
</TouchableOpacity>
      {/* 左右箭頭 */}
      <TouchableOpacity 
        style={styles.arrowLeft}
        onPress={handleLeftArrow}
      >
        <Icon name="arrow-back-ios" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.arrowRight}
        onPress={handleRightArrow}
      >
        <Icon name="arrow-forward-ios" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Rest of your existing components */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/52周.png')}
          style={styles.icon}
        />
      </View>

      <Text style={styles.title}>52 周存錢法</Text>

      <Text style={styles.description}>
        簡介簡介簡介簡介簡介簡介簡介簡介簡介簡介
        簡介簡介簡介簡介簡介簡介簡介簡介簡介簡介
        簡介簡介簡介簡介簡介簡介簡介簡介簡介簡介
      </Text>

      <TouchableOpacity style={styles.confirmButton}onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>確認選擇</Text>
      </TouchableOpacity>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEDA58',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  arrowLeft: {
    position: 'absolute',
    left: 24,
    top: '50%',
  },
  arrowRight: {
    position: 'absolute',
    right: 24,
    top: '50%',
  },
  iconContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 32,
    paddingHorizontal: 48,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FBBE0D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 24,
    position: 'absolute',
    bottom: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
  },
});