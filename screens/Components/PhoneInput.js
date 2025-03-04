import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

const PhoneInput = ({
  phoneValue,
  onPhoneChange,
  verificationCode,
  onVerificationCodeChange,
  isPhoneFocused,
  setIsPhoneFocused,
  isVerificationCodeFocused,
  setIsVerificationCodeFocused,
  onSendCode,
  onValidationChange,
}) => {
  const [countdown, setCountdown] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validatePhone = (phone) => {
    if (!phone) {
      return '請輸入手機號碼';
    }
    if (!/^09\d{8}$/.test(phone)) {
      return '請輸入有效的手機號碼格式（09開頭的10位數字）';
    }
    return null;
  };

  const validateVerificationCode = (code) => {
    if (!isCodeSent) {
      return '請先獲取驗證碼';
    }
    if (!code) {
      return '請輸入驗證碼';
    }
    if (code.length !== 6) {
      return '請輸入6位數驗證碼';
    }

    return null;
  };

  const handleSendVerificationCode = () => {
    const phoneError = validatePhone(phoneValue);
    if (phoneError) {
      Alert.alert('錯誤', phoneError);
      return;
    }

    if (countdown === 0) {
      setCountdown(60);
      setIsCodeSent(true);
      Alert.alert('成功', '驗證碼已發送至您的手機');
      onSendCode && onSendCode();
    }
  };

  useEffect(() => {
    const phoneError = validatePhone(phoneValue);
    const codeError = validateVerificationCode(verificationCode);
    const isValid = !phoneError && !codeError;
    
    onValidationChange && onValidationChange({
      isValid,
      phoneError,
      codeError,
      isCodeSent
    });
  }, [phoneValue, verificationCode, isCodeSent]);

  return (
    <>
      {/* 手機號碼輸入框 */}
      <View
        style={[
          styles.phoneContainer,
          isPhoneFocused && styles.containerFocused
        ]}
      >
        <TextInput
  style={styles.input}
  placeholder="手機號碼"
  value={phoneValue}
  onChangeText={(text) => {
    onPhoneChange(text);

    if (text.length === 10) {
      const error = validatePhone(text);
      if (error) {
        Alert.alert('錯誤', error);
      }
    }
  }}
  onFocus={() => setIsPhoneFocused(true)}
  onBlur={() => {
    setIsPhoneFocused(false);

  }}
  keyboardType="phone-pad"
  maxLength={10}
/>
      </View>

      {/* 驗證碼輸入框 */}
      <View style={styles.verificationContainer}>
        <View
          style={[
            styles.verificationInputWrapper,
            isVerificationCodeFocused && styles.wrapperFocused
          ]}
        >
          <TextInput
  style={styles.verificationInput}
  placeholder="請輸入驗證碼"
  value={verificationCode}
  onChangeText={(text) => {
    onVerificationCodeChange(text);

    if (text.length === 6) {
      const error = validateVerificationCode(text);
      if (error) {
        Alert.alert('錯誤', error);
      }
    }
  }}
  onFocus={() => setIsVerificationCodeFocused(true)}
  onBlur={() => setIsVerificationCodeFocused(false)}
  keyboardType="number-pad"
  maxLength={6}
/>
          <TouchableOpacity
            style={[
              styles.sendCodeButton,
              countdown > 0 && styles.sendCodeButtonDisabled
            ]}
            onPress={handleSendVerificationCode}
            disabled={countdown > 0}
          >
            <Text style={styles.sendCodeButtonText}>
              {countdown > 0 ? `${countdown}s` : '傳送驗證碼'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  containerFocused: {
    borderColor: '#606060',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#101010',
  },
  verificationContainer: {
    width: '100%',
    marginBottom: 24,
  },
  verificationInputWrapper: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  verificationInput: {
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#101010',
  },
  wrapperFocused: {
    borderColor: '#606060',
    borderWidth: 1,
  },
  sendCodeButton: {
    height: 32,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFBF69',
    borderRadius: 4,
    margin: 8,
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendCodeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PhoneInput;