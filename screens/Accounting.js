import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Accounting({ navigation }) {
    // 設定當前日期
  const [currentDate, setCurrentDate] = useState(new Date());

  // 格式化日期
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // 轉換成 YYYY-MM-DD 格式
  };

  useEffect(() => {
    setCurrentDate(new Date()); // 頁面載入時設置為當天日期
  }, []);

  // 切換日期
  const handlePrevDate = () => {
    setCurrentDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1); // 減少一天
      return newDate;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1); // 增加一天
      return newDate;
    });
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // 讀取記錄
  const loadRecords = async () => {
    try {
      const savedRecords = await AsyncStorage.getItem('accountingRecords');
      if (savedRecords !== null) {
        setRecords(JSON.parse(savedRecords));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  // 儲存記錄
  const saveRecords = async (newRecords) => {
    try {
      await AsyncStorage.setItem('accountingRecords', JSON.stringify(newRecords));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  };

  // 處理新增記錄
  const handleAddRecord = async (newRecord) => {
    const updatedRecords = [{
      items: [newRecord, ...records[0].items]
    }];
    setRecords(updatedRecords);
    await saveRecords(updatedRecords);
  };

  const [records, setRecords] = useState([
    {
      items: []
    }
  ]);

  // 清除所有記錄
  const resetAllRecords = async () => {
    try {
      // 清除 AsyncStorage 中的記錄
      await AsyncStorage.removeItem('accountingRecords');
      // 重置 records 狀態
      setRecords([{
        items: []
      }]);
    } catch (error) {
      console.error('Error resetting records:', error);
    }
  };

  // 將 resetAllRecords 函數添加到 navigation params 中
  useEffect(() => {
    navigation.setParams({
      resetAllRecords: resetAllRecords
    });
  }, [navigation]);

  const handleNewRecord = () => {
  navigation.navigate('NewRecord', {
    onAddRecord: handleAddRecord
  });
};

  const handleAnalysis = () => {
    navigation.navigate('Analysis'); // 導航到消費分析頁面
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordLeft}>
        <Image 
          source={item.icon}
          style={styles.recordIcon}
        />
        <Text style={styles.recordName}>{item.name}</Text>
      </View>
      <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
    </View>
  );

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

        {/* 日期導航 */}
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Image
              source={require('../assets/Vector-1.png')}
              style={styles.dateButtonIcon}
            />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          <TouchableOpacity onPress={handleNextDate}>
            <Image
              source={require('../assets/Vector.png')}
              style={styles.dateButtonIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 主要內容 */}
        <View style={styles.content}>
          {records.length === 0 ? (
            <View style={styles.emptyState}>
              <Image 
                source={require('../assets/risk.png')}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>您尚未有任何紀錄，快去新增吧！</Text>
            </View>
          ) : (
            <FlatList
              data={records[0].items}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              style={styles.flatList}
            />
          )}
        </View>

        {/* 操作按鈕 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.newRecordButton]}
            onPress={handleNewRecord}
          >
            <Image
              source={require('../assets/add.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>新紀錄</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.analysisButton]}
            onPress={handleAnalysis}
          >
            <Image
              source={require('../assets/analyst.png')} // 請替換成您的圖表圖標
              style={styles.buttonIcon1}
            />
            <Text style={styles.buttonText1}>消費分析</Text>
          </TouchableOpacity>
        </View>

        {/* 底部導航欄 */}
        <View style={styles.menuContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Image
                source={require('../assets/account1.png')}
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
            <TouchableOpacity 
              style={styles.iconWrapper} 
              onPress={() => navigation.navigate('Setting')}
            >
              <Image
                source={require('../assets/setting.png')}
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
    width: windowWidth,
    height: 100,
    backgroundColor: '#74C69D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 54,
    width: 48,
    height: 48,
  },
  dateNav: {
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical:16,
    borderBottomWidth: 1,
    borderBottomColor:'#40916C',
    marginBottom:4,
  },
  dateButtonIcon: {
    width: 20,
    height: 20,
  },
  dateText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  flatList: {
    flex: 1,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D8F3DC',
    padding: 16,
    borderRadius: 4,
    marginVertical: 4,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius:4,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 104,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    paddingBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius:4,
    flex: 1,
    marginHorizontal: 8,
  },
  newRecordButton: {
    backgroundColor: '#40916C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisButton: {
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#fff',
    borderRadius:4,
  },
  buttonIcon1: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#40916C',
    borderRadius:4,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonText1: {
    fontSize: 16,
    color: '#40916C',
  },
  menuContainer: {
    width: windowWidth,
    height: 80,
    backgroundColor: '#74C69D',
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
    paddingHorizontal: 16,
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