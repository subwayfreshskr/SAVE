import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PasswordInput from './Components/PasswordInput';
import AccountInput from './Components/AccountInput';

export default function save365({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Logo 區塊 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/LOGO.png')}
            style={styles.logo}
          />
        </View>

        {/* 版權文字 */}
        <View style={styles.menuContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity>
            <Image 
                source={require('../assets/account.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
            <Image 
                source={require('../assets/home.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
            <Image 
                source={require('../assets/setting.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#F08080',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    marginTop: 54,
    width: 48,
    height: 48,
  },
  menuContainer: {
    width: 402,
    height: 80,
    backgroundColor: '#F08080',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    width: '100%', 
    justifyContent: 'space-around',
    alignItems: 'center', 
    paddingBottom:'16',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});