import React,{useRef,useCallback} from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Form }from '@unform/mobile';
import { FormHandles } from '@unform/core';
import api from '../../services/api'
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, BackToSignInButton, BackToSignInText } from './styles';

import logoImg from '../../assets/logo.png';
import getValidationErros from '../../utils/getValidationErrors';

interface SignInFormData {
  name:string;
  email: string;
  telefone: number;
  data_nascimento:Date;
  password: string;
}

const SignUp: React.FC = () => {

  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();



  const emailInputRef = useRef<TextInput>(null);
  const whatsapplInputRef = useRef<TextInput>(null);
  const datanascimentoInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const  handleSignIn = useCallback(async(data: SignInFormData) => {

    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().email('Digite um e-mail válido').required('E-mail obrigatório'),
        telefone: Yup.string().required('WhatsApp obrigatório'),
        data_nascimento: Yup.string().required('Data de nascimento obrigatório'),
        password: Yup.string().required('No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly:false,
      });

      console.log(data);
      await api.post('/users',data)
      //await SignIn({
        //email: data.email,
        //password: data.password
     // })

     Alert.alert('Cadastro realizado com sucesso', 'Você ja pode fazer login na aplicação')
      navigation.goBack();

    }catch (err:any) {
      if(err instanceof Yup.ValidationError){
      const erros  = getValidationErros(err);
      formRef.current?.setErrors(erros);
        return;
    }
      Alert.alert('Erro na autenticação', 'O correu um erro ao fazer login')
    }

  },[navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flex:1}}>
        <Container >
          <Image source={logoImg} />
          <View>
            <Title>Crie sua conta</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignIn} >

          <Input  autoCapitalize='words' name='name' icon='user' placeholder='Nome' returnKeyType="next"
          onSubmitEditing={()=>{
            emailInputRef.current?.focus()
          }}
          />
          <Input
          ref={emailInputRef}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize='none'
          name='email'
          icon='mail'
          placeholder='E-mail'
          returnKeyType="next"
          onSubmitEditing={()=>{
            whatsapplInputRef.current?.focus()
          }}
          />

          <Input
          ref={whatsapplInputRef}
          name='telefone'
          icon='message-circle'
           placeholder='WhatsApp'
           keyboardType='numeric'
           returnKeyType="next"
           onSubmitEditing={()=>{
            datanascimentoInputRef.current?.focus()
          }}
           />


          <Input
          ref={datanascimentoInputRef}
          name='data_nascimento'
          icon='calendar'
          placeholder='Data de nascimento'

          returnKeyType="next"
          onSubmitEditing={()=>{
            passwordInputRef.current?.focus()
          }}
          />

          <Input
          ref={passwordInputRef}
          secureTextEntry
          name='password'
          icon='lock'
          placeholder='Senha'
          textContentType='newPassword'
          returnKeyType='send'
          onSubmitEditing={() => formRef.current?.submitForm()}
          />

          </Form>
          <Button onPress={() => formRef.current?.submitForm()}>Cadastrar</Button>



        </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignInButton onPress={() => navigation.goBack()}>
        <Icon name='arrow-left' size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignInButton>
    </>
  );

};

export default SignUp;
