import {
  IconButton,
  CloseButton,
  Drawer,
  Stack,
  Portal,
  Text,
  Box,
} from '@chakra-ui/react';
import { FiShoppingCart, FiTrash } from 'react-icons/fi';
import CartItem from './CartItem';
import { useCartStore } from '@/store/cartStore';
const CartDrawer = () => {
  const { items, getTotalItems, getCountItems, clear } = useCartStore();
  return (
    <>
      <Drawer.Root placement={{ mdDown: 'bottom', md: 'end' }} size="sm">
        <Drawer.Trigger asChild>
          <IconButton aria-label="Cart">
            <FiShoppingCart />
            <Box
              position="absolute"
              top={0}
              right={0}
              bg="red.500"
              color="black"
              borderRadius="full"
              w={4}
              h={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
            >
              {getCountItems()}
            </Box>
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Your Cart</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack spacing={4} align="stretch" direction="column">
                  {items?.map((product) => (
                    <CartItem key={product.id} product={product} />
                  ))}
                </Stack>
              </Drawer.Body>
              {getCountItems() ? (
                <Drawer.Footer justifyContent={'space-between'}>
                  <IconButton
                    variant={'outline'}
                    _hover={{
                      bg: 'red.500',
                    }}
                    onClick={clear}
                  >
                    <FiTrash />
                  </IconButton>

                  <Text fontWeight="bold">
                    Total: {(getTotalItems() || 0).toFixed(2)} €
                  </Text>
                </Drawer.Footer>
              ) : null}
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};
export default CartDrawer;
