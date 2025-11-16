import React from 'react';
import { useCart } from '../context/CartContext';
import { PropertyCard } from '../components/PropertyCard';
import { Icon } from '../components/Icon';
import { useRouter } from '../hooks/useRouter';

export const CartPage: React.FC = () => {
  const { cartItems } = useCart();
  const { navigate } = useRouter();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-serif mb-8">My Cart</h2>
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cartItems.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <Icon name="shopping-cart" className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-2xl font-semibold text-brand-dark">Your Cart is Empty</h3>
            <p className="text-gray-600 mt-2">Browse properties and add them to your cart.</p>
            <button onClick={() => navigate('home')} className="mt-6 bg-brand-green text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors">
              Find Properties
            </button>
        </div>
      )}
    </div>
  );
};