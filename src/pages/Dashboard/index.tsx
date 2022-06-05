import React from 'react';
import {View,Text} from 'react-native'
import { ButtonText } from '../../components/Button/styles';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
//import { Container } from './styles';


const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
return (
<View style={{flex:1, justifyContent: 'center'}}>
<Button onPress={signOut}>Cadastrar</Button>
</View>
);
}

export default Dashboard;
