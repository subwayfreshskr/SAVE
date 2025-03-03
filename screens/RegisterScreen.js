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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PasswordInput from './Components/PasswordInput';
import AccountInput from './Components/AccountInput';
import PhoneInput from './Components/PhoneInput';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
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
      const [agreeToTerms, setAgreeToTerms] = useState(false);
      const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
      
      const handleLoginPress = () => {
        navigation.navigate('Login');
      };

      const handleRegister= () => {
        if (!password.trim()) {
          Alert.alert('錯誤', '請輸入密碼');
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
      
        navigation.navigate('Login');
      };

    const handleSendCode = () => {
        console.log('發送驗證碼到：', phone);
      };
      const handleGoogleLogin = () => {
        Alert.alert('提示', 'Google 快速登入尚未實現');
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
        <View style={styles.scrollContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* 登入標題 */}
        <Text style={styles.title}>註冊</Text>
         {/* 帳號輸入框 */}
       <AccountInput
          placeholder="帳號"
          value={username}
          onChangeText={setUsername}
          isFocused={isUsernameFocused}
          setIsFocused={setIsUsernameFocused}
          setSecureTextEntry={setUsername}
        />
        <PasswordInput
          placeholder="密碼"
          value={password}                  
          onChangeText={setPassword}     
          isFocused={isPasswordFocused}   
          setIsFocused={setIsPasswordFocused}
          secureTextEntry={!passwordVisible} 
          setSecureTextEntry={() => setPasswordVisible(!passwordVisible)}
        />

        <PasswordInput
          placeholder="確認密碼"
          value={confirmPassword} 
          onChangeText={setConfirmPassword}
          isFocused={isConfirmPasswordFocused}
          setIsFocused={setIsConfirmPasswordFocused}
          secureTextEntry={!confirmPasswordVisible} 
          setSecureTextEntry={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        />
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
      {/* 條款同意勾選框 */}
      <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { backgroundColor: agreeToTerms ? '#FFBF69' : '#fff' }
              ]}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              {agreeToTerms && <Icon name="check" size={12} color="#fff"/>}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>我已閱讀並同意【隱私權保護政策】</Text>
          </View>

          {/* 會員同意 */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { backgroundColor: subscribeNewsletter ? '#FFBF69' : '#fff' }
              ]}
              onPress={() => setSubscribeNewsletter(!subscribeNewsletter)}
            >
              {subscribeNewsletter && <Icon name="check" size={12} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>本人同意會員資料登入於 APP</Text>
          </View>

        {/* 分隔線 */}
        <View style={styles.line}></View>

        {/* 註冊 */}
        <TouchableOpacity style={styles.RegisterButton} onPress={handleRegister}>
          <Text style={styles.RegisterButtonText}>註冊</Text>
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

        {/* 登入區域 */}
        <View style={styles.loginContainer}>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.loginText}>已經是會員了? 登入</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
          </View>

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
  },
  scrollContainer: {
    flex: 1,
    maxHeight: '80%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#FFBF69',
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
    color: '#FFBF69',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#606060',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#606060',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#606060',
    marginBottom: 24,
  },
  RegisterContainer: {
    marginBottom: 24,
  },
  RegisterText: {
    fontSize: 14,
    color: '#606060',
  },
  RegisterButton: {
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
  RegisterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    height: 50,
    alignItems:'center',
    justifyContent:'center',
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
  loginContainer: {
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#FFBF69',
  },
  copyright: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    fontSize: 12,
    color: '#aaa',
  },
});