import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';

import Header from '@components/Header';
import Products from '@pages/Products';
import NotFoundPage from '@pages/not-found';
import Contact from '@pages/Contact';

function App() {
  return (
    <>
      <Header />
      <Box pt="80px">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
