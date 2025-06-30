import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { cores } from './tema';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter, useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  // Atualiza a lista sempre que a tela volta ao foco
  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  const carregarProdutos = async () => {
    const resp = await axios.get('http://localhost:3000/produtos');
    setProdutos(resp.data);
  };

  const deletarProduto = async (id) => {
    await axios.delete(`http://localhost:3000/produtos/${id}`);
    carregarProdutos();
  };

  const produtosFiltrados = produtos.filter(p => {
    if (filtro === 'todos') return true;
    return p.status === filtro;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cardápio da Pizzaria</Text>
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'todos' && styles.filtroAtivo]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={styles.filtroTexto}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'disponível' && styles.filtroAtivo]}
          onPress={() => setFiltro('disponível')}
        >
          <Text style={styles.filtroTexto}>Disponíveis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === 'indisponível' && styles.filtroAtivo]}
          onPress={() => setFiltro('indisponível')}
        >
          <Text style={styles.filtroTexto}>Indisponíveis</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopo}>
              <Icon
                name={item.status === 'disponível' ? 'check-circle' : 'times-circle'}
                size={24}
                color={item.status === 'disponível' ? cores.disponivel : cores.indisponivel}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.descricao}>{item.descricao}</Text>
            </View>
            <Text style={item.status === 'disponível' ? styles.statusDisponivel : styles.statusIndisponivel}>
              {item.status === 'disponível' ? 'Disponível' : 'Indisponível'}
            </Text>
            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => router.push(`/editar?id=${item.id}`)}
              >
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => deletarProduto(item.id)}
              >
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => router.push('/cadastro')}
      >
        <Text style={styles.botaoTexto}>Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, padding: 16 },
  titulo: { fontSize: 28, color: cores.barra, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  filtros: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  filtroBotao: { padding: 8, marginHorizontal: 4, borderRadius: 6, backgroundColor: '#fff' },
  filtroAtivo: { backgroundColor: cores.botao },
  filtroTexto: { fontWeight: 'bold', color: cores.texto },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }),
  },
  cardTopo: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  descricao: { fontSize: 18, color: cores.texto, fontWeight: 'bold' },
  statusDisponivel: { fontSize: 14, color: cores.disponivel, marginVertical: 4 },
  statusIndisponivel: { fontSize: 14, color: cores.indisponivel, marginVertical: 4 },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botaoEditar: { backgroundColor: cores.botao, padding: 8, borderRadius: 5, marginRight: 8 },
  botaoExcluir: { backgroundColor: cores.barra, padding: 8, borderRadius: 5 },
  botaoTexto: { color: cores.botaoTexto, fontWeight: 'bold' },
  botaoAdicionar: { backgroundColor: cores.barra, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});
