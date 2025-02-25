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
  // 原有的 state
  const [selectedCircles, setSelectedCircles] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [history, setHistory] = useState([]); 
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // 新增完成時的彈窗 state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.5));
  
  const calculateTotalAmount = () => {
    return 66795; // (1 + 365) * 365 / 2
  };

  // 首次加载时设置初始页码
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

  // 监听路由参数变化
  useEffect(() => {
    if (route.params?.savedPage !== undefined) {
      setCurrentPage(route.params.savedPage);
    }
  }, [route.params]);

  // 添加焦点监听器
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
    if (history.length === 365) {
      setShowCompletionModal(true);
      // 执行放大动画
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [history]);

  // 保存当前页码到 AsyncStorage
  const saveCurrentPage = async (page) => {
    try {
      await AsyncStorage.setItem('currentPage', page.toString());
      console.log('Page saved to AsyncStorage:', page);
    } catch (error) {
      console.error('Error saving current page:', error);
    }
  };

  // 从 AsyncStorage 加载数据
  const loadSavedData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('savingHistory');
      const savedCircles = await AsyncStorage.getItem('selectedCircles');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        
        // 检查是否已完成所有 365 个圆圈
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
  
  // 保存数据到 AsyncStorage
  const saveData = async (newHistory, newSelectedCircles) => {
    try {
      await AsyncStorage.setItem('savingHistory', JSON.stringify(newHistory));
      await AsyncStorage.setItem('selectedCircles', JSON.stringify(newSelectedCircles));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  // 处理圆圈选择
  const handleCirclePress = (number) => {
    const currentDate = new Date().toLocaleDateString();

    // 更新选中状态
    const newSelectedCircles = {
      ...selectedCircles,
      [number]: selectedCircles[number] ? null : require('../assets/check.png')
    };
    setSelectedCircles(newSelectedCircles);

    // 更新历史记录
    let newHistory;
    if (selectedCircles[number]) {
      newHistory = history.filter(item => item.number !== number);
    } else {
      newHistory = [...history, { number, date: currentDate }];
    }
    
    setHistory(newHistory);

    // 保存到 AsyncStorage
    saveData(newHistory, newSelectedCircles);
  };
  
  // 保存已完成的挑战到 AsyncStorage
  const saveCompletedChallenge = async () => {
    try {
      // 获取已完成的挑战
      const savedCompletedChallenges = await AsyncStorage.getItem('completedChallenges');
      let completedChallenges = [];
      
      if (savedCompletedChallenges) {
        completedChallenges = JSON.parse(savedCompletedChallenges);
      }
      
      // 添加当前完成的挑战
      const newCompletedChallenge = {
        completionDate: new Date().toLocaleDateString(),
        history: [...history],
        totalAmount: calculateTotalAmount()
      };
      
      completedChallenges.push(newCompletedChallenge);
      
      // 保存到 AsyncStorage
      await AsyncStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    } catch (error) {
      console.error('Error saving completed challenge:', error);
    }
  };
  
  const resetAllCircles = async () => {
    // 在重置前保存当前完成的挑战
    if (history.length === 365) {
      await saveCompletedChallenge();
    }
    
    // 重置所有选中的圆圈
    setSelectedCircles({});
    // 清空历史记录
    setHistory([]);
    // 回到第一页
    setCurrentPage(0);
    saveCurrentPage(0);
    
    // 保存清空的数据到 AsyncStorage
    await saveData([], {});
    
    // 关闭弹窗
    closeModal();
  };

  const closeModal = () => {
    // 关闭弹窗时执行缩小动画
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

  // 生成所有页面的数字
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

  // 处理导航到历史页面，并传递当前页码
  const navigateToHistory = () => {
    // 在导航前保存当前页码
    saveCurrentPage(currentPage);
    
    // 导航到历史页面并传递参数
    navigation.navigate('History', { 
      history,
      savedPage: currentPage,
      returnToSave365: true  // 添加标记，表示需要返回到 Save365
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
            <Text style={styles.iconText}>记帐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image 
              source={require('../assets/home.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.iconText}>主页</Text>
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
            <Text style={styles.iconText}>设定</Text>
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