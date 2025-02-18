import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Alert,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const windowWidth = Dimensions.get('window').width;

export default function Accounting({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState([{ items: [] }]);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const today = new Date();
    if (date > today) {
      date = today;
    }
    setCurrentDate(date);
    hideDatePicker();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const updateDisplayRecords = () => {
    const formattedCurrentDate = formatDate(currentDate);
    const allRecords = records[0]?.items || [];
    
    const currentDateRecords = allRecords.filter(record => {
        if (!record || !record.date) return false;
        return record.date === formattedCurrentDate;
    });
    
    setDisplayRecords(currentDateRecords);
};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        const params = navigation.getState().routes.find(
            route => route.name === 'Accounting'
        )?.params;

        if (params?.selectedDate) {
            // 確保使用正確的日期格式
            const newDate = new Date(params.selectedDate);
            if (!isNaN(newDate.getTime())) {
                setCurrentDate(newDate);
            }
        }
        
        // 重新加載記錄
        if (params?.refresh) {
            loadRecords();
        }
    });

    return unsubscribe;
}, [navigation]);

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    updateDisplayRecords();
  }, [currentDate, records]);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const loadRecords = async () => {
    try {
      const savedRecords = await AsyncStorage.getItem('accountingRecords');
      if (savedRecords !== null) {
        const parsedRecords = JSON.parse(savedRecords);
        setRecords(parsedRecords);
      }
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const saveRecords = async (newRecords) => {
    try {
      await AsyncStorage.setItem('accountingRecords', JSON.stringify(newRecords));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  };

  const handleAddRecord = async (newRecord) => {
    // 確保新記錄包含正確的日期
    const recordToAdd = {
      ...newRecord,
      date: formatDate(currentDate) // 使用當前選擇的日期
    };
  
    const updatedRecords = [{
      items: [recordToAdd, ...records[0].items]
    }];
    
    setRecords(updatedRecords);
    await saveRecords(updatedRecords);
  };

  const handleEditRecord = async (editedRecord) => {
    // 確保編輯的記錄保留原始日期
    const updatedRecords = [{
      items: records[0].items.map(record => 
        record.id === editedRecord.id 
          ? { ...editedRecord, date: editedRecord.date || record.date }
          : record
      )
    }];
    
    setRecords(updatedRecords);
    await saveRecords(updatedRecords);
  };

  const handleDeleteRecord = async (recordId) => {
    const updatedRecords = [{
      items: records[0].items.filter(record => record.id !== recordId)
    }];
    
    setRecords(updatedRecords);
    await saveRecords(updatedRecords);
  };

  const resetAllRecords = async () => {
    try {
      await AsyncStorage.removeItem('accountingRecords');
      setRecords([{
        items: []
      }]);
    } catch (error) {
      console.error('Error resetting records:', error);
    }
  };

  useEffect(() => {
    navigation.setParams({
      resetAllRecords: resetAllRecords
    });
  }, [navigation]);

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const handlePrevDate = () => {
    setCurrentDate((prevDate) => {
      let newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDate = () => {
  // 檢查當前選擇的日期是否為今天
  if (isToday(currentDate)) {
    return; // 如果是今天，直接返回不執行任何操作
  }
  
  setCurrentDate((prevDate) => {
    let newDate = new Date(prevDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // 確保不會超過今天
    const today = new Date();
    if (newDate > today) {
      return today;
    }
    return newDate;
  });
};

  const handleNewRecord = () => {
    navigation.navigate('NewRecord', {
      onAddRecord: handleAddRecord
    });
  };

  const handleAnalysis = () => {
    navigation.navigate('Analysis');
  };

  const renderItem = ({ item }) => {
    if (!item || item.amount === null || item.amount === undefined) {
      return null;
    }
    
    const handleEdit = () => {
      navigation.navigate('NewRecord', {
        editMode: true,
        recordData: item,
        onSaveEdit: handleEditRecord,
        onDeleteRecord: handleDeleteRecord
      });
    };
    
    return (
      <View style={styles.recordItem}>
        <View style={styles.recordLeft}>
          <View style={[
            styles.iconBackground,
            { backgroundColor: item.categoryColor }
          ]}>
            <Image 
              source={item.selectedIcon}
              style={styles.recordIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.recordName}>{item.name || '未命名'}</Text>
        </View>
        <View style={styles.recordRight}>
          <Text style={styles.amount}>
            ${typeof item.amount === 'number' ? item.amount.toLocaleString() : '0'}
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Icon name="edit" size={20} color="#40916C" style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
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

        <View style={styles.dateNav}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Image
              source={require('../assets/Vector-1.png')}
              style={styles.dateButtonIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleNextDate}
            disabled={isToday(currentDate)}
          >
            <Image
              source={require('../assets/Vector.png')}
              style={[
                styles.dateButtonIcon,
                isToday(currentDate) && styles.disabledButton
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* 添加 DatePicker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={currentDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />
        
        <View style={styles.content}>
          <FlatList
            data={displayRecords}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            style={styles.flatList}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>還沒有記錄快去新增吧！</Text>
              </View>
            )}
          />
        </View>

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
              source={require('../assets/analyst.png')}
              style={styles.buttonIcon1}
            />
            <Text style={styles.buttonText1}>消費分析</Text>
          </TouchableOpacity>
        </View>

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#40916C',
    marginBottom: 4,
  },
  dateButtonIcon: {
    width: 20,
    height: 20,
  },
  disabledButton: {
    opacity: 0.3,
  },
  dateText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 80,
    maxHeight: 500,
  },
  flatList: {
    flex: 1,
  },
  recordItem: {
    width: '100%',
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
  recordRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    marginLeft: 8,
  },
  amount: {
    fontSize: 16,
    color: '#000000',
  },
  iconBackground: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  recordName: {
    fontSize: 16,
    color: '#000000',
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
    borderRadius: 4,
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
    borderRadius: 4,
  },
  buttonIcon1: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#40916C',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonText1: {
    fontSize: 16,
    color: '#40916C',
  },
  emptyState: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    margin: 16,
    color: '#606060',
    fontSize: 14,
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