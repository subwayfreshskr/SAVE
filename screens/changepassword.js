import React, { useState } from 'react';
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
import PhoneInput from './Components/PhoneInput';

export default function changepassword({ navigation }) {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [isVerificationCodeFocused, setIsVerificationCodeFocused] = useState(false);
    const [phoneValidation, setPhoneValidation] = useState({
        isValid: false,
        phoneError: null,
        codeError: null,
        isCodeSent: false
      });
      
      const handleConfirm= () => {
        if (!phoneValidation.isValid) {
          if (phoneValidation.phoneError) {
            Alert.alert('錯誤', phoneValidation.phoneError);
            return;
          }
          if (phoneValidation.codeError) {
            Alert.alert('錯誤', phoneValidation.codeError);
            return;
          }
          if (!phoneValidation.isCodeSent) {
            Alert.alert('錯誤', '請先獲取並輸入驗證碼');
            return;
          }
        }
      
        if (!password.trim()) {
          Alert.alert('錯誤', '請輸入新密碼');
          return;
        }
      
        if (!confirmPassword.trim()) {
          Alert.alert('錯誤', '請輸入確認密碼');
          return;
        }
      
        if (password !== confirmPassword) {
          Alert.alert('錯誤', '兩次輸入的密碼不相同');
          return;
        }
      
        navigation.navigate('Login');
      };

    const handleSendCode = () => {
        console.log('發送驗證碼到：', phone);
      };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 返回按鈕 */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Setting')}
        >
          <Text style={styles.backText}>回上一頁</Text>
        </TouchableOpacity>
        {/* Logo 區塊 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/LOGO.png')}
            style={styles.logo}
          />
        </View>

        {/* 標題 */}
        <Text style={styles.title}>更改密碼</Text>
        {/* 手機驗證 */}
        <PhoneInput
      phoneValue={phone}
      onPhoneChange={setPhone}
      verificationCode={verificationCode}
      onVerificationCodeChange={setVerificationCode}
      isPhoneFocused={isPhoneFocused}
      setIsPhoneFocused={setIsPhoneFocused}
      isVerificationCodeFocused={isVerificationCodeFocused}
      setIsVerificationCodeFocused={setIsVerificationCodeFocused}
      onSendCode={handleSendCode}
      onValidationChange={setPhoneValidation} 
      />
        {/* 分隔線 */}
        <View style={styles.line}></View>

         {/* 新密碼輸入框 */}
         <PasswordInput
          placeholder="新密碼"
          value={password}
          onChangeText={setPassword}
          isFocused={isPasswordFocused}
          setIsFocused={setIsPasswordFocused}
          secureTextEntry={!passwordVisible}
          setSecureTextEntry={() => setPasswordVisible(!passwordVisible)}
        />

          <PasswordInput
          placeholder="確認新密碼"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isFocused={isConfirmPasswordFocused}
          setIsFocused={setIsConfirmPasswordFocused}
          secureTextEntry={!confirmPasswordVisible}
          setSecureTextEntry={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        />

        

        {/* 確認 */}
        <TouchableOpacity style={styles.ConfirmButton} onPress={handleConfirm}>
          <Text style={styles.ConfirmButtonText}>確認</Text>
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  passwordContainerFocused: {
    borderColor: '#000',
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  eyeButton: {
    marginLeft: 8,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#606060',
    marginBottom: 24,
  },
  ConfirmContainer: {
    marginBottom: 24,
  },
  ConfirmText: {
    fontSize: 14,
    color: '#606060',
  },
  ConfirmButton: {
    width: '100%',
    height: 50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#F08080',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  ConfirmButtonText: {
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