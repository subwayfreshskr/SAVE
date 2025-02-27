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

export default function HistoryScreen52({ route, navigation }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState('current'); // 'current' or 'completed'
    const itemsPerPage = 24;
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState([]);
    
    useEffect(() => {
        loadChallengeData();
    }, []);
    
    // 加載挑戰記錄
    const loadChallengeData = async () => {
        try {
            // 獲取已完成的挑戰
            const savedAllChallenges = await AsyncStorage.getItem('save52AllChallenges');
            if (savedAllChallenges) {
                setCompletedChallenges(JSON.parse(savedAllChallenges));
            }
            
            // 設置當前挑戰
            const history = [...(route.params.history || [])];
            const currentChallengeId = await AsyncStorage.getItem('save52CurrentChallengeId');
            
            if (currentChallengeId) {
                const currentChallengeData = history.filter(item => item.challengeId === currentChallengeId);
                setCurrentChallenge(currentChallengeData);
            } else {
                setCurrentChallenge(history);
            }
        } catch (error) {
            console.error('Error loading challenge data:', error);
        }
    };

    // 根據所選標籤獲取適當的歷史記錄
    const getActiveHistory = () => {
        if (selectedTab === 'current') {
            return [...currentChallenge].reverse();
        } else {
            // 展示所有已完成的挑戰
            return completedChallenges.flatMap(challenge => 
                challenge.history.map(item => ({
                    ...item,
                    challengeDate: challenge.completedDate
                }))
            ).reverse();
        }
    };

    const activeHistory = getActiveHistory();
    const totalPages = Math.ceil(activeHistory.length / itemsPerPage);

    // 計算總金額
    const calculateTotalAmount = () => {
        if (selectedTab === 'current') {
            return currentChallenge.reduce((sum, record) => {
                return sum + Number(record.amount);
            }, 0);
        } else {
            // 計算所有已完成挑戰的總和
            return completedChallenges.reduce((sum, challenge) => {
                return sum + calculateChallengeTotal(challenge.history);
            }, 0);
        }
    };
    
    const calculateChallengeTotal = (history) => {
        return history.reduce((sum, record) => {
            return sum + Number(record.amount);
        }, 0);
    };
    
    const formattedTotalAmount = calculateTotalAmount().toLocaleString();

    // 獲取當前頁的記錄
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return activeHistory.slice(startIndex, startIndex + itemsPerPage);
    };

    // 處理翻頁
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (direction) => {
        if (direction === 'prev') {
            handlePrevPage();
        } else if (direction === 'next') {
            handleNextPage();
        }
    };

    // 切換標籤時重置頁碼
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(1);
    };

    // 渲染已完成挑戰項目
    const renderCompletedChallenges = () => {
        if (completedChallenges.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>還沒有完成的挑戰</Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.completedScrollView} contentContainerStyle={styles.completedContainer}>
                {completedChallenges.map((challenge, index) => (
                    <View key={index} style={styles.completedChallengeCard}>
                        <Text style={styles.completedDate}>完成日期: {new Date(challenge.completedDate).toLocaleDateString()}</Text>
                        <Text style={styles.completedAmount}>挑戰成功金額: ${calculateChallengeTotal(challenge.history).toLocaleString()}</Text>
                        <Text style={styles.completedWeekly}>每周存款金額: ${challenge.salary}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    };

    // 渲染當前挑戰項目
    const renderCurrentChallenge = () => {
        if (activeHistory.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>本次還沒有儲蓄記錄</Text>
                </View>
            );
        }

        return (
            <View style={styles.currentChallengeContainer}>
                <FlatList
                    data={getCurrentPageData()}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => {
                        const dateParts = item.date.split("/");
                        const formattedDate = `${dateParts[0]}/${dateParts[1]}`;

                        return (
                            <View style={styles.record}>
                                <Text style={styles.dateText}>{formattedDate}</Text>
                                <Text style={styles.numberText}>${item.amount}</Text>
                            </View>
                        );
                    }}
                />
                {/* 分頁控制 */}
                {totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                        {currentPage > 1 && (
                            <TouchableOpacity
                                style={styles.arrowLeft}
                                onPress={() => handlePageChange('prev')}
                            >
                                <Icon name="arrow-back-ios" size={24} color="#FBBE0D" />
                            </TouchableOpacity>
                        )}

                        {currentPage < totalPages && (
                            <TouchableOpacity
                                style={styles.arrowRight}
                                onPress={() => handlePageChange('next')}
                            >
                                <Icon name="arrow-forward-ios" size={24} color="#FBBE0D" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

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
                    onPress={() => navigation.navigate('save52')}
                >
                    <Text style={styles.backText}>回上一頁</Text>
                </TouchableOpacity>

                {/* 標籤切換 */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton, 
                            selectedTab === 'current' && styles.activeTab
                        ]}
                        onPress={() => handleTabChange('current')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'current' && styles.activeTabText
                        ]}>目前挑戰</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton, 
                            selectedTab === 'completed' && styles.activeTab
                        ]}
                        onPress={() => handleTabChange('completed')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'completed' && styles.activeTabText
                        ]}>已完成挑戰</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                    {selectedTab === 'current' ? '目前已存金額' : '已完成挑戰總金額'}
                </Text>

                {/* 顯示總金額 */}
                <View style={styles.totalBox}>
                    <Text style={styles.totalText}>$ {formattedTotalAmount}</Text>
                </View>

                {/* 歷史存款記錄列表 */}
                <View style={styles.recordsContainer}>
                    {selectedTab === 'completed' 
                        ? renderCompletedChallenges() 
                        : renderCurrentChallenge()
                    }
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
        backgroundColor: '#EEDA58',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logo: {
        marginTop: 54,
        width: 48,
        height: 48,
    },
    tabContainer: {
        flexDirection: 'row',
        width: '85%',
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#FBBE0D',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FBBE0D',
        marginBottom: 16,
        textAlign: 'center',
    },
    totalBox: {
        width: '85%',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 24,
        borderColor: '#101010',
        borderWidth: 1,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FBBE0D',
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
    recordsContainer: {
        width: '100%',
        height: 500,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    currentChallengeContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    completedContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    completedScrollView: {
        width: '100%',
    },
    completedChallengeCard: {
        width: '85%',
        backgroundColor: '#FFFAEB',
        borderWidth: 2,
        borderColor: '#FBBE0D',
        borderRadius: 4,
        padding: 16,
        marginBottom: 24,
        alignSelf: 'center',
    },
    completedDate: {
        fontSize: 14,
        color: '#101010',
        marginBottom: 8,
    },
    completedAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FBBE0D',
        marginBottom: 8,
    },
    completedWeekly: {
        fontSize: 14,
        color: '#101010',
    },
    emptyContainer: {
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: '#606060',
    },
    row: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 14,
        gap: 14,
    },
    record: {
        borderColor: '#FBBE0D',
        borderWidth: 3,
        backgroundColor: '#F8EAB3',
        padding: 8,
        borderRadius: 50,
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FBBE0D',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '48%',
        width: '100%',
    },
    arrowLeft: {
        zIndex: 1,
        position: 'absolute',
        left: 16,
    },
    arrowRight: {
        zIndex: 1,
        position: 'absolute',
        right: 16,
    },
    menuContainer: {
        width: '100%',
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
});