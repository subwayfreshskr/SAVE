import React, { useState } from 'react';
import { Svg, Text as SVGText } from 'react-native-svg';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const pieChartWidth = screenWidth * 0.85;

const RowItem = ({ leftText, setLeftText, rightNumber, setRightNumber, rowData, setRowData, onDelete, isDeleteMode }) => {
  const [leftBoxFocused, setLeftBoxFocused] = useState(false);
  const [rightBoxFocused, setRightBoxFocused] = useState(false);
  const [isEditingLeft, setIsEditingLeft] = useState(false);
  const [isEditingRight, setIsEditingRight] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const CustomPieChart = ({ data, salary }) => {
    const total = data.reduce((sum, item) => sum + item.population, 0);
    let currentAngle = 0;
  
    return (
      <Svg width={pieChartWidth} height={220}>
        <G x={pieChartWidth / 2} y={110}>
          {data.map((item, index) => {
            const percentage = item.population / total;
            const angle = percentage * 360;
            const radius = 80;
            
            // 計算扇形區域中心點的位置
            const labelAngle = currentAngle + (angle / 2);
            const labelRadius = radius * 0.6; // 調整標籤距離圓心的距離
            const labelX = Math.cos((labelAngle - 90) * Math.PI / 180) * labelRadius;
            const labelY = Math.sin((labelAngle - 90) * Math.PI / 180) * labelRadius;
  
            // 計算金額
            const amount = (parseFloat(salary) || 0) * percentage;
            
            // 創建扇形路徑
            const startX = Math.cos((currentAngle - 90) * Math.PI / 180) * radius;
            const startY = Math.sin((currentAngle - 90) * Math.PI / 180) * radius;
            const endX = Math.cos((currentAngle + angle - 90) * Math.PI / 180) * radius;
            const endY = Math.sin((currentAngle + angle - 90) * Math.PI / 180) * radius;
            
            const path = `
              M 0 0
              L ${startX} ${startY}
              A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${endX} ${endY}
              Z
            `;
  
            const element = (
              <G key={index}>
                <Path
                  d={path}
                  fill={item.color}
                />
                <SVGText
                  x={labelX}
                  y={labelY}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  ${amount.toLocaleString()}
                </SVGText>
              </G>
            );
  
            currentAngle += angle;
            return element;
          })}
        </G>
      </Svg>
    );
  };

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDeleteMode ? 40 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDeleteMode]);

  return (
    <View style={styles.rowContainer}>
      {/* 左側欄位 */}
      <View style={[styles.leftBox,leftBoxFocused && styles.focusedBox]}>
  {isDeleteMode && (
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Icon name="delete" size={20} color="#606060" />
    </TouchableOpacity>
  )}
  {isEditingLeft ? (
    <TextInput
      style={styles.textInput}
      value={leftText}
      onChangeText={setLeftText}
      autoFocus
      onFocus={() => setLeftBoxFocused(true)}
      onBlur={() => {setLeftBoxFocused(false);setIsEditingLeft(false);
      }}
    />
  ) : (
    <TouchableOpacity onPress={() => {
      setIsEditingLeft(true);
      setLeftBoxFocused(true);
    }} 
     style={styles.editableText}>
      <Text style={styles.text}>{leftText}</Text>
      <Icon name="edit" size={20} color="#2A6F97" style={styles.editIcon} />
    </TouchableOpacity>
  )}
</View>


      {/* 右側欄位 */}
      <View style={[styles.rightBox,rightBoxFocused && styles.focusedBox]}>
        {isEditingRight ? (
          <TextInput
            style={styles.textInput}
            value={rightNumber === "0" ? "" : rightNumber}  
            onChangeText={(num) => {
              let sanitizedNumber = num.replace(/^0+/, ""); // 移除前導 0
              if (sanitizedNumber === "") sanitizedNumber = "0";

              // 檢查是否超過 10
              if (parseInt(sanitizedNumber, 10) > 10) {
                Alert.alert("數值不能超過 10，請重新輸入！");
                return;
              }

              // 計算新數值總和
              const newTotal = rowData.reduce((sum, row) => sum + (row.rightNumber === rightNumber ? parseInt(sanitizedNumber, 10) : parseInt(row.rightNumber, 10)), 0);

              if (newTotal > 10) {
                Alert.alert("所有數值總和不能超過 10，請重新輸入！");
                return;
              }

              setRightNumber(sanitizedNumber);
            }}
            keyboardType="numeric"
            autoFocus
            onFocus={() => setRightBoxFocused(true)}
            onBlur={() => {
              setRightBoxFocused(false);
              setIsEditingRight(false);
            }}
          />
        ) : (
          <TouchableOpacity onPress={() => {
            setIsEditingRight(true);
            setRightBoxFocused(true);
          }}>
            <Text style={styles.number}>{rightNumber}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function Savecos({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);
  const [salary, setSalary] = useState('');
  const [rowData, setRowData] = useState([
    { id: 1, leftText: '生活開銷', rightNumber: '6' },
    { id: 2, leftText: '存錢', rightNumber: '3' },
    { id: 3, leftText: '風險管理', rightNumber: '1' },
  ]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const addNewRow = () => {
    if (rowData.length >= 10) {
      Alert.alert("最多只能有 10 個項目！");
      return;
    }
    const newId = rowData.length + 1;
    setRowData([...rowData, { id: newId, leftText: '新項目', rightNumber: '0' }]);
  };

  const deleteRow = (id) => {
    setRowData(rowData.filter((item) => item.id !== id));
  };

  const calculateAmounts = () => {
    const salaryNum = parseFloat(salary) || 0;
    const total = rowData.reduce((sum, item) => sum + parseInt(item.rightNumber, 10), 0);
    
    return rowData.map((item, index) => {
      const ratio = parseInt(item.rightNumber, 10) / total;
      const amount = salaryNum * ratio;
      
      return {
        name: item.leftText,
        amount: amount.toLocaleString(),
        population: parseInt(item.rightNumber, 10),
        color: ['#a9d6e5', '#89c2d9', '#61a5c2', '#468faf', '#2c7da0', '#2a6f97', '#014f86', '#01497c', '#013a63', '#012a4a'][index % 10],
        legendFontColor: '#101010',
        legendFontSize: 12,
      };
    });
  };

  const getChartData = () => {
    const salaryNum = parseFloat(salary) || 0;
    const total = rowData.reduce((sum, item) => sum + parseInt(item.rightNumber, 10), 0);
    
    const colors = ['#a9d6e5', '#89c2d9', '#61a5c2', '#468faf', '#2c7da0', '#2a6f97', '#014f86', '#01497c', '#013a63', '#012a4a'];
    
    return rowData.map((item, index) => {
      const ratio = parseInt(item.rightNumber, 10) / total;
      const amount = salaryNum * ratio;
      
      return {
        name: item.leftText,
        population: parseInt(item.rightNumber, 10),
        amount: amount.toLocaleString(),
        color: colors[index % colors.length],
        legendFontColor: '#101010',
        legendFontSize: 12,
      };
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/LOGO.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>請輸入本月薪水金額</Text>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="輸入金額"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={salary}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            setSalary(numericValue);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          {rowData.map((item) => (
            <RowItem
              key={item.id}
              leftText={item.leftText}
              setLeftText={(text) => {
                const updatedData = rowData.map((row) =>
                  row.id === item.id ? { ...row, leftText: text } : row
                );
                setRowData(updatedData);
              }}
              rightNumber={item.rightNumber}
              setRightNumber={(num) => {
                const updatedData = rowData.map((row) =>
                  row.id === item.id ? { ...row, rightNumber: num === "" ? "0" : num } : row
                );
                setRowData(updatedData);
              }}
              rowData={rowData}
              setRowData={setRowData}            
              onDelete={() => deleteRow(item.id)}
              isDeleteMode={isDeleteMode}
            />
          ))}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={addNewRow}>
              <Icon name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>新增</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteModeButton, isDeleteMode && styles.deleteModeActive]}
              onPress={() => setIsDeleteMode(!isDeleteMode)}
            >
              <Icon name="delete" size={24} color="#fff" />
              <Text style={styles.addButtonText}>{isDeleteMode ? '完成' : '刪除'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartSection}>
            <View style={styles.chartOuterContainer}>
              <View style={styles.chartAndCircleContainer}>
                <PieChart
                  data={getChartData()}
                  width={pieChartWidth}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  center={[screenWidth * 0.15, 0]}
                  absolute
                  hasLegend={false}
                />
              </View>
              <View style={styles.legendContainer}>
                {getChartData().map((data, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: data.color }]} />
                    <Text style={styles.legendText}>{data.name}</Text>
                    <Text style={styles.legendValue}>${data.amount}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
        {/* 查看按鈕 */}
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>查看目前已存金額</Text>
        </TouchableOpacity>

        {/* 底部導航欄 */}
        <View style={styles.menuContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => navigation.navigate('Accounting', { sourceScreen: 'savecos' })}
            >
            <Image
            source={require('../assets/account.png')}
            style={styles.menuIcon}
            />
            <Text style={styles.iconText}>記帳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper}>
                          <Image 
                            source={require('../assets/home.png')}
                            style={styles.menuIcon}
                          />
                          <Text style={styles.iconText}>主頁</Text>
                        </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Setting')}>
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

// 樣式設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 402,
    height: 100,
    backgroundColor: '#89C2D9',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 16,
  },
  input: {
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  inputFocused: {
    borderColor: '#2A6F97',
  },
  scrollView: {
    width: '100%',
    maxHeight: 450,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
    leftBox: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 215,
      height: 50,
      padding: 8,
      borderWidth: 1,
      borderColor: '#aaa',
      borderRadius: 4,
      justifyContent: 'space-between', 
    },    
  editableText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
    color: '#2A6F97',
  },
  editIcon: {
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  text: {
    fontWeight:'bold',
    textAlign: 'left',
    fontSize: 14,
    color: '#2A6F97',
  },
  rightBox: {
    width: 57,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2A6F97',
  },
  focusedBox: {
    borderColor: '#2A6F97',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    gap:24,
    marginTop: 8,
  },
  addButton: { 
    flexDirection: 'row', 
    backgroundColor: '#2A6F97', 
    padding: 8, 
    borderRadius: 4, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    textAlign: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:8,
  },  
  deleteModeButton: { 
    flexDirection: 'row', 
    backgroundColor: '#606060', 
    padding: 8, 
    borderRadius: 4, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModeActive: { 
    backgroundColor: '#606060' 
  },
  checkButton: {
    width: '85%',
    height: 50,
    backgroundColor: '#2A6F97',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkButton: {
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
  },  
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  chartSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 0,
  },
  chartOuterContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chartAndCircleContainer: {
    width: screenWidth * 0.6,
    position: 'relative',
    alignItems: 'center',
  },
  legendContainer: {
    width: screenWidth * 0.35,
    paddingLeft: 0,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#101010',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    color: '#101010',
    marginLeft: 8,
  },
  menuContainer: {
    width: 402,
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
    paddingHorizontal:16,
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