import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CadastroProdutoScreen from './screens/CadastroProdutoScreen';
import EditarProdutoScreen from './screens/EditarProdutoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Cardápio da Pizzaria' }} />
        <Stack.Screen name="CadastroProdutoScreen" component={CadastroProdutoScreen} options={{ title: 'Novo Produto' }} />
        <Stack.Screen name="EditarProdutoScreen" component={EditarProdutoScreen} options={{ title: 'Editar Produto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
