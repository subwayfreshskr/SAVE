import {React,useState,useRef} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PasswordInput = ({
  placeholder,
  value,
  onChangeText,
}) => {

   const [isFocused, setIsFocused] = useState(false);
   const [secureTextEntry, setSecureTextEntry] = useState(true);

   const inputRef = useRef(null);

  /*console.log('PasswordInput Props:', {
    placeholder,
    value,
    secureTextEntry,
    isFocused
  });
*/
  const handleEyePress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <TextInput
      ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          console.log('Input focused');
          setIsFocused(true);
        }}
        onBlur={() => {
          console.log('Input blurred');
          setIsFocused(false);
        }}
        autoComplete="off"
        textContentType="oneTimeCode"
        autoCorrect={false}
        spellCheck={false} 
      />
      {/* 根據 isFocused 顯示或隱藏 eye 按鈕 */}
      {isFocused && (
        <TouchableOpacity
          onPress={handleEyePress}
          style={styles.eyeButton}
          activeOpacity={0.7}
        >
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  inputContainerFocused: {
    borderColor: '#000',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  eyeButton: {
    padding: 8, // 增加點擊區域
    marginLeft: 8,
  },
});

export default PasswordInput;
