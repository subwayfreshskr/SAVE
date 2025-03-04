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
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

export default function HistoryScreen({ route, navigation }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState('current');
    const itemsPerPage = 24;
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState([]);
    const [sourceScreen, setSourceScreen] = useState('save365');
    
    useEffect(() => {
        loadCompletedChallenges();
        
        if (route.params?.sourceScreen) {
            setSourceScreen(route.params.sourceScreen);
        }
    }, [route.params]);
    
const loadCompletedChallenges = async () => {
    try {
      const savedCompletedChallenges = await AsyncStorage.getItem('completedChallenges');
      if (savedCompletedChallenges) {
        setCompletedChallenges(JSON.parse(savedCompletedChallenges));
      }
      
      const savedHistory = await AsyncStorage.getItem('savingHistory');
      if (savedHistory) {
        setCurrentChallenge(JSON.parse(savedHistory));
      } else {
        setCurrentChallenge([]);
      }
      
      if (!savedHistory && route.params?.history) {
        setCurrentChallenge([...route.params.history]);
      }
    } catch (error) {
      console.error('Error loading challenges data:', error);
    }
  };

    const getActiveHistory = () => {
        if (selectedTab === 'current') {
            return [...currentChallenge].reverse();
        } else {
            return completedChallenges.flatMap(challenge => 
                challenge.history.map(item => ({
                    ...item,
                    challengeDate: challenge.completionDate
                }))
            ).reverse();
        }
    };

    const activeHistory = getActiveHistory();
    const totalPages = Math.ceil(activeHistory.length / itemsPerPage);
    const calculateTotalAmount = () => {
        if (selectedTab === 'current') {
            return currentChallenge.reduce((sum, item) => sum + Number(item.number), 0);
        } else {

            return completedChallenges.length * 66795;
        }
    };
    
    const formattedTotalAmount = calculateTotalAmount().toLocaleString();

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return activeHistory.slice(startIndex, startIndex + itemsPerPage);
    };
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

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(1);
    };

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
                        <Text style={styles.completedDate}>完成日期: {challenge.completionDate}</Text>
                        <Text style={styles.completedAmount}>挑戰成功金額: ${challenge.totalAmount.toLocaleString()}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    };

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
                                <Text style={styles.dateText}>
                                    {formattedDate}
                                </Text>
                                <Text style={styles.numberText}>${item.number}</Text>
                            </View>
                        );
                    }}
                />
                {/* 分頁控制 - 只有當記錄數超過一頁時才顯示 */}
                {totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                        {/* 左箭頭 */}
                        {currentPage > 1 && (
                            <TouchableOpacity
                                style={styles.arrowLeft}
                                onPress={() => handlePageChange('prev')}
                            >
                                <Icon name="arrow-back-ios" size={24} color="#EA4335" />
                            </TouchableOpacity>
                        )}
                        {/* 右箭頭 */}
                        {currentPage < totalPages && (
                            <TouchableOpacity
                                style={styles.arrowRight}
                                onPress={() => handlePageChange('next')}
                            >
                                <Icon name="arrow-forward-ios" size={24} color="#EA4335" />
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
                    onPress={() => navigation.navigate('save365')}
                >
                    <Text style={styles.backText}>返回計畫</Text>
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
                        <TouchableOpacity 
                            style={styles.iconWrapper}
                            onPress={() => navigation.navigate('Accounting')}
                        >
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
        backgroundColor: '#F08080',
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
        backgroundColor: '#EA4335',
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#EA4355',
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
        color: '#EA4335',
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
    },
    completedScrollView: {
        width: '100%',
    },
    completedChallengeCard: {
        width: '85%',
        backgroundColor: '#FFF0F0',
        borderWidth: 2,
        borderColor: '#EA4335',
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
        color: '#EA4335',
    },
    emptyContainer: {
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: '#606060',
        fontStyle: 'italic',
    },
    row: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 14,
        gap: 14,
    },
    record: {
        borderColor: '#EA4335',
        borderWidth: 3,
        backgroundColor: '#FFAFAF',
        padding: 8,
        borderRadius: 50,
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EA4335',
    },
    dateText: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:'50%',
        width: '100%',
        paddingVertical: 8,
    },
    arrowLeft: {
        position: 'absolute',
        top:'50%',
        left: 16,
    },
    arrowRight: {
        position: 'absolute',
        right: 16,
    },
    menuContainer: {
        width: '100%',
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