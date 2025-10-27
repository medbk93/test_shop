import { Button, Card, Flex, Image, Text, Badge, Box } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { addToWishlist, removeFromWishlist } from '@/api/products';
import { useCartStore } from '@/store/cartStore';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [imageSrc, setImageSrc] = useState(null);
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const { add: addToCart, getItem } = useCartStore();
  const cartData = getItem(product.id);

  useEffect(() => {
    if (user && product?.wishlistId) {
      setIsProductInWishlist(true);
    }
  }, [user, product]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await import(`../assets/image${product.image}`);
        setImageSrc(image.default);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc('https://placehold.co/600x400?text=No%20image'); // Fallback image
      }
    };
    loadImage();
  }, [product?.image]);

  const addToWishlistMutation = useMutation({
    mutationFn: (productId) => addToWishlist(productId),
    onError: (error) => {
      toast('An error is occured!');
      console.error('Error adding to wishlist:', error);
    },
    onSuccess: () => {
      setIsProductInWishlist(true);
      toast(`${product.name} added to wishlist!`, {
        type: 'success',
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
  });
  const removeToWishlistMutation = useMutation({
    mutationFn: (productId) => removeFromWishlist(productId),
    onError: (error) => {
      toast('An error is occured!');
      console.error('Error adding to wishlist:', error);
    },
    onSuccess: () => {
      setIsProductInWishlist(false);
      toast(`${product.name} Removed from wishlist!`, {
        type: 'success',
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
  });
  const handleWishlist = async () => {
    if (isProductInWishlist) {
      removeToWishlistMutation.mutate(product.id);
    } else {
      addToWishlistMutation.mutate(product.id);
    }
  };
  const handleCartUpdate = () => {
    addToCart({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      image: product.image,
    });
    toast(`${product.name} Added to cart`, {
      type: 'success',
      closeOnClick: true,
      pauseOnHover: true,
    });
  };
  return (
    <Card.Root maxW="sm" overflow="hidden">
      <Image aspectRatio={4 / 3} width="100%" src={imageSrc} />
      <Card.Body>
        <Flex direction="column" gap="2">
          <Text fontSize="xl" fontWeight="semibold">
            {product?.name || 'Loading...'}
          </Text>
          <Text>{product?.description || 'Product description'}</Text>
          <Text fontSize="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
            {product?.price || '0'} €
          </Text>
        </Flex>
      </Card.Body>
      {user && (
        <Card.Footer display={'block'}>
          <Box>
            <Button
              variant="solid"
              onClick={handleCartUpdate}
              disabled={cartData && cartData.quantity > 4}
            >
              <FiShoppingCart />
              <Badge variant="solid" colorPalette="blue">
                {cartData?.quantity || 0}
              </Badge>
              <Text ml={2}>Add to cart</Text>
            </Button>
            {cartData?.quantity > 4 && (
              <Text fontSize="sm" color="yellow.400">
                You can't buy more than 5 items
              </Text>
            )}
          </Box>
          <Button variant="ghost" onClick={handleWishlist}>
            {isProductInWishlist ? <MdFavorite /> : <MdFavoriteBorder />}
            <Text fontSize={'small'}>
              {addToWishlistMutation.isPending ||
              removeToWishlistMutation.isPending
                ? 'Loading..'
                : `${isProductInWishlist ? 'Remove from' : 'Add to'} wishlist`}
            </Text>
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
};

export default ProductCard;
