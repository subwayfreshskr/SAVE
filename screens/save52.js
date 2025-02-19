import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Save52({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);
  const [salary, setSalary] = useState('');
  const [selectedCircles, setSelectedCircles] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [history, setHistory] = useState([]); 
  const [fadeAnim] = useState(new Animated.Value(1));
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('save52History');
      const savedCircles = await AsyncStorage.getItem('save52Circles');
      const savedSalary = await AsyncStorage.getItem('save52Salary');
      
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      if (savedCircles) {
        setSelectedCircles(JSON.parse(savedCircles));
      }
      if (savedSalary) {
        setSalary(savedSalary);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };
  
  const saveData = async (newHistory, newSelectedCircles) => {
    try {
      await AsyncStorage.setItem('save52History', JSON.stringify(newHistory));
      await AsyncStorage.setItem('save52Circles', JSON.stringify(newSelectedCircles));
      await AsyncStorage.setItem('save52Salary', salary);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCirclePress = async (number) => {
    const currentDate = new Date().toLocaleDateString();
    
    // 檢查這個圈圈是否已經在歷史記錄中
    const existingRecord = history.find(item => item.number === number);

    if (selectedCircles[number]) {
      // 如果圈圈已經被選中，則取消選中
      const newSelectedCircles = { ...selectedCircles };
      delete newSelectedCircles[number];
      setSelectedCircles(newSelectedCircles);

      // 從歷史記錄中移除
      const newHistory = history.filter(item => item.number !== number);
      setHistory(newHistory);

      // 保存更新後的數據
      await saveData(newHistory, newSelectedCircles);
    } else {
      // 如果圈圈未被選中
      const newSelectedCircles = {
        ...selectedCircles,
        [number]: require('../assets/check52.png')
      };
      setSelectedCircles(newSelectedCircles);

      let newHistory;
      if (existingRecord) {
        // 如果這個圈圈之前存在記錄，保留原來的金額
        newHistory = [...history];
      } else {
        // 如果是新的圈圈，使用當前輸入的金額
        newHistory = [...history, {
          number,
          date: currentDate,
          amount: salary || '0',  // 儲存選中時的金額
        }];
      }
      
      setHistory(newHistory);
      await saveData(newHistory, newSelectedCircles);
    }
  };

  const handlePageChange = (direction) => {
    if ((direction === 'next' && currentPage >= pages.length - 1) || 
        (direction === 'prev' && currentPage <= 0)) {
      return;
    }
  
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(prevPage => 
        direction === 'next' ? prevPage + 1 : prevPage - 1
      );
  
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const pages = [
    Array.from({ length: 24 }, (_, i) => i + 1),
    Array.from({ length: 28 }, (_, i) => i + 25)
  ];

  const getCurrentPageRows = () => {
    const currentNumbers = pages[currentPage];
    const rows = [];
    for (let i = 0; i < currentNumbers.length; i += 4) {
      rows.push(currentNumbers.slice(i, i + 4));
    }
    return rows;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/LOGO.png')}
            style={styles.logo}
          />
        </View>

        {currentPage === 0 && (
          <>
            <Text style={styles.title}>請輸入每周欲存金額</Text>
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="輸入金額"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={salary}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setSalary(numericValue);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </>
        )}

        {currentPage > 0 && (
          <TouchableOpacity 
            style={styles.arrowLeft}
            onPress={() => handlePageChange('prev')}
          >
            <Icon name="arrow-back-ios" size={24} color="#FBBE0D" />
          </TouchableOpacity>
        )}

        {currentPage < pages.length - 1 && (
          <TouchableOpacity 
            style={styles.arrowRight}
            onPress={() => handlePageChange('next')}
          >
            <Icon name="arrow-forward-ios" size={24} color="#FBBE0D" />
          </TouchableOpacity>
        )}

        <View style={[
          styles.calendarContainer,
          currentPage === 1 && styles.calendarContainerSecondPage
        ]}>
          <Animated.View style={[
            styles.numbersContainer,
            { opacity: fadeAnim },
            currentPage === 1 && styles.numbersContainerSecondPage
          ]}>
            {getCurrentPageRows().map((row, rowIndex) => (
              <View key={rowIndex} style={[
                styles.row,
                currentPage === 1 && styles.rowSecondPage
              ]}>
                {row.map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={[
                      styles.circle,
                      selectedCircles[number] && styles.selectedCircle
                    ]}
                    onPress={() => handleCirclePress(number)}
                  >
                    {selectedCircles[number] ? (
                      <Image
                        source={require('../assets/check52.png')}
                        style={styles.checkMark}
                      />
                    ) : (
                      <Text style={styles.number}>{number}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </Animated.View>
        </View>

        <TouchableOpacity 
          style={styles.checkButton}
          onPress={() => navigation.navigate('History52', { 
            history,
            currentSalary: salary
          })}
        >
          <Text style={styles.checkButtonText}>查看目前已存金額</Text>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
                          style={styles.iconWrapper}
                          onPress={() => navigation.navigate('Accounting', { sourceScreen: 'save52' })}
                        >
                          <Image
                            source={require('../assets/account.png')}
                            style={styles.menuIcon}
                          />
                          <Text style={styles.iconText}>記帳</Text>
                        </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
              <Image 
                source={require('../assets/home.png')}
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
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#EEDA58',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FBBE0D',
    marginBottom: 16,
  },
  input: {
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  inputFocused: {
    borderColor: '#FBBE0D',
  },
  arrowLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    zIndex: 1,
  },
  calendarContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 24,
  },
  calendarContainerSecondPage: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
  numbersContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 24,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FBBE0D',
    backgroundColor: '#FFE372',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#FFE372',
  },
  number: {
    color: '#FBBE0D',
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkMark: {
    width: 56,
    height: 56,
  },
  checkButton: {
    width: '85%',
    height: 50,
    position: 'absolute',
    bottom: 104,
    backgroundColor: '#FBBE0D',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  menuContainer: {
    width: 402,
    height: 80,
    backgroundColor: '#EEDA58',
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