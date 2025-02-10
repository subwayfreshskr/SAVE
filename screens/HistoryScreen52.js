import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HistoryScreen52({ route, navigation }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;
    const history = [...(route.params.history || [])].reverse();
    const totalPages = Math.ceil(history.length / itemsPerPage);

    // 計算總金額
    const totalAmount = route.params.history.reduce((sum, item) => sum + Number(item.number), 0);
    const formattedTotalAmount = totalAmount.toLocaleString(); 

    // 獲取當前頁的記錄
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return history.slice(startIndex, startIndex + itemsPerPage);
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

                <Text style={styles.title}>目前已存金額</Text>

                {/* 顯示總金額 */}
                <View style={styles.totalBox}>
                <Text style={styles.totalText}>$ {formattedTotalAmount}</Text>
                </View>

                {/* 返回按鈕 */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('save52')}
                >
                    <Text style={styles.backText}>回上一頁</Text>
                </TouchableOpacity>

                {/* 歷史存款記錄列表 */}
                <View style={styles.recordsContainer}>
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
                                <Icon name="arrow-back-ios" size={24} color="#FBBE0D" />
                            </TouchableOpacity>
                        )}

                        {/* 右箭頭 */}
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
                <View style={styles.picContainer}>
                        <Image
                            source={require('../assets/52周.png')}
                            style={styles.pic}
                        />
                    </View>                    
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
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => navigation.navigate('save365')}
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
        marginBottom: 24,
    },
    logo: {
        marginTop: 54,
        width: 48,
        height: 48,
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
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:16,
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
        height:65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FBBE0D',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    picContainer: {
        position:'absolute',
        bottom: 80,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    pic: {
        width: '100%',
        height: '100%',
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
        left: 0,
    },
    arrowRight: {
        zIndex: 1,
        position: 'absolute',
        right: 0,
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