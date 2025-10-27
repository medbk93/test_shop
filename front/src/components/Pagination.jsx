import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Pagination, ButtonGroup, IconButton } from '@chakra-ui/react';

const PaginationComp = ({
  totalProducts,
  pageSize,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <Pagination.Root
      count={totalProducts}
      pageSize={pageSize}
      defaultPage={currentPage}
      onPageChange={(e) => setCurrentPage(e.page)}
    >
      <ButtonGroup gap="4" size="sm" variant="ghost">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <FiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>
        <Pagination.PageText />
        <Pagination.NextTrigger asChild>
          <IconButton>
            <FiChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
};

export default PaginationComp;
