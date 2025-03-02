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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Historycos({ route, navigation }) {
    const [savingsHistory, setSavingsHistory] = useState([]);
    const [totalSavings, setTotalSavings] = useState(0);

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
        // Check if depositAmounts are passed via route
        if (route.params?.depositAmounts) {
          const { depositAmounts } = route.params;
          const newSavings = depositAmounts.reduce((sum, item) => sum + item.amount, 0); // Sum the amounts
          setTotalSavings(prevSavings => prevSavings + newSavings);
          saveSavings(newSavings);
        }
      }, [route.params?.depositAmounts]);
    
      const saveSavings = async (newSavings) => {
        try {
          await AsyncStorage.setItem('totalSavings', (totalSavings + newSavings).toString());
        } catch (error) {
          console.error('Failed to save savings:', error);
        }
      };

    const renderSavingsItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text style={styles.historyMonth}>{item.month}</Text>
            <Text style={styles.historyAmount}>${item.amount.toLocaleString()}</Text>
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
                    onPress={() => navigation.navigate('savecos')}
                >
                    <Text style={styles.backText}>回上一頁</Text>
                </TouchableOpacity>

                {/* 存款總額 */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>存款總額</Text>
                    <Text style={styles.totalAmount}>${totalSavings.toFixed(2)}</Text>
                </View>

                {/* 存款歷史記錄 */}
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>存款歷史記錄</Text>
                    
                    {savingsHistory.length > 0 ? (
                        <FlatList
                            data={savingsHistory}
                            renderItem={renderSavingsItem}
                            keyExtractor={item => item.id}
                            style={styles.historyList}
                        />
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
        width: '90%',
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
    historyContainer: {
        width: '85%',
        marginTop: 24,
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
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
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