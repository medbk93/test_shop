import {
  Box,
  Container,
  Flex,
  Heading,
  Menu,
  Text,
  Avatar,
  Highlight,
  Portal,
} from '@chakra-ui/react';
import { Link } from 'react-router';
import { FaRegUserCircle } from 'react-icons/fa';
import CartDrawer from './CartDrawer';
import { useAuth } from '@/context/AuthContext.jsx';
import { loginUser, logoutUser } from '@/api/auth';
import { DEFAULT_CREDENTIALS } from '@/utils/constants';
const Header = () => {
  const { user, setUser, setAccessToken } = useAuth();
  const handleLogin = async () => {
    const { accessToken, id, email, isAdmin } = await loginUser(
      DEFAULT_CREDENTIALS
    );
    setAccessToken(accessToken);
    setUser({ id, email, isAdmin });
  };
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
  };
  return (
    <Box
      as="header"
      bg="blue.300"
      borderBottom="1px"
      borderColor="gray.200"
      py={4}
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link to="/">
            <Heading size="3xl" letterSpacing="tight">
              <Highlight query="Shop" styles={{ color: 'teal.600' }}>
                AltenShop
              </Highlight>
            </Heading>
          </Link>

          <Flex gap={4} align="center">
            <Link to="/contact">
              <Text
                fontSize="md"
                color="gray.600"
                _hover={{ color: 'gray.800' }}
              >
                Contact
              </Text>
            </Link>
            {user && <CartDrawer />}
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm" cursor="pointer">
                  {user ? (
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                  ) : (
                    <FaRegUserCircle size={32} />
                  )}
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {user && (
                      <Menu.Item cursor="pointer" value="user_email">
                        {user.email}
                      </Menu.Item>
                    )}
                    {user ? (
                      <Menu.Item
                        cursor="pointer"
                        value="logout"
                        onClick={handleLogout}
                      >
                        Logout
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        cursor="pointer"
                        value="logout"
                        onClick={handleLogin}
                      >
                        Login
                      </Menu.Item>
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
