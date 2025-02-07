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

export default function DeleteScreen({ navigation }) {
    const [agreeToTerms, setAgreeToTerms] = useState(false);
      
      const handleConfirm= () => {
        navigation.navigate('Login');
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
        <Text style={styles.title}>刪除帳號</Text>
        {/* Rest of your existing components */}
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/delete.png')}
                  style={styles.icon}
                />
              </View>
               <Text style={styles.description}>
                      一旦刪除 APP 帳號，您將無法使用此 APP 所有功能，且不論之後是否重新下載安裝 APP，
                      一旦刪除，亦無法保留/恢復 APP 帳號資料、記帳紀錄、存錢紀錄、通知等等 APP 資訊。刪除 APP 後，
                      若要再次使用 APP，請重新下載安裝。
                    </Text>

        {/* 條款同意勾選框 */}
              <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        { backgroundColor: agreeToTerms ? '#EA4335' : '#fff' }
                      ]}
                      onPress={() => setAgreeToTerms(!agreeToTerms)}
                    >
                      {agreeToTerms && <Icon name="check" size={12} color="#fff"/>}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>我同意刪除我的 APP 會員資格</Text>
                  </View>
        {/* 確認 */}
        <TouchableOpacity 
  style={[
    styles.ConfirmButton, 
    { backgroundColor: agreeToTerms ? '#EA4335' : '#606060' }
  ]}
  onPress={handleConfirm}
  disabled={!agreeToTerms}
    >
    <Text style={styles.ConfirmButtonText}>確認</Text>
    </TouchableOpacity>
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
  description: {
    fontSize: 14,
    color: '#606060',
    textAlign: 'left',
    marginBottom: 32,
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
  ConfirmContainer: {
    marginBottom: 24,
  },
  ConfirmButton: {
    width: '100%',
    height: 50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#606060',
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
});