import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

export default function Save52({ navigation, route }) {
  const [isFocused, setIsFocused] = useState(false);
  const [salary, setSalary] = useState('');
  const [selectedCircles, setSelectedCircles] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [history, setHistory] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [allChallenges, setAllChallenges] = useState([]);
  const [currentChallengeId, setCurrentChallengeId] = useState(null);

  useEffect(() => {
    // 初次加载时尝试获取保存的页码
    const initPage = async () => {
      try {
        const savedPage = await AsyncStorage.getItem('currentPage');
        if (savedPage !== null) {
          setCurrentPage(parseInt(savedPage));
        }
      } catch (error) {
        console.error('Error loading initial page:', error);
      }
    };
    
    initPage();
    loadSavedData();
  }, []);

  useEffect(() => {
    if (route.params?.savedPage !== undefined) {
      setCurrentPage(route.params.savedPage);
    }
  }, [route.params]);
  
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // 当页面获得焦点时，检查route.params
      if (route.params?.savedPage !== undefined) {
        console.log('Restoring page from params:', route.params.savedPage);
        setCurrentPage(route.params.savedPage);
        // 清除参数，防止多次设置
        navigation.setParams({ savedPage: undefined });
      }
      
      loadSavedData();
    });
    
    return unsubscribeFocus;
  }, [navigation]);
  

  useEffect(() => {
    const currentChallengeHistory = history.filter(item => item.challengeId === currentChallengeId);
    if (currentChallengeHistory.length === 52 && !showCompletionModal) {
      setShowCompletionModal(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [history, currentChallengeId]);

  const saveCurrentPage = async (page) => {
    try {
      await AsyncStorage.setItem('currentPage', page.toString());
      console.log('Page saved to AsyncStorage:', page);
    } catch (error) {
      console.error('Error saving current page:', error);
    }
  };

  const loadSavedData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('save52History');
      const savedCircles = await AsyncStorage.getItem('save52Circles');
      const savedSalary = await AsyncStorage.getItem('save52Salary');
      const savedAllChallenges = await AsyncStorage.getItem('save52AllChallenges');
      const savedCurrentChallengeId = await AsyncStorage.getItem('save52CurrentChallengeId');
      
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedCircles) setSelectedCircles(JSON.parse(savedCircles));
      if (savedSalary) setSalary(savedSalary);
      if (savedAllChallenges) setAllChallenges(JSON.parse(savedAllChallenges));
      
      if (!savedCurrentChallengeId) {
        const newChallengeId = Date.now().toString();
        setCurrentChallengeId(newChallengeId);
        await AsyncStorage.setItem('save52CurrentChallengeId', newChallengeId);
      } else {
        setCurrentChallengeId(savedCurrentChallengeId);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async (newHistory, newSelectedCircles, newAllChallenges, newCurrentChallengeId) => {
    try {
      await AsyncStorage.setItem('save52History', JSON.stringify(newHistory));
      await AsyncStorage.setItem('save52Circles', JSON.stringify(newSelectedCircles));
      await AsyncStorage.setItem('save52Salary', salary);
      if (newAllChallenges) {
        await AsyncStorage.setItem('save52AllChallenges', JSON.stringify(newAllChallenges));
      }
      if (newCurrentChallengeId) {
        await AsyncStorage.setItem('save52CurrentChallengeId', newCurrentChallengeId);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCirclePress = async (number) => {
    if (!salary || Number(salary) === 0) {
      alert('請先輸入有效的存款金額！');
      return;
    }
  
    const currentDate = new Date().toLocaleDateString();
    const currentChallengeRecords = history.filter(item => item.challengeId === currentChallengeId);
    const existingRecord = currentChallengeRecords.find(item => item.number === number);
  
    if (selectedCircles[number]) {
      const newSelectedCircles = { ...selectedCircles };
      delete newSelectedCircles[number];
      setSelectedCircles(newSelectedCircles);
  
      const newHistory = history.filter(item => !(item.number === number && item.challengeId === currentChallengeId));
      setHistory(newHistory);
  
      await saveData(newHistory, newSelectedCircles, allChallenges, currentChallengeId);
    } else {
      const newSelectedCircles = {
        ...selectedCircles,
        [number]: true
      };
      setSelectedCircles(newSelectedCircles);
  
      if (!existingRecord) {
        const newHistory = [...history, {
          number,
          date: currentDate,
          amount: salary,
          challengeId: currentChallengeId
        }];
        setHistory(newHistory);
        await saveData(newHistory, newSelectedCircles, allChallenges, currentChallengeId);
      }
    }
  };

  const startNewChallenge = async () => {
    const newChallengeId = Date.now().toString();
    const currentChallengeRecords = history.filter(item => item.challengeId === currentChallengeId);
    
    const currentChallenge = {
      id: currentChallengeId,
      completedDate: new Date().toISOString(),
      history: currentChallengeRecords,
      totalAmount: calculateTotalAmount(currentChallengeRecords),
      salary: salary
    };

    const newAllChallenges = [...allChallenges, currentChallenge];
    setAllChallenges(newAllChallenges);
    
    setSelectedCircles({});
    setCurrentPage(0);
    setCurrentChallengeId(newChallengeId);

    await saveData(history, {}, newAllChallenges, newChallengeId);
    closeModal();
  };

  const calculateTotalAmount = (records = history) => {
    return records.reduce((total, item) => total + Number(item.amount), 0);
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowCompletionModal(false));
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
      const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      setCurrentPage(newPage);
      
      // 保存最新的页码
      saveCurrentPage(newPage);
  
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
  onPress={() => {

    saveCurrentPage(currentPage);
    

    navigation.navigate('History52', { 
      history,
      currentSalary: salary,
      allChallenges,
      savedPage: currentPage,
      returnToSave52: true 
    });
  }}
>
  <Text style={styles.checkButtonText}>查看總共已存金額</Text>
</TouchableOpacity>

        <View style={styles.menuContainer}>
        <View style={styles.iconContainer}>
  <TouchableOpacity
    style={styles.iconWrapper}
    onPress={() => {
      saveCurrentPage(currentPage);
      navigation.navigate('Accounting', { 
        sourceScreen: 'save52', 
        savedPage: currentPage 
      });
    }}
  >
    <Image
      source={require('../assets/account.png')}
      style={styles.menuIcon}
    />
    <Text style={styles.iconText}>記帳</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.iconWrapper}
    onPress={() => {
      saveCurrentPage(currentPage);
      navigation.navigate('Home');
    }}
  >
    <Image 
      source={require('../assets/home.png')}
      style={styles.menuIcon}
    />
    <Text style={styles.iconText}>主頁</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.iconWrapper} 
    onPress={() => {
      saveCurrentPage(currentPage);
      navigation.navigate('Setting', { savedPage: currentPage });
    }}
  >
    <Image 
      source={require('../assets/setting.png')}
      style={styles.menuIcon}
    />
    <Text style={styles.iconText}>設定</Text>
  </TouchableOpacity>
</View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showCompletionModal}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <Image
                source={require('../assets/52周.png')}
                style={styles.congratsImage}
              />
              <Text style={styles.congratsTitle}>恭喜你完成了 52 周儲蓄挑戰!</Text>
              <Text style={styles.congratsText}>
                你已經成功存了總共 <Text style={styles.amountText}>${calculateTotalAmount().toLocaleString()}</Text> 元
              </Text>            
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={startNewChallenge}
                >
                  <Text style={styles.buttonText}>開始新的挑戰</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>繼續</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
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
    width: windowWidth,
    height: 100,
    backgroundColor: '#EEDA58',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginVertical: 24,
  },
  input: {
    width: '100%',
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  numbersContainer: {
    flex: 1,
  },
  numbersContainerSecondPage: {
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 24,
  },
  rowSecondPage: {
    marginBottom: 12,
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
    width: '100%',
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
    width: windowWidth,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  congratsImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FBBE0D',
    textAlign: 'center',
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FBBE0D',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: '#FBBE0D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  closeButton: {
    backgroundColor: '#FBBE0D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});