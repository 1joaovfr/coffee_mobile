import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleProductPress = (product) => {
    navigation.navigate('Order', { product });
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      isLowStock={item.isLowStock}
    />
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <Text className="text-lg text-slate-600">Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <Text className="text-3xl font-bold text-slate-800 m-4">
        Nossos Produtos
      </Text>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ProductListScreen;
