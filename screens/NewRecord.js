import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const CATEGORIES = [
  { id: 'food', name: '食物', icon: require('../assets/f.png'), color: '#F08080' },
  { id: 'drink', name: '飲品', icon: require('../assets/d.png'), color: '#F4A261' },
  { id: 'transport', name: '交通', icon: require('../assets/t.png') , color: '#FFBF69'},
  { id: 'shopping', name: '消費', icon: require('../assets/s.png'), color: '#74C69D' },
  { id: 'game', name: '娛樂', icon: require('../assets/g.png'), color: '#89C2D9' },
  { id: 'phone', name: '3C', icon: require('../assets/p.png'), color: '#023E8A' },
  { id: 'home', name: '居家', icon: require('../assets/h.png'), color: '#C78DE9' },
  { id: 'medical', name: '醫療', icon: require('../assets/m.png'), color: '#FF96B0' },
  { id: 'keep', name: '收入', icon: require('../assets/k.png'), color: '#FFE372' },
  { id: 'add', name: '其他', icon: require('../assets/a.png'), color: '#8D8D8D' },
];


export default function NewRecord({ navigation, route }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setSelectedCategories({ [categoryId]: true }); // 只保留當前選取的分類
  };  

  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const handleSave = async () => {
    if (!amount || !description || !selectedCategory) {
      // 可以加入提示使用者填寫完整資訊的邏輯
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      name: description,
      amount: parseFloat(amount),
      icon: CATEGORIES.find(cat => cat.id === selectedCategory).icon,
    };

    if (route.params?.onAddRecord) {
      await route.params.onAddRecord(newRecord);
    }

    navigation.goBack();
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
         {/* 返回按鈕 */}
         <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Accounting')}
                  >
                    <Text style={styles.backText}>回上一頁</Text>
                  </TouchableOpacity>
          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="請輸入金額"
              placeholderTextColor="#888"
            />
          </View>
           {/* Categories */}
           <View style={styles.categoriesContainer}>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
           <TouchableOpacity
           key={category.id}
           style={[styles.categoryItem, selectedCategory === category.id && styles.selectedCategory]}
           onPress={() => setSelectedCategory(category.id)}
         >
           <Image source={category.icon} style={styles.categoryIcon} />
           <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
         </TouchableOpacity>     
              ))}
            </View>
          </View>
          {/* Description Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="請輸入描述"
              placeholderTextColor="#888"
            />
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
  inputContainer: {
    width:'100%',
  },
  amountInput: {
    textAlign:'right',
    borderRadius: 4,
    padding: 24,
    fontSize: 16,
  },
  descriptionInput: {
    textAlign:'right',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical:16,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor:'#D8F3DC',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryItem: {
    width: (windowWidth - 64) /6,
    alignItems: 'center',
    padding:8,
    margin: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCategory: {
    backgroundColor: '#40916C',
    borderColor: '#40916C',
  },
  categoryIcon: {
    width: undefined,
    height: 24,
    aspectRatio: 1,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize:8,
    color: '#2D3748',
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