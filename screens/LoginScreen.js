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

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('錯誤', '請輸入帳號');
      return;
    }
    if (!password.trim()) {
      Alert.alert('錯誤', '請輸入密碼');
      return;
    }
  
    // 假設驗證成功後跳轉到主畫面
    if (username === 'test' && password === '123456') {
      Alert.alert('登入成功', `歡迎, ${username}!`);
      navigation.navigate('MainScreen'); 
    } else {
      Alert.alert('錯誤', '帳號或密碼不正確，請重新輸入');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('提示', 'Google 快速登入尚未實現');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgetPassword = () => {
    navigation.navigate('Forget');
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

        {/* 登入標題 */}
        <Text style={styles.title}>登入</Text>

       {/* 帳號輸入框 */}
       <AccountInput
          placeholder="帳號"
          value={username}
          onChangeText={setUsername}
        />

         {/* 密碼輸入框 */}
         <PasswordInput
          placeholder="密碼"
          value={password}
          onChangeText={setPassword}
        />

        {/* 忘記密碼 */}
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={handleForgetPassword}
        >
          <Text style={styles.forgotPasswordText}>忘記密碼?</Text>
        </TouchableOpacity>

        {/* 分隔線 */}
        <View style={styles.line}></View>

        {/* 登入按鈕 */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>登入</Text>
        </TouchableOpacity>

        {/* Google 快速登入 */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <View style={styles.googleContent}>
            <Image
              source={require('../assets/google.png')}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Google 快速登入</Text>
          </View>
        </TouchableOpacity>

        {/* 註冊區域 */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>尚未成為會員?</Text>
        </View>

        {/* 註冊按鈕 */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>註冊</Text>
        </TouchableOpacity>

        {/* 版權文字 */}
        <Text style={styles.copyright}>Copyright@byGeorgeXIE</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFBF69',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#606060',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    height: 50,
    padding: 16,
    backgroundColor: '#F08080',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    height: 50,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#606060',
  },
  registerContainer: {
    marginBottom: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#606060',
  },
  registerButton: {
    width: '100%',
    height: 50,
    padding: 16,
    backgroundColor: '#FFBF69',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyright: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    color: '#aaa',
  },
});