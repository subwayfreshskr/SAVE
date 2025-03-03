import React, { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Historycos({ route, navigation }) {
    const [savingsHistory, setSavingsHistory] = useState([]);
    const [totalSavings, setTotalSavings] = useState(0);
    const clearHistory = async () => {
        try {

          Alert.alert(
            "清除歷史紀錄",
            "確定要清除所有存款歷史紀錄嗎？此操作無法復原。",
            [
              {
                text: "取消",
                style: "cancel"
              },
              { 
                text: "確定", 
                onPress: async () => {

                  setSavingsHistory([]);
                  setTotalSavings(0);
                  
                  await AsyncStorage.removeItem('savingsHistory');
                  await AsyncStorage.setItem('totalSavings', '0');
                }
              }
            ]
          );
        } catch (error) {
          console.error('Failed to clear history:', error);
        }
      };

    useEffect(() => {
        const loadSavings = async () => {
          try {
            const savedSavings = await AsyncStorage.getItem('totalSavings');
            if (savedSavings) {
              setTotalSavings(parseFloat(savedSavings));
            }
          } catch (error) {
            console.error('Failed to load savings:', error);
          }
        };
    
        loadSavings();
      }, []);

      useEffect(() => {
        const loadData = async () => {
          try {

            const savedHistory = await AsyncStorage.getItem('savingsHistory');
            if (savedHistory) {
              const historyData = JSON.parse(savedHistory);
              setSavingsHistory(historyData);
              
              const calculatedTotal = historyData.reduce((sum, item) => sum + item.amount, 0);
              setTotalSavings(calculatedTotal);
            }
          } catch (error) {
            console.error('Failed to load data:', error);
          }
        };
      
        loadData();
      }, []);

      useEffect(() => {
        if (route.params?.depositAmounts) {
          const { depositAmounts } = route.params;
          const newSavings = depositAmounts.reduce((sum, item) => sum + item.amount, 0); 
          
          if (newSavings > 0) {
            // Create a new history item
            const currentDate = new Date();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const newHistoryItem = {
              id: Date.now().toString(),
              month: month,
              amount: newSavings
            };
            
            // Update history and save
            const updatedHistory = [...savingsHistory, newHistoryItem];
            setSavingsHistory(updatedHistory);
            saveHistory(updatedHistory);
            
            // Recalculate total from the updated history
            const newTotal = updatedHistory.reduce((sum, item) => sum + item.amount, 0);
            setTotalSavings(newTotal);
          }
        }
      }, [route.params?.depositAmounts]);

      const saveHistory = async (historyData) => {
        try {
          // Save history
          await AsyncStorage.setItem('savingsHistory', JSON.stringify(historyData));
          
          // Calculate and save total based on history
          const total = historyData.reduce((sum, item) => sum + item.amount, 0);
          await AsyncStorage.setItem('totalSavings', total.toString());
        } catch (error) {
          console.error('Failed to save data:', error);
        }
      };
    
      const saveSavings = async (newSavings) => {
    try {
        // Save total savings
        await AsyncStorage.setItem('totalSavings', (totalSavings + newSavings).toString());
        
        // If there's a new savings amount, add to history
        if (newSavings > 0) {
            const currentDate = new Date();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const newHistoryItem = {
                id: Date.now().toString(),
                month: month,
                amount: newSavings
            };
            const updatedHistory = [...savingsHistory, newHistoryItem];
            setSavingsHistory(updatedHistory);
            await AsyncStorage.setItem('savingsHistory', JSON.stringify(updatedHistory));
        }
    } catch (error) {
        console.error('Failed to save data:', error);
    }
};

    const renderSavingsItem = ({ item }) => (
  <View style={styles.historyItem}>
    <Text style={styles.historyMonth}>{item.month}</Text>
    <Text style={styles.historyAmount}>${Math.round(item.amount).toLocaleString()}</Text>
  </View>
);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/* Logo 區塊 */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/LOGO.png')}
                        style={styles.logo}
                    />
                </View>

                {/* 返回按鈕 */}
                <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('savecos', { source: 'Historycos' })}
            >
                <Text style={styles.backText}>返回計畫</Text>
            </TouchableOpacity>

                {/* 存款總額 */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>存款總額</Text>
                    <Text style={styles.totalAmount}>${totalSavings}</Text>
                </View>

                {/* 清除歷史按鈕 */}
                <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                    <Text style={styles.clearButtonText}>清除歷史紀錄</Text>
                </TouchableOpacity>
                
                <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>存款歷史記錄</Text>
                </View>
                
                {savingsHistory.length > 0 ? (
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    {savingsHistory.map(item => (
                        <View key={item.id} style={styles.historyItem}>
                            <Text style={styles.historyMonth}>{item.month}</Text>
                            <Text style={styles.historyAmount}>${Math.round(item.amount).toLocaleString()}</Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>本月還沒有儲蓄記錄</Text>
                </View>
            )}
            </View>

                {/* 底部導航欄 */}
                <View style={styles.menuContainer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Accounting')}>
                            <Image
                                source={require('../assets/account.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.iconText}>記帳</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconWrapper}
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
                                const { sourceScreen } = route.params || {};
                                navigation.navigate('Setting', { sourceScreen: sourceScreen || 'savecos' });
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
        width: '100%',
        height: 100,
        backgroundColor: '#89C2D9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logo: {
        marginTop: 54,
        width: 48,
        height: 48,
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
    totalContainer: {
        width: '85%',
        backgroundColor: '#F0F8FF',
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    totalLabel: {
        fontSize: 16,
        color: '#2A6F97',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    totalAmount: {
        fontSize: 28,
        color: '#014F86',
        fontWeight: 'bold',
    },
    scrollView: {
        width: '100%',
        maxHeight: 385,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    historyContainer: {
        width: '85%',
        marginTop: 24,
        height:200,
        marginBottom: 20,
        flex: 1,
    },
    historyTitle: {
        textAlign:'center',
        fontSize: 20,
        color: '#2A6F97',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    historyList: {
        width: '100%',
        flexGrow: 1,
        height: '100%',
    },
    historyItem: {
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    historyMonth: {
        fontSize: 14,
        color: '#333',
    },
    historyAmount: {
        fontSize: 16,
        color: '#014F86',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: '#606060',
        fontStyle: 'italic',
        textAlign:'center',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    
    historyTitle: {
        fontSize: 20,
        color: '#2A6F97',
        fontWeight: 'bold',
    },
    
    clearButton: {
        width: '85%',
        height:50,  
        position: 'absolute',
        bottom: 104, 
        backgroundColor: '#2A6F97',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 4,
        zIndex: 1,
    },
    
    clearButtonText: {
        textAlign:'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    menuContainer: {
        width: '100%',
        height: 80,
        backgroundColor: '#89C2D9',
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