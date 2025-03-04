import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

export default function Save365({ navigation, route }) {
  const [selectedCircles, setSelectedCircles] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [history, setHistory] = useState([]); 
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.5));
  
  const calculateTotalAmount = () => {
    return 66795;
  };

  useEffect(() => {
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
      if (route.params?.savedPage !== undefined) {
        console.log('Restoring page from params:', route.params.savedPage);
        setCurrentPage(route.params.savedPage);
        navigation.setParams({ savedPage: undefined });
      }
      
      loadSavedData();
    });
    
    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    if (history.length === 365) {
      setShowCompletionModal(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [history]);

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
      const savedHistory = await AsyncStorage.getItem('savingHistory');
      const savedCircles = await AsyncStorage.getItem('selectedCircles');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length === 365) {
          setShowCompletionModal(true);
        }
      }
      if (savedCircles) {
        setSelectedCircles(JSON.parse(savedCircles));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };
  
  const saveData = async (newHistory, newSelectedCircles) => {
    try {
      await AsyncStorage.setItem('savingHistory', JSON.stringify(newHistory));
      await AsyncStorage.setItem('selectedCircles', JSON.stringify(newSelectedCircles));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  const handleCirclePress = (number) => {
    const currentDate = new Date().toLocaleDateString();

    const newSelectedCircles = {
      ...selectedCircles,
      [number]: selectedCircles[number] ? null : require('../assets/check.png')
    };
    setSelectedCircles(newSelectedCircles);

    let newHistory;
    if (selectedCircles[number]) {
      newHistory = history.filter(item => item.number !== number);
    } else {
      newHistory = [...history, { number, date: currentDate }];
    }
    
    setHistory(newHistory);

    saveData(newHistory, newSelectedCircles);
  };
  
  const saveCompletedChallenge = async () => {
    try {
      const savedCompletedChallenges = await AsyncStorage.getItem('completedChallenges');
      let completedChallenges = [];
      
      if (savedCompletedChallenges) {
        completedChallenges = JSON.parse(savedCompletedChallenges);
      }
      
      const newCompletedChallenge = {
        completionDate: new Date().toLocaleDateString(),
        history: [...history],
        totalAmount: calculateTotalAmount()
      };
      
      completedChallenges.push(newCompletedChallenge);
      
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    } catch (error) {
      console.error('Error saving completed challenge:', error);
    }
  };
  
  const resetAllCircles = async () => {
    if (history.length === 365) {
      await saveCompletedChallenge();
    }
    
    setSelectedCircles({});
    setHistory([]);
    setCurrentPage(0);
    saveCurrentPage(0);
    
    await saveData([], {});
    
    closeModal();
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
      
      saveCurrentPage(newPage);
  
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const pages = [];
  const totalNumbers = 365;
  const numbersPerPage = 32;
  
  for (let i = 0; i < totalNumbers; i += numbersPerPage) {
    pages.push(Array.from({ length: Math.min(numbersPerPage, totalNumbers - i) }, (_, j) => i + j + 1));
  }

  const getCurrentPageRows = () => {
    const currentNumbers = pages[currentPage];
    const rows = [];
    for (let i = 0; i < currentNumbers.length; i += 4) {
      rows.push(currentNumbers.slice(i, i + 4));
    }
    return rows;
  };

const navigateToHistory = () => {
  saveCurrentPage(currentPage);
  
  navigation.navigate('History', { 
    history,
    savedPage: currentPage,
    returnToSave365: true,
    sourceScreen: 'save365'
  });
};

  return (
    <View style={styles.container}>
      {/* Logo 区块 */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/LOGO.png')}
          style={styles.logo}
        />
      </View>
      {/* 左箭头 */}
      {currentPage > 0 && (
        <TouchableOpacity 
          style={styles.arrowLeft}
          onPress={() => handlePageChange('prev')}
        >
          <Icon name="arrow-back-ios" size={24} color="#EA4335" />
        </TouchableOpacity>
      )}

      {/* 右箭头 */}
      {currentPage < pages.length - 1 && (
        <TouchableOpacity 
          style={styles.arrowRight}
          onPress={() => handlePageChange('next')}
        >
          <Icon name="arrow-forward-ios" size={24} color="#EA4335" />
        </TouchableOpacity>
      )}

      {/* 数字网格区域 */}
      <View style={styles.calendarContainer}>
        <TouchableOpacity 
          style={styles.arrow}
          onPress={() => handlePageChange('prev')}
          disabled={currentPage === 0}
        >
        </TouchableOpacity>

        <Animated.View style={[styles.numbersContainer, { opacity: fadeAnim }]}>
          {getCurrentPageRows().map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
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
                      source={require('../assets/check.png')}
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

        <TouchableOpacity 
          style={styles.arrow}
          onPress={() => handlePageChange('next')}
          disabled={currentPage === pages.length - 1}
        >
        </TouchableOpacity>
      </View>

      {/* 查看按钮 */}
      <TouchableOpacity 
        style={styles.checkButton}
        onPress={navigateToHistory}
      >
        <Text style={styles.checkButtonText}>查看總共已存金額</Text>
      </TouchableOpacity>

      {/* 底部导航栏 */}
      <View style={styles.menuContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => {
              saveCurrentPage(currentPage);
              navigation.navigate('Accounting', { 
                sourceScreen: 'save365', 
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
          <TouchableOpacity style={styles.iconWrapper}>
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
            <Text style={styles.congratsTitle}>恭喜你完成了365天儲蓄挑戰!</Text>
            <Text style={styles.congratsText}>
              你已經成功存了總共 <Text style={styles.amountText}>${calculateTotalAmount().toLocaleString()}</Text>元
            </Text>            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetAllCircles}
              >
                <Text style={styles.buttonText}>重新開始挑戰</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal:24,
  },
  logoContainer: {
    width: windowWidth,
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
    flexDirection: 'row',
    padding: 24,
  },
  numbersContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#EA4335',
    backgroundColor: '#FFAFAF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#E35D5D',
  },
  number: {
    color: '#EA4335',
    fontSize: 16,
    fontWeight:'bold'
  },
  checkMark: {
    width: 56,
    height: 56,
  },
  checkButton: {
    width: '100%',
    height:50,  
    position: 'absolute',
    bottom: 104, 
    backgroundColor: '#EA4335',
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
    color: '#EA4335',
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
    color: '#ea4335',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: '#ea4335',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  closeButton: {
    backgroundColor: '#ea4335',
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