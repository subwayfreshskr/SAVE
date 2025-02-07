import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function notify({ navigation }) {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            date: '2025-02-07 14:30',
            title: '您的帳戶已成功更新'
        },
        {
            id: 2,
            date: '2025-02-06 10:15',
            title: '系統維護通知'
        }
    ]);

    const handleExit = () => {
        navigation.navigate('Login');
    };

    const handleClearAll = () => {
        setNotifications([]);
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
                
                <View style={styles.menu}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <TouchableOpacity 
                                key={notification.id} 
                                style={styles.menuItem}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.dateText}>{notification.date}</Text>
                                    <Text style={styles.titleText}>{notification.title}</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color="#606060" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>目前沒有新的通知</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.ExitButton} 
                    onPress={handleClearAll}
                >
                    <Text style={styles.ExitButtonText}>全部刪除</Text>
                </TouchableOpacity>

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
                                source={require('../assets/setting1.png')}
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
        width: 402,
        height: 100,
        backgroundColor: '#F08080',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginTop: 54,
        width: 48,
        height: 48,
    },
    menu: {
        width: '100%',
        flex: 1, // 添加 flex: 1 讓它可以撐開整個空間
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: '#FFD59E',
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50,
    },
    emptyText: {
        fontSize: 14,
        color: '#606060',
        textAlign: 'center',
    },
    textContainer: {
        flexDirection: 'column',
    },
    dateText: {
        fontSize: 12,
        color: '#606060',
        marginBottom: 8,
    },
    titleText: {
        fontSize: 16,
        color: '#101010',
    },
    ExitButton: {
        width: '85%',
        height: 50,
        backgroundColor: '#F08080',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'absolute',
        bottom: 80,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 4,
    },
    ExitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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