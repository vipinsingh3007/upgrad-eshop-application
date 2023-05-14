import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext.js';

import { Grid } from '@mui/material';
import {
  Product,
  SortBy,
  Categories,
  ConfirmDialog,
} from '../../common/index.js';

import './Home.css';

const Home = () => {
  const [select, setSelect] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const location = useLocation();
  let message = '';

  const { setProducts, fetchProducts, Alert, ToastContainer, products, token } =
    useContext(AuthContext);

  const [deleteProduct, setDeleteProduct] = useState(false);
  const navigate = useNavigate();

  // this is used to invoke alert for successful modification from other pages
  if (location.state !== null) {
    message = location.state.message;
  }

  const fectchingProducts = async () => {
    try {
      await fetchProducts();
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // of the user not logged in, navigate to the login page
    if (token.length === 0) {
      navigate('/login');
    }
    // if there is a message from location, call Alert
    if (location.state !== null) {
      Alert(message, 'success1');
    }
    return () => {
      window.history.replaceState({}, document.title);
    };
  }, []);

  // after deleting a product, the page should be updated with the modified product list
  useEffect(() => {
    fectchingProducts();
  }, [deleteProduct]);

  // this is used for sorting products in the select section
  const handleChange = async val => {
    setSelect(val);
    // sorting product in the ascending order
    if (val === 'asc') {
      setProducts(products =>
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
      );
      // order products in the descending order
    } else if (val === 'desc') {
      setProducts(products =>
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
      );
      // for order the product from the newest
    } else if (val === 'new') {
      // getting the product list from the database and then manipulate the returned array
      try {
        const res = await axios.get('/products');
        // as the newest product is placed at the end of the returned array, reverse the array to make newest sorting
        const newest = res.data.reverse();
        setProducts(newest);
      } catch (err) {
        console.log(err);
      }
    } else if (val === 'default') {
      fectchingProducts();
    }
  };

  return (
    <div className="home">
      <ConfirmDialog />
      <ToastContainer autoClose={2000} theme="colored" />

      {/* passing a function here when there is any action from the users in the categries files */}
      <Categories
        setCurrentCategoryFunc={setCurrentCategory}
        currentCategory={currentCategory}
        deleteProduct={deleteProduct}
      />
      {/* passing the handlechange function for getting the passing value  */}
      <SortBy handleChangeFunc={handleChange} />

      <main className="products">
        <Grid
          container
          spacing={4}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {products?.map(product => (
            <Grid container item key={product.id} xs={12} md={4} lg={4} sm={12}>
              <Product
                product={product}
                Notice={Alert}
                setDeleteProductFunc={setDeleteProduct}
              />
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
};

export default Home;
