import React, { useCallback, useRef} from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountText } from './styles';
import logoImg from '../../assets/logo.png';
import getValidationErros from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}
const SignIn: React.FC = () => {


  const formRef = useRef<FormHandles>(null);
  const passowrdInputRef = useRef<TextInput>(null);

  const navigation = useNavigation<any>();


  const {signIn, user} = useAuth();

  console.log(user);
  const  handleSignIn = useCallback(async(data: SignInFormData) => {

    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().email('Digite um e-mail válido').required('E-mail obrigatório'),
        password: Yup.string().required('No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly:false,
      });

      await signIn({
        email: data.email,
        password: data.password
      })


    }catch (err:any) {
      if(err instanceof Yup.ValidationError){
      const erros  = getValidationErros(err);
      formRef.current?.setErrors(erros);
        return;
    }
      Alert.alert('Erro na autenticação', 'O correu um erro ao fazer login')
    }

  },[signIn]);
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>

              <Input
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='email-address'
              name='email'
              icon='mail'
              placeholder='E-mail'
              returnKeyType='next'
              onSubmitEditing={()=>{
                passowrdInputRef.current?.focus();
              }}
              />

              <Input
              ref={passowrdInputRef}
              name='password'
              icon='lock'
              placeholder='Senha'
              secureTextEntry
              returnKeyType='send'
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
               />

            </Form>
            <Button onPress={() => {
              formRef.current?.submitForm();
            }}>Entrar</Button>


            <ForgotPassword onPress={() => { }} >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name='log-in' size={20} color="#ff9000" />
        <CreateAccountText> Criar uma conta</CreateAccountText>
      </CreateAccountButton>
    </>
  );

};

export default SignIn;
