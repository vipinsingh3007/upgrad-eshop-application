import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Categories from '../../common/Categories/Categories';
import { Grid, Box, Typography, Chip, TextField, Button } from '@mui/material';
import { AuthContext } from '../../context/authContext';
import { ToastContainer } from 'react-toastify';
import './ProductDetails.css';
import { axios, urlPrefix } from '../../apiConfig';

const ProductDetail = () => {
  const [num, setNum] = useState(1);
  const [product, setProduct] = useState({});
  const location = useLocation();

  const productId = location.pathname.slice(1);
  const navigate = useNavigate();

  const [categoryText, setCategoryText] = useState('');

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token.length === 0) {
      navigate('/login');
    }

    // getting the product per product id through api call
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${urlPrefix}/products/${productId}`);

        setProduct(res.data);
        setCategoryText(res.data.category);
      } catch (e) {
        console.log(e.response);
      }
    };
    fetchProduct();
  }, []);

  // uppercase the 1st character of the category
  const transformedCategory = val => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const transformedTextCategory = transformedCategory(categoryText);

  const navigateToCheckout = () => {
    // passing the product info and order value to the checkout page
    navigate(`/checkout/${productId}`, {
      state: { product, num, transformedTextCategory },
    });
  };

  // navigate to the checkout page after placing an order
  const handlePlaceOrder = () => {
    navigateToCheckout();
  };

  // handling the quantity input
  const handleChange = e => {
    if (e.target.value > 0) {
      setNum(e.target.value);
    }
  };

  return (
    <div className="productDetails">
      <ToastContainer autoClose={2000} theme="colored" />

      <Categories />

      <Box sx={{ flexGrow: 0.5, mx: 16 }} className="details">
        <Grid
          container
          className="productSection"
          display="flex"
          direction="row"
          spacing={4}
          alignItems="flex-start"
        >
          <Grid item xs={4} className="media">
            <img src={product.imageUrl} alt={product.name} />
          </Grid>
          <Grid item sx={{ pl: 6 }} xs={8} className="description">
            <div className="title">
              <Typography variant="h4">{product.name}</Typography>
              <Chip
                label={`Available Quantity: ${product.availableItems}`}
                color="primary"
              />
            </div>
            <div className="descDetails">
              <Typography variant="subtitle1" gutterBottom>
                Categories: <b>{transformedTextCategory}</b>{' '}
              </Typography>
              <Typography variant="body1">{product.description}</Typography>
              <Typography variant="h4" color="secondary">
                <span>&#x20B9;</span> {product.price}
              </Typography>
            </div>

            <Box component="form" className="actions">
              <TextField
                required
                type="number"
                id="outlined-basic"
                label="Enter Quantity"
                variant="outlined"
                value={num}
                onChange={handleChange}
              />

              <Button
                size="medium"
                onClick={handlePlaceOrder}
                className="button"
                variant="contained"
                color="primary"
                sx={{ width: 150, padding: 1 }}
              >
                PLACE ORDER
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ProductDetail;
