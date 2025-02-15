import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const CATEGORIES = [
  { id: 'food', name: '食物', icon: require('../assets/f.png'), selectedIcon: require('../assets/s-f.png'), color: '#F08080' },
  { id: 'drink', name: '飲品', icon: require('../assets/d.png'), selectedIcon: require('../assets/s-d.png'), color: '#F4A261' },
  { id: 'transport', name: '交通', icon: require('../assets/t.png'), selectedIcon: require('../assets/s-t.png'), color: '#FFBF69' },
  { id: 'shopping', name: '消費', icon: require('../assets/s.png'), selectedIcon: require('../assets/s-s.png'), color: '#74C69D' },
  { id: 'game', name: '娛樂', icon: require('../assets/g.png'), selectedIcon: require('../assets/s-g.png'), color: '#89C2D9' },
  { id: 'phone', name: '3C', icon: require('../assets/p.png'), selectedIcon: require('../assets/s-p.png'), color: '#023E8A' },
  { id: 'home', name: '居家', icon: require('../assets/h.png'), selectedIcon: require('../assets/s-h.png'), color: '#C78DE9' },
  { id: 'medical', name: '醫療', icon: require('../assets/m.png'), selectedIcon: require('../assets/s-m.png'), color: '#FF96B0' },
  { id: 'keep', name: '收入', icon: require('../assets/k.png'), selectedIcon: require('../assets/s-k.png'), color: '#FFE372' },
  { id: 'add', name: '其他', icon: require('../assets/a.png'), selectedIcon: require('../assets/s-a.png'), color: '#8D8D8D' },
];

const CATEGORY_TAGS = {
  food: [
    { id: 'f1', text: '午餐' },
    { id: 'f2', text: '早餐' },
    { id: 'f3', text: '晚餐' },
    { id: 'f4', text: '宵夜' },
    { id: 'f5', text: '零食' },
  ],
  drink: [
    { id: 'd1', text: '咖啡' },
    { id: 'd2', text: '手搖飲' },
    { id: 'd3', text: '茶' },
    { id: 'd4', text: '果汁' },
  ],
  transport: [
    { id: 't1', text: '公車' },
    { id: 't2', text: '捷運' },
    { id: 't3', text: '計程車' },
    { id: 't4', text: '停車費' },
    { id: 't5', text: '加油' },
  ],
  shopping: [
    { id: 's1', text: '衣服' },
    { id: 's2', text: '鞋子' },
    { id: 's3', text: '日用品' },
    { id: 's4', text: '美妝' },
  ],
  game: [
    { id: 'g1', text: '電影' },
    { id: 'g2', text: '遊戲' },
    { id: 'g3', text: 'KTV' },
    { id: 'g4', text: '展覽' },
  ],
  phone: [
    { id: 'p1', text: '手機費' },
    { id: 'p2', text: '網路費' },
    { id: 'p3', text: '配件' },
    { id: 'p4', text: '維修' },
  ],
  home: [
    { id: 'h1', text: '房租' },
    { id: 'h2', text: '水費' },
    { id: 'h3', text: '電費' },
    { id: 'h4', text: '瓦斯費' },
  ],
  medical: [
    { id: 'm1', text: '門診' },
    { id: 'm2', text: '藥品' },
    { id: 'm3', text: '保健品' },
    { id: 'm4', text: '看牙' },
  ],
  keep: [
    { id: 'k1', text: '薪資' },
    { id: 'k2', text: '獎金' },
    { id: 'k3', text: '投資' },
    { id: 'k4', text: '零用金' },
  ],
  add: [
    { id: 'a1', text: '其他收入' },
    { id: 'a2', text: '其他支出' },
    { id: 'a3', text: '雜項' },
  ],
};  

const CustomKeyboard = ({ value, onChange, onSave, onDelete, editMode }) => {
  const handleKeyPress = (key) => {
    if (key === 'done') {
      onSave();
      return;
    }
  
    if (key === 'clear') {
      if (editMode) {
        onDelete();
      } else {
        onChange(''); // 重置為空值，會顯示為 $0
      }
      return;
    }
  
    let newValue = value.replace('$', '').trim();
  
    switch (key) {
      case 'backspace':
        newValue = newValue.slice(0, -1);
        break;
      case '.':
        if (!newValue.includes('.')) {
          newValue += '.';
        }
        break;
      default:
        if (newValue.includes('.')) {
          const [integer, decimal] = newValue.split('.');
          if (decimal && decimal.length >= 2) {
            return;
          }
        }
        if (newValue === '0' && key !== '.') {
          newValue = key;
        } else {
          newValue += key;
        }
    }
  
    onChange(newValue ? `$${newValue}` : '');
  };

  const keyboardKeys = [
    ['7', '8', '9', 'backspace'],
    ['4', '5', '6', 'minus'],
    ['1', '2', '3', 'plus'],
    ['clear', '0', '.', 'done']
  ];

  const renderKey = (key) => {
    let content;
    switch (key) {
      case 'backspace':
        content = '⌫';
        break;
      case 'minus':
        content = '−';
        break;
      case 'plus':
        content = '+';
        break;
        case 'clear':
        content = editMode ? 
          <Image 
            source={require('../assets/trash.png')} 
            style={{ width: 20, height: 20 }} 
          /> : 'C';
        break;
      case 'done':
        content = '✓';
        break;
      default:
        content = key;
    }
    return content;
  };

  return (
    <View style={keyboardStyles.container}>
      {keyboardKeys.map((row, rowIndex) => (
        <View key={rowIndex} style={keyboardStyles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                keyboardStyles.key,
                ['backspace', 'minus', 'plus', 'clear', 'done'].includes(key) && keyboardStyles.specialKey,
                key === 'done' && keyboardStyles.doneKey,
                key === 'clear' && editMode && keyboardStyles.deleteKey // 添加刪除按鈕的特殊樣式
              ]}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={[
                keyboardStyles.keyText,
                ['backspace', 'minus', 'plus', 'clear', 'done'].includes(key) && keyboardStyles.specialKeyText,
                key === 'clear' && editMode && keyboardStyles.deleteKeyText
              ]}>
                {renderKey(key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default function NewRecord({ navigation, route }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showKeyboard, setShowKeyboard] = useState(false);
  const editMode = route.params?.editMode || false;
  const recordData = route.params?.recordData;

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (editMode && recordData) {
      setAmount(`$${recordData.amount}`);
      setDescription(recordData.name);
      setSelectedCategory(recordData.category);
      setCurrentDate(new Date(recordData.date));
    }
  }, [editMode, recordData]);

  const handlePrevDate = () => {
    setCurrentDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const handleSave = async () => {
    const cleanAmount = amount.replace('$', '').trim();
    
    const parsedAmount = parseFloat(cleanAmount);
    if (!cleanAmount || isNaN(parsedAmount)) {
      alert('請輸入有效金額！');
      return;
    }
    
    if (!description) {
      alert('請輸入註解！');
      return;
    }
    
    if (!selectedCategory) {
      alert('請選擇類別！');
      return;
    }
  
    const categoryInfo = CATEGORIES.find(cat => cat.id === selectedCategory);
    
    const record = {
      id: editMode ? recordData.id : Date.now().toString(),
      name: description,
      amount: parsedAmount,
      category: selectedCategory,
      date: formatDate(currentDate),
      selectedIcon: categoryInfo?.selectedIcon,
    };
  
    if (!record.amount || !record.selectedIcon) {
      alert('記錄資料不完整，請重試！');
      return;
    }
  
    if (editMode) {
      if (route.params?.onSaveEdit) {
        await route.params.onSaveEdit(record);
      }
    } else {
      if (route.params?.onAddRecord) {
        await route.params.onAddRecord(record);
      }
    }
  
    setAmount('');
    setDescription('');
    setSelectedCategory('food');
  
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (editMode && recordData && route.params?.onDeleteRecord) {
      Alert.alert(
        '確認刪除',
        '確定要刪除這筆記錄嗎？',
        [
          {
            text: '取消',
            style: 'cancel'
          },
          {
            text: '確定',
            onPress: async () => {
              await route.params.onDeleteRecord(recordData.id);
              navigation.goBack();
            },
            style: 'destructive'
          }
        ]
      );
    }
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
          <TouchableOpacity
            style={styles.amountInput}
            onPress={() => setShowKeyboard(true)}
          >
            <Text style={[styles.amountText, !amount && styles.placeholder]}>
              {amount || '$0'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id
                    ? { backgroundColor: category.color, opacity: 1 }
                    : { backgroundColor: 'transparent' }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Image 
                  source={selectedCategory === category.id ? category.selectedIcon : category.icon} 
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id 
                    ? { color: '#FFFFFF' }
                    : { color: category.color }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Input and Tags */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../assets/note.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="(點選以編輯註解)"
              placeholderTextColor="#aaa"
            />
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScrollContainer}
          >
            {selectedCategory && CATEGORY_TAGS[selectedCategory]?.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={styles.tagButton}
                onPress={() => setDescription(tag.text)}
              >
                <Text style={styles.tagText}>{tag.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <CustomKeyboard 
          value={amount} 
          onChange={setAmount} 
          onSave={handleSave}
          onDelete={handleDelete}
          editMode={editMode}
        />

        {/* Bottom Navigation */}
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

const keyboardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#40916C',
    paddingVertical: 12,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 80,
    width: windowWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  key: {
    width: (windowWidth - 60) / 4,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  keyText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  specialKeyText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#40916C',
    marginBottom: 4,
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
    width: '100%',
  },
  amountInput: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  amountText: {
    fontSize: 32,
    color: '#101010',
  },
  placeholder: {
    color: '#101010',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#40916C',
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginLeft: 24,
  },
  descriptionInput: {
    height: 48,
    textAlign: 'left',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 20,
  },
  tagsScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  tagButton: {
    backgroundColor: '#D8F3DC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: '#40916C',
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    color: '#40916C',
    fontSize: 14,
  },
  categoriesContainer: {
    backgroundColor: '#D8F3DC',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryItem: {
    width: (windowWidth - 64) / 6,
    alignItems: 'center',
    padding: 8,
    margin: 8,
    borderRadius: 4,
  },
  categoryIcon: {
    width: undefined,
    height: 24,
    aspectRatio: 1,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
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