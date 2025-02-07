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

export default function setting({ navigation }) {
 const handleExit = () => {
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
          onPress: () => navigation.navigate('Login'),
        },
      ],
      { cancelable: false }
    );
  };
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

        {/* 設定選單 */}
      <View style={styles.menu}>
        <Text style={styles.sectionTitle}>我的帳戶</Text>
        <TouchableOpacity style={styles.menuItem}onPress={() => navigation.navigate('changepassword')}><Text>更改密碼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}onPress={() => navigation.navigate('Delete')}><Text>刪除帳戶</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}onPress={() => navigation.navigate('security')}><Text>隱私權保護政策</Text></TouchableOpacity>

        <Text style={styles.sectionTitle}>關於計畫</Text>
        <TouchableOpacity style={styles.menuItem}><Text>計畫進度</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text>變更計畫</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text>通知</Text></TouchableOpacity>
      </View>
        {/* 登出按鈕 */}
        <TouchableOpacity style={styles.ExitButton} onPress={handleExit}>
          <Text style={styles.ExitButtonText}>登出</Text>
        </TouchableOpacity>
        {/* 底部導航欄 */}
      <View style={styles.menuContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image 
              source={require('../assets/account.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.iconText}>記帳</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image 
              source={require('../assets/home-line.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.iconText}>主頁</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Setting')}>
                <Image 
                  source={require('../assets/setting1.png')}
                  style={styles.menuIcon}
                />
                <Text style={styles.iconText}>設定</Text>
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
    
  },
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#F08080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 54,
    width: 48,
    height: 48,
  },
  menu: {
    width: '100%',
    marginBottom:24,
  },
  sectionTitle: {
    backgroundColor:'#FFBF69',
    paddingHorizontal:24,
    paddingVertical:16,
    fontSize: 16,
    color: "#ffffff",
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  menuItem: {
    backgroundColor: "#FFD59E",
    paddingHorizontal:24,
    paddingVertical:20,
    borderColor: "#FFFFFF",
    borderBottomWidth: 1,
  },
  ExitContainer: {
    marginBottom: 24,
  },
  ExitText: {
    fontSize: 14,
    color: '#606060',
  },
  ExitButton: {
    width: '85%',
    height: 50,
    backgroundColor: '#F08080',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ExitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingHorizontal:16,
    paddingBottom: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
});