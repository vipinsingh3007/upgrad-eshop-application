import React, { useEffect, useState, useContext } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useLocalStorage from '../../hooks/useLocalStorage';
import { AuthContext } from '../../context/authContext';

import CreatableSelect from 'react-select/creatable';

import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#ff1744',
    },
  },
});

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100,
  }),
};

const UpdateProduct = () => {
  const [input, setInput] = useState({
    name: '',
    category: '',
    manufacturer: '',
    price: '',
    imageUrl: '',
    description: '',
    availableItems: '',
  });

  const location = useLocation();

  const [messageUpdate, setMessageUpdate] = useState('');

  // getting product id in path name
  const productId = location.pathname.slice(8);

  const [header, setHeader] = useLocalStorage('title', 'Add Product');

  const navigate = useNavigate();

  const { Alert, ToastContainer, token, fetchCategories, categoryList } =
    useContext(AuthContext);

  let categoryOptions = [];

  //
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const fetchingCategories = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        console.log(err);
      }
    };

    fetchingCategories();

    const getProduct = async () => {
      try {
        const res = await axios.get(`/products/${productId}`);
        setInput(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // if there is a product id, the page should be used to modify the product
    if (productId) {
      setHeader('Modify Product');
      // this can help fill in the product info in the text field if the product id exists
      getProduct();
    } else {
      setHeader('Add Product');
    }
  }, []);

  //creating options for selecting dropdown menu
  categoryList?.map(item =>
    categoryOptions.push({
      value: item,
      label: item,
      name: 'category',
    }),
  );

  const handleChange = e => {
    // if the received event from the selecting option is new value, use this input setting
    if (e.__isNew__) {
      setInput(prev => ({ ...prev, [categoryOptions[0].name]: e.value }));
    } else if (e.name) {
      setInput(prev => ({ ...prev, [e.name]: e.value }));
    }
    // if the received event from the normal fields, use this section
    if (e.target) {
      setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // if the current input is not saved in the selecting options, add it to the option list with this condition
  if (
    categoryOptions.filter(item => item.value === input.category.toLowerCase())
      .length === 0
  ) {
    categoryOptions.push({
      value: input.category,
      label: input.category,
      name: 'category',
    });
  }

  // this is used to submit the new product to the database with the put request in the product API
  const handleSubmit = async e => {
    e.preventDefault();

    // checking if there are any empty values in the input before calling api
    if (Object.values(input).filter(val => val === '').length !== 0) {
      setMessageUpdate('All fields must not be empty');
      return false;
    }
    // as dealing with modifying product, we use api with product id to update the respective product
    if (productId) {
      try {
        await axios.put(`/products/${productId}`, input, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ` + token,
          },
        });
      } catch (err) {
        console.log(err);
      }
      //if the modification is successful, we navigate to the home page
      navigate('/', {
        state: { message: `Product ${input.name} modified successfully` },
      });
    } else {
      // if there is no product id, we use post request in the api call to add a new product
      try {
        await axios.post(`/products`, input, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ` + token,
          },
        });
        Alert(`Product ${input.name} added successfully`, 'success2');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer autoClose={2000} theme="colored" />

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              {header}
            </Typography>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              className="productUpdate_form"
            >
              <TextField
                value={input.name}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleChange}
              />

              <CreatableSelect
                className="selectCat"
                name="category"
                value={
                  // if there is a product id, we use the category value from the existing product
                  productId
                    ? categoryOptions.filter(opt =>
                        opt.value.includes(input.category),
                      )
                    : // we check if there is any category input to set the value of this selecting section
                    input.category
                    ? categoryOptions.filter(opt =>
                        opt.value.includes(input.category),
                      )
                    : ''
                }
                options={categoryOptions}
                clearable={false}
                onChange={handleChange}
                styles={selectStyles}
                color="primary"
              />
              <TextField
                value={input.manufacturer}
                margin="normal"
                required
                fullWidth
                name="manufacturer"
                label="Manufacturer"
                type="manufacturer"
                id="manufacturer"
                autoComplete="manufacturer"
                onChange={handleChange}
              />
              <TextField
                value={input.availableItems}
                margin="normal"
                required
                fullWidth
                name="availableItems"
                label="Available Items"
                type="number"
                id="availableItems"
                autoComplete="qavailableItemsty"
                onChange={handleChange}
              />
              <TextField
                value={input.price}
                margin="normal"
                required
                fullWidth
                name="price"
                label="Price"
                type="number"
                id="price"
                autoComplete="price"
                onChange={handleChange}
              />
              <TextField
                value={input.imageUrl}
                margin="normal"
                required
                fullWidth
                name="imageUrl"
                label="Image URL"
                type="imageUrl"
                id="imageUrl"
                autoComplete="imageUrl"
                onChange={handleChange}
              />
              <TextField
                value={input.description}
                margin="normal"
                required
                fullWidth
                name="description"
                label="Product Description"
                type="description"
                id="description"
                autoComplete="description"
                onChange={handleChange}
              />
              {messageUpdate && (
                <Typography variant="body1" color="secondary">
                  {messageUpdate}
                </Typography>
              )}
              <Button
                className="button"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {header.toUpperCase()}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default UpdateProduct;
