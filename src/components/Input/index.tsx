import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';


import { Container, TexteInput, Icon } from './styles';
import { useWorkletCallback } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef,InputProps> = ({ name, icon, ...rest }, ref) => {

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  },[]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value)
  },[]);

  const inputElementRef = useRef<any>(null);
  const {registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({value:defaultValue});

  useImperativeHandle(ref, () => ({
      focus(){
        inputElementRef.current.focus()
      }
  }));




  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNative({ text: value});
        inputElementRef.current.clear();
      },
      clearValue(){
        inputValueRef.current.value = '';
      }
    })
  },[fieldName, registerField]);

  return (
    <Container  isFocused={isFocused} isErrored={!!error}>
      <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
      <TexteInput
      ref={inputElementRef}
      keyboardAppearance='dark'
      placeholderTextColor="#666360"
      defaultValue={defaultValue}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onChangeText={(value) => {
        inputValueRef.current.value = value;
      }}
      {...rest} />
    </Container>
  )
}
  ;

export default forwardRef(Input);
