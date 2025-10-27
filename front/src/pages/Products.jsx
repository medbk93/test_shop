import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  Container,
  Flex,
  Input,
  InputGroup,
  Center,
  SkeletonText,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import CardItem from '@/components/ProductCard';
import { getProducts } from '@/api/products';
import Pagination from '@components/Pagination';

const Products = () => {
  const [productSearchName, setProductSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', currentPage],
    queryFn: () => getProducts(currentPage, { name: productSearchName }),
  });
  const {
    products: productsList,
    totalProducts,
    pageSize,
  } = data || { products: [], totalProducts: 0, pageSize: 10 };

  useEffect(() => {
    const debounceSearchInput = setTimeout(() => {
      refetch();
    }, 1000);

    return () => clearTimeout(debounceSearchInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearchName]);

  return (
    <Container maxW="container.xl">
      <InputGroup startElement={<FiSearch />}>
        <Input
          placeholder="Search products..."
          value={productSearchName}
          onChange={(e) => setProductSearchName(e.target.value)}
          bg="gray.900"
          color="white"
          _placeholder={{ color: 'gray.400' }}
        />
      </InputGroup>

      <Flex gap="6" flexWrap="wrap" padding="6" justify="center">
        {isLoading ? (
          <SkeletonText noOfLines={5} gap="6" />
        ) : (
          productsList?.map((product) => (
            <CardItem key={product.id} product={product} />
          ))
        )}
      </Flex>
      <Center mb={5}>
        <Pagination
          totalProducts={totalProducts}
          currentPage={currentPage}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
        />
      </Center>
    </Container>
  );
};

export default Products;
