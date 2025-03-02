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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function setting({ navigation }) {
  const [sourceScreen, setSourceScreen] = useState(null);
  useEffect(() => {
    let unsubscribeFocus = null;
  
    const loadInitialData = async () => {
      const params = navigation.getState().routes.find(
        route => route.name === 'Setting'
      )?.params;
  
      // 保存來源頁面信息
      if (params?.sourceScreen) {
        setSourceScreen(params.sourceScreen);
        // 可選：保存到 AsyncStorage
        try {
          await AsyncStorage.setItem('sourceScreen', params.sourceScreen);
        } catch (error) {
          console.error('Error saving source screen:', error);
        }
      } else {
        // 如果params中沒有，嘗試從AsyncStorage讀取
        try {
          const savedSourceScreen = await AsyncStorage.getItem('sourceScreen');
          if (savedSourceScreen) {
            setSourceScreen(savedSourceScreen);
          }
        } catch (error) {
          console.error('Error loading source screen:', error);
        }
      }
    };
  
    // 初始載入
    loadInitialData();
  
    // 監聽頁面聚焦事件
    unsubscribeFocus = navigation.addListener('focus', () => {
      loadInitialData();
    });
  
    return () => {
      if (unsubscribeFocus) {
        unsubscribeFocus();
      }
    };
  }, [navigation]);

  const handleHomePress = () => {
    if (sourceScreen) {
      navigation.navigate(sourceScreen);
    } else {
      Alert.alert('錯誤', '無法找到主頁面');
    }
  };
  const resetAllRecords = async () => {
    try {
      // 清除特定的記帳記錄
      await AsyncStorage.removeItem('accountingRecords');
      await AsyncStorage.removeItem('savingHistory');
      await AsyncStorage.removeItem('selectedCircles');
      await AsyncStorage.removeItem('save52History');
      await AsyncStorage.removeItem('save52Circles');
      await AsyncStorage.removeItem('save52Salary');

     
      console.log('所有記錄已成功清除');
    } catch (error) {
      console.error('清除記錄時發生錯誤:', error);
      throw error;
    }
  };

  const handlePlanChange = async () => {
    Alert.alert(
      '變更確認',
      '您確定要變更計畫嗎？變更後所有記帳紀錄和存錢計畫將被清除',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: async () => {
            try {
              await resetAllRecords();
              await AsyncStorage.removeItem('sourceScreen'); // 清除 sourceScreen
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainScreen' }],
              });
            } catch (error) {
              Alert.alert('錯誤', '清除記錄時發生錯誤');
              console.error('Error during plan change:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleExit = () => {
  Alert.alert(
    '登出確認',
    '您確定要登出嗎？登出後所有記帳紀錄和存錢計畫將被清除',
    [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '確認',
        onPress: async () => {
          try {
            await resetAllRecords();
            await AsyncStorage.removeItem('sourceScreen'); // 清除 sourceScreen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            Alert.alert('錯誤', '清除記錄時發生錯誤');
            console.error('Error during logout:', error);
          }
        },
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
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            const sourceScreen = navigation.getState().routes.find(
              route => route.name === 'Setting'
            )?.params?.sourceScreen;
            
            if (sourceScreen === 'save52') {
              navigation.navigate('History52', { 
                sourceScreen: sourceScreen,
                returnToSave52: true
              });

            } else if (sourceScreen === 'savecos') {
              navigation.navigate('Historycos', { 
                sourceScreen: sourceScreen,
                returnToSaveCos: true
              });
            } else {

              navigation.navigate('History', { 
                sourceScreen: sourceScreen || 'save365',
                returnToSave365: true
              });
            }
          }}
        >
          <Text>計畫進度</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handlePlanChange}><Text>變更計畫</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}onPress={() => navigation.navigate('notify')}><Text>通知</Text></TouchableOpacity>
      </View>
        {/* 登出按鈕 */}
        <TouchableOpacity style={styles.ExitButton} onPress={handleExit}>
          <Text style={styles.ExitButtonText}>登出</Text>
        </TouchableOpacity>
        {/* 底部導航欄 */}
      <View style={styles.menuContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconWrapper}onPress={() => navigation.navigate('Accounting')}>
            <Image 
              source={require('../assets/account.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.iconText}>記帳</Text>
          </TouchableOpacity>
          <TouchableOpacity 
                        style={styles.iconWrapper}
                        onPress={handleHomePress}
                      >
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