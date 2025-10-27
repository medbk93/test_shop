import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Image,
  IconButton,
  Text,
  VStack,
  Spacer,
} from '@chakra-ui/react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';

const CartItem = ({ product }) => {
  const {
    getItem,
    update: updateItem,
    remove: removeFromCart,
  } = useCartStore();
  const cartElement = getItem(product.id);
  const [imageSrc, setImageSrc] = useState(
    'https://placehold.co/600x400?text=No%20image'
  );
  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await import(`../assets/image${product.image}`);
        console.log(image);
        setImageSrc(image.default);
      } catch (error) {
        console.error('Error loading image:', error);
        console.log(product.image);
        setImageSrc('https://placehold.co/600x400?text=No%20image'); // Fallback image
      }
    };
    loadImage();
  }, [product.image]);
  return (
    <Flex
      p={4}
      borderWidth="1px"
      borderRadius="md"
      align="center"
      gap={4}
      boxShadow="sm"
    >
      <Image
        src={imageSrc}
        alt={'Product Image'}
        boxSize="80px"
        objectFit="cover"
        borderRadius="md"
      />

      <Flex align="center" gap={2} direction={'column'}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            size="sm"
            variant="outline"
            onClick={() =>
              product.quantity === 1
                ? removeFromCart(product.id)
                : updateItem(product.id, product.quantity - 1)
            }
            _hover={{ bg: 'gray.700' }}
          >
            <FiMinus />
          </IconButton>
          <Text fontWeight="bold">{product.quantity}</Text>
          <IconButton
            _hover={{ bg: 'gray.700' }}
            size="sm"
            onClick={() =>
              product.quantity < 5
                ? updateItem(product.id, product.quantity + 1)
                : null
            }
            variant="outline"
            disabled={product.quantity === 5}
          >
            <FiPlus />
          </IconButton>
        </Box>
        {product.quantity === 5 && (
          <Text fontSize="xs" color="red.500">
            Max 5 items
          </Text>
        )}
      </Flex>

      <Spacer />
      <VStack align="end">
        <Text fontWeight="semibold">{cartElement.name}</Text>
        <Text fontSize="sm">{cartElement.price}€</Text>
      </VStack>
    </Flex>
  );
};

export default CartItem;
