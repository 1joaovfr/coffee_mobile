import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '../validation/orderSchema';
import api from '../api/axiosConfig';

const OrderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const orderData = {
        items: [
          {
            productId: product.id,
            quantity: data.quantity,
          },
        ],
      };

      await api.post('/orders', orderData);
      
      Alert.alert(
        'Sucesso!',
        'Pedido realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao fazer pedido:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.error === 'Estoque insuficiente') {
          Alert.alert(
            'Estoque Insuficiente',
            `Estoque insuficiente para '${errorData.productName}'. Máximo disponível: ${errorData.availableStock} unidades.`
          );
        } else {
          Alert.alert('Erro', errorData.error || 'Erro ao processar pedido');
        }
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível processar o pedido. Tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="p-4">
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-64 rounded-lg"
          style={{ objectFit: 'cover' }}
          resizeMode="cover"
        />
        
        <Text className="text-2xl font-bold text-slate-800 mt-4">
          {product.name}
        </Text>
        
        <Text className="text-slate-600 mt-2 text-base leading-6">
          {product.description}
        </Text>
        
        <Text className="text-2xl font-bold text-emerald-600 mt-4">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </Text>
        
        <Text className="text-sm text-slate-500 mt-2">
          Estoque disponível: {product.quantity} unidades
        </Text>
        
        {product.isLowStock && (
          <View className="bg-amber-200 px-3 py-2 rounded-lg mt-3">
            <Text className="text-amber-800 font-semibold text-center">
              ⚠️ ÚLTIMAS UNIDADES DISPONÍVEIS!
            </Text>
          </View>
        )}
        
        <View className="mt-6">
          <Text className="text-lg font-semibold text-slate-800 mb-2">
            Quantidade:
          </Text>
          
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-white border border-slate-300 text-slate-900 text-lg rounded-lg p-3 w-full"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={value?.toString()}
                keyboardType="numeric"
                placeholder="Digite a quantidade"
                maxLength={3}
              />
            )}
          />
          
          {errors.quantity && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          className="bg-emerald-500 py-3 px-5 rounded-lg mt-6"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-center text-lg">
              Fazer Pedido
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderScreen;
