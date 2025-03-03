import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PasswordInput = ({ 
  placeholder, 
  value, 
  onChangeText 
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && (
        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
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
    borderColor: '#606060',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#101010',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
    zIndex: 10,
    elevation: 10,
  },
});

export default PasswordInput;