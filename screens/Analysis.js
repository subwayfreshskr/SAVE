import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;

const categoryMap = {
    'food': '食物',
    'drink': '飲品',
    'transport': '交通',
    'shopping': '消費',
    'game': '娛樂',
    'phone': '3C',
    'home': '居家',
    'medical': '醫療',
    'keep': '收入',
    'add': '其他'
  };

  const categoryOrder = [
    '食物',
    '飲品',
    '交通',
    '消費',
    '娛樂',
    '3C',
    '居家',
    '醫療',
    '收入',
    '其他'
  ];

const categoryColors = {
    '食物': '#F08080',
    '飲品': '#F4A261',
    '交通': '#FFBF69',
    '消費': '#74C69D',
    '娛樂': '#89C2D9',
    '3C': '#023E8A',
    '居家': '#C78DE9',
    '醫療': '#FF96B0',
    '收入': '#FFE372',
    '其他': '#8D8D8D'
  };
  
  const categoryIcons = {
    '食物': require('../assets/s-f.png'),
    '飲品': require('../assets/s-d.png'),
    '交通': require('../assets/s-t.png'),
    '消費': require('../assets/s-s.png'),
    '娛樂': require('../assets/s-g.png'),
    '3C': require('../assets/s-p.png'),
    '居家': require('../assets/s-h.png'),
    '醫療': require('../assets/s-m.png'),
    '收入': require('../assets/s-k.png'),
    '其他': require('../assets/s-a.png'),
  };
  
  export default function Analysis() {
    const navigation = useNavigation(); // 添加这一行
    const [currentDate, setCurrentDate] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [categoryTotals, setCategoryTotals] = useState({});
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    
    useEffect(() => {
      loadRecords();
    }, [currentDate]);
  
    const loadRecords = async () => {
        try {
          const savedRecords = await AsyncStorage.getItem('accountingRecords');
          if (savedRecords) {
            const parsedRecords = JSON.parse(savedRecords);
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            // Filter records for current month
            const monthRecords = parsedRecords[0].items.filter(record => {
              const recordDate = new Date(record.date);
              return recordDate.getMonth() === currentMonth && 
                     recordDate.getFullYear() === currentYear;
            });
    
            calculateTotals(monthRecords);
          }
        } catch (error) {
          console.error('Error loading records:', error);
        }
      };
    
      const calculateTotals = (monthRecords) => {
        const totals = {};
        let incomeAmount = 0;  // 收入類別的總金額
        let expenseAmount = 0; // 其他類別的總金額
        
        monthRecords.forEach(record => {
          if (!record || !record.category) return;
          
          // 將英文類別轉換為中文
          const chineseCategory = categoryMap[record.category] || record.category;
          const amount = Number(record.amount) || 0;
          
          if (amount > 0) {
            // 更新類別總額
            if (totals[chineseCategory]) {
              totals[chineseCategory] += amount;
            } else {
              totals[chineseCategory] = amount;
            }
      
            // 分別計算收入和支出
            if (record.category === 'keep' || chineseCategory === '收入') {
              incomeAmount += amount;
            } else {
              expenseAmount += amount;
            }
          }
        });
      
        const income = incomeAmount - expenseAmount;
        
        setCategoryTotals(totals);
        setTotalExpense(expenseAmount);
        setTotalIncome(income);
      };

      const getSortedCategories = (totals) => {
        return Object.entries(totals)
          .sort(([categoryA], [categoryB]) => {
            const indexA = categoryOrder.indexOf(categoryA);
            const indexB = categoryOrder.indexOf(categoryB);
            return indexA - indexB;
          });
      };
    
  
    const handlePrevMonth = () => {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() - 1);
        return newDate;
      });
    };
  
    const handleNextMonth = () => {
      const today = new Date();
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate > today ? today : newDate;
      });
    };
  
    const formatMonth = (date) => {
      return `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, '0')}月`;
    };
  
    const chartData = getSortedCategories(categoryTotals)
    .filter(([category]) => category !== '收入' && categoryTotals[category] > 0)
    .map(([category, amount]) => ({
      name: category,
      population: amount,
      color: categoryColors[category],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  
    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };
  
    const handleNewRecord = () => {
      navigation.navigate('NewRecord');
    };
  
    const handleAccounting = () => {
      navigation.navigate('Accounting');
    };
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/LOGO.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.dateNav}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Image
            source={require('../assets/Vector-1.png')}
            style={styles.dateButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatMonth(currentDate)}</Text>
        <TouchableOpacity 
          onPress={handleNextMonth}
          disabled={currentDate.getMonth() === new Date().getMonth()}
        >
          <Image
            source={require('../assets/Vector.png')}
            style={[
              styles.dateButtonIcon,
              currentDate.getMonth() === new Date().getMonth() && styles.disabledButton
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chartSection}>
      <Text style={styles.totalAmount}>
        {income > 0 ? `+${income.toLocaleString()}` : income.toLocaleString()}
      </Text>
      <View style={styles.chartContainer}>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={windowWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            center={[windowWidth / 4, 0]}
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>本月還沒有支出記錄</Text>
        )}
      </View>
    </View>

      <ScrollView style={styles.categoryListContainer}>
        <View style={styles.categoryList}>
          {getSortedCategories(categoryTotals)
            .filter(([category]) => categoryTotals[category] > 0)
            .map(([category, amount]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.iconBackground, { backgroundColor: categoryColors[category] }]}>
                    <Image 
                      source={categoryIcons[category]}
                      style={styles.categoryIcon}
                    />
                  </View>
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>
                  ${amount.toLocaleString()}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>
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
                  style={[styles.actionButton, styles.AccountingButton]}
                  onPress={handleAccounting}
                >
                  <Image
                    source={require('../assets/history.png')}
                    style={styles.buttonIcon1}
                  />
                  <Text style={styles.buttonText1}>記帳紀錄</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#40916C',
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
  chartSection: {
    alignItems: 'center',
  },
  totalAmount: {
    paddingTop:8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#40916C',
  },
  chartContainer: {
    margin:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  categoryListContainer: {
    maxHeight: 250,
    width: '100%',
  },
  categoryList: {
    flex:1,
    paddingHorizontal:16,
  },
  categoryItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D8F3DC',
    borderRadius: 4,
    marginVertical: 4,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: 32,
  height: 32,
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  },
  categoryIcon: {
    width: 24,
    height: 24,
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
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
  AccountingButton: {
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