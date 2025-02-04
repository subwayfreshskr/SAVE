import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Save365({ navigation }) {
  // 存儲已點擊的圓圈
  const [selectedCircles, setSelectedCircles] = useState({});
  // 當前頁面索引
  const [currentPage, setCurrentPage] = useState(0);
  // 用於滑動動畫的值
  const [slideAnim] = useState(new Animated.Value(0));

  // 導航處理
  const handleLeftArrow = () => {
    handlePageChange('prev');
  };
  
  const handleRightArrow = () => {
    handlePageChange('next');
  };
  
  const handleCirclePress = (number) => {
    setSelectedCircles(prev => ({
      ...prev,
      [number]: prev[number] ? null : require('../assets/check.png') // 切換不同的圖片
    }));
  };

  
  const [fadeAnim] = useState(new Animated.Value(1));

  // 生成所有頁面的數字
  const pages = [];
  const totalNumbers = 365;
  const numbersPerPage = 32;
  
  // 將 1-365 拆分成多個陣列，每頁最多 32 個
  for (let i = 0; i < totalNumbers; i += numbersPerPage) {
    pages.push(Array.from({ length: Math.min(numbersPerPage, totalNumbers - i) }, (_, j) => i + j + 1));
  }
  

  // 將當前頁的數字分成每行4個
  const getCurrentPageRows = () => {
    const currentNumbers = pages[currentPage];
    const rows = [];
    for (let i = 0; i < currentNumbers.length; i += 4) {
      rows.push(currentNumbers.slice(i, i + 4));
    }
    return rows;
  };

  // 處理翻頁
  const handlePageChange = (direction) => {
    if ((direction === 'next' && currentPage >= pages.length - 1) || 
        (direction === 'prev' && currentPage <= 0)) {
      return; // 避免超出範圍
    }
  
    Animated.timing(fadeAnim, {
      toValue: 0.3, // 先淡出
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(prevPage => 
        direction === 'next' ? prevPage + 1 : prevPage - 1
      );
  
      Animated.timing(fadeAnim, {
        toValue: 1, // 再淡入
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  
  return (
    <View style={styles.container}>
      {/* Logo 區塊 */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/LOGO.png')}
          style={styles.logo}
        />
      </View>

      {/* 左箭頭（第一頁不顯示） */}
{currentPage > 0 && (
  <TouchableOpacity 
    style={styles.arrowLeft}
    onPress={() => handlePageChange('prev')}
  >
    <Icon name="arrow-back-ios" size={24} color="#EA4335" />
  </TouchableOpacity>
)}

{/* 右箭頭（最後一頁不顯示） */}
{currentPage < pages.length - 1 && (
  <TouchableOpacity 
    style={styles.arrowRight}
    onPress={() => handlePageChange('next')}
  >
    <Icon name="arrow-forward-ios" size={24} color="#EA4335" />
  </TouchableOpacity>
)}


      {/* 數字網格區域 */}
      <View style={styles.calendarContainer}>
        <TouchableOpacity 
          style={styles.arrow}
          onPress={() => handlePageChange('prev')}
          disabled={currentPage === 0}
        >
        </TouchableOpacity>

        <Animated.View 
  style={[
    styles.numbersContainer,
    { opacity: fadeAnim }
  ]}
>
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

      {/* 查看按鈕 */}
      <TouchableOpacity style={styles.checkButton}>
        <Text style={styles.checkButtonText}>查看目前已存金額</Text>
      </TouchableOpacity>

      {/* 底部導航欄 */}
      <View style={styles.menuContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconWrapper}>
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
          <TouchableOpacity style={styles.iconWrapper}>
            <Image 
              source={require('../assets/setting.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.iconText}>設定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    paddingHorizontal: 24,
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
    width: '85%',
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