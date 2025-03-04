import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

export default function Security({ navigation }) {
  const [isEndReached, setIsEndReached] = useState(false);

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      setIsEndReached(true);
    } else {
      setIsEndReached(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* 返回按鈕 */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Setting')}
        >
          <Text style={styles.backText}>回上一頁</Text>
        </TouchableOpacity>

        {/* Logo 區塊 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/LOGO.png')}
            style={styles.logo}
          />
        </View>

        {/* 標題 */}
        <Text style={styles.title}>隱私權保護政策</Text>

        {/* 可滾動的內容區塊 */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll} 
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false} 
        >
          <Text style={styles.description}>
            {/* 隱私權政策內容 */}
            感謝您使用我們的存錢應用程式（以下稱「本服務」）。我們非常重視您的隱私，並致力於保護您的個人資料。以下是我們的隱私權保護政策，請詳細閱讀，以了解我們如何處理您的個人資料。
            {'\n\n'}一、資料收集
            我們可能會收集以下類型的資料：
            {'\n'}個人識別資訊：例如您的姓名、電子郵件地址、電話號碼等，這些資訊主要用於帳戶註冊與管理。
            {'\n'}應用使用資訊：包括您使用本服務時產生的存款紀錄、目標設定與其他相關操作紀錄。
            {'\n'}設備資訊：例如裝置型號、作業系統版本、IP 位址及其他技術性資料，以提升服務體驗。
            {'\n\n'}二、資料使用
            我們收集的資料將用於以下目的：
            {'\n'}• 提供並維持本服務的正常運作。
            {'\n'}• 個性化您的使用體驗，例如推薦儲蓄目標或工具。
            {'\n'}• 分析數據以改進服務功能與效能。
            {'\n'}• 符合法律義務或主管機關要求。
            {'\n\n'}三、資料分享
            我們絕不會在未經您的同意下向第三方出售或出租您的個人資料。以下情況除外：
            {'\n'}• 合作夥伴：在必要時，我們可能會與受信任的合作夥伴分享資料，例如支付服務提供商，僅限於提供服務所需。
            {'\n'}• 法律需求：若因法律要求或政府命令，我們必須提供您的資料。
            {'\n\n'}四、資料保護
            我們採取以下措施保護您的資料安全：
            {'\n'}• 使用加密技術（如 SSL）保護資料傳輸安全。
            {'\n'}• 限制存取您的個人資料，僅授權員工可存取相關資訊。
            {'\n'}• 定期檢查與更新安全防護措施。
            {'\n\n'}五、您的權利
            {'\n'}• 查詢與請求取得我們所持有的您的個人資料。
            {'\n'}• 請求更新、更正或刪除您的資料。
            {'\n'}• 拒絕特定類型的資料處理活動，例如行銷活動。
            {'\n\n'}六、隱私政策的修改
            我們可能會不時更新本政策，以反映法律規範或服務變更。政策更新後，我們將於應用程式內顯著位置公告。
            {'\n\n'}七、聯絡我們
            如果您對本政策有任何疑問或需要協助，請透過以下方式聯繫我們：
            {'\n'}電子郵件：support@example.com
            {'\n'}電話：+886-123-456-789
            {'\n\n'}感謝您信任我們，我們將全力保護您的個人資料安全！
          </Text>
        </ScrollView>

        {/* 只有當 `isEndReached` 為 false 時才顯示 */}
        {!isEndReached && <Text style={styles.scroll}>請向下滑動閱讀 ⤋⤋⤋</Text>}

        {/* 確認按鈕 */}
        <TouchableOpacity style={styles.ExitButton} onPress={() => navigation.navigate('Setting')}>
          <Text style={styles.ExitButtonText}>確認</Text>
        </TouchableOpacity>

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
            <TouchableOpacity style={styles.iconWrapper}>
              <Image 
                source={require('../assets/home-line.png')}
                style={styles.menuIcon}
              />
              <Text style={styles.iconText}>主頁</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Setting')}>
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
    paddingHorizontal: 24,
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
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#F08080',
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
    color: '#FF6B6B',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxHeight:475,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#606060',
    textAlign: 'left',
  },
  scroll: {
    fontSize: 14,
    color: '#606060',
    textAlign: 'center',
    marginTop: 24,
  },
  ExitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#F08080',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position:'absolute',
    bottom: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
  },
  ExitButtonText: {
    fontSize: 18,
    color: '#fff',
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
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  iconText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
});
