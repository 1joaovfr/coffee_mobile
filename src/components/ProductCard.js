import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress, isLowStock }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-md m-2 p-4"
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.imageUrl }}
        className="w-full h-40 rounded-md"
        style={{ objectFit: 'cover' }}
        resizeMode="cover"
      />
      
      <Text className="text-xl font-bold text-slate-800 mt-2">
        {product.name}
      </Text>
      
      <Text className="text-slate-600 mt-1" numberOfLines={2}>
        {product.description}
      </Text>
      
      <Text className="text-lg font-semibold text-emerald-600 mt-2">
        R$ {product.price.toFixed(2).replace('.', ',')}
      </Text>
      
      <Text className="text-sm text-slate-500 mt-1">
        Estoque: {product.quantity} unidades
      </Text>
      
      {isLowStock && (
        <View className="bg-amber-200 px-2 py-1 rounded-full mt-2 self-start">
          <Text className="text-amber-800 font-semibold text-xs">
            ÚLTIMAS UNIDADES!
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProductCard;
