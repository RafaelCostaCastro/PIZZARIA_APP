import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { cores } from './tema';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditarProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('disponível');

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/produtos/${id}`)
      .then(resp => {
        setDescricao(resp.data.descricao);
        setStatus(resp.data.status);
      });
  }, [id]);

  const atualizarProduto = async () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Descrição obrigatória!');
      return;
    }
    await axios.put(`http://localhost:3000/produtos/${id}`, { descricao, status });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <Text style={styles.label}>Status:</Text>
      <TouchableOpacity
        style={styles.statusRow}
        onPress={() => setStatus(status === 'disponível' ? 'indisponível' : 'disponível')}
      >
        <Icon
          name={status === 'disponível' ? 'check-circle' : 'times-circle'}
          size={24}
          color={status === 'disponível' ? cores.disponivel : cores.indisponivel}
          style={{ marginRight: 8 }}
        />
        <Text style={status === 'disponível' ? styles.statusDisponivel : styles.statusIndisponivel}>
          {status === 'disponível' ? 'Disponível' : 'Indisponível'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao} onPress={atualizarProduto}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, padding: 20 },
  titulo: { fontSize: 24, color: cores.barra, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 16 },
  label: { fontSize: 16, color: cores.texto, marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statusDisponivel: { fontSize: 16, color: cores.disponivel },
  statusIndisponivel: { fontSize: 16, color: cores.indisponivel },
  botao: { backgroundColor: cores.botao, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: cores.botaoTexto, fontWeight: 'bold', fontSize: 16 }
});
