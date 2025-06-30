import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { cores } from './tema';
import { useRouter } from 'expo-router';

export default function CadastroProdutoScreen() {
  const router = useRouter();
  const [descricao, setDescricao] = useState('');

  const adicionarProduto = async () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Descrição obrigatória!');
      return;
    }
    await axios.post('http://localhost:3000/produtos', { descricao });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Produto</Text>
      <TextInput
        placeholder="Ex: Pizza Portuguesa"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <TouchableOpacity style={styles.botao} onPress={adicionarProduto}>
        <Text style={styles.botaoTexto}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, padding: 20 },
  titulo: { fontSize: 24, color: cores.barra, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 16 },
  botao: { backgroundColor: cores.botao, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: cores.botaoTexto, fontWeight: 'bold', fontSize: 16 }
});
