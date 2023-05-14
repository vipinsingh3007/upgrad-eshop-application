import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from '@mui/material';

import { AuthContext } from '../../context/authContext';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

import './AddressForm.css';

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

const AddressForm = ({ saveAddressFunc }) => {
  const { token, currentUser } = useContext(AuthContext);

  const [message, setMessage] = useState('');

  const [input, setInput] = useState({
    id: currentUser.id,
    name: '',
    contactNumber: '',
    city: '',
    landmark: '',
    street: '',
    state: '',
    zipcode: '',
    user: currentUser.id,
  });

  // getting the addresses per user id
  const fetchAddress = async () => {
    try {
      const res = await axios.get(`/addresses`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      const addressesByUserId = res.data.filter(
        item => item.user === currentUser.id,
      );

      saveAddressFunc(addressesByUserId);
    } catch (err) {
      console.log(err);
    }
  };

  // this function is used to validate the input before address submission
  const fetchAndTestAddress = async () => {
    try {
      const res = await axios.get(`/addresses`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (Object.values(input).filter(val => val === '').length !== 0) {
        setMessage('All fields must not be empty');
        return false;
      }

      // if the contact number is not empty, checking this contact number whether it is duplicated
      if (input.contactNumber !== '') {
        if (res.data.find(add => add.contactNumber === input.contactNumber)) {
          setMessage('This is a duplicated contact number! Try a new one');
          return false;
        }
        // after 3s, the error message disappears
        setTimeout(() => {
          setMessage('');
        }, 6000);

        return true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // getting the addresses by user id when this component is rendered
  useEffect(() => {
    fetchAddress();
  }, []);

  // this function will post the validated address input to the database
  const handleSubmit = async e => {
    e.preventDefault();

    const validatingInput = fetchAndTestAddress();

    if (validatingInput) {
      try {
        //save address in the database
        await axios.post('/addresses', input, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        // after 10s, the successful message disappears
        setTimeout(() => {
          setMessage('');
        }, 10000);

        setMessage('Your address has been saved');
      } catch (err) {
        console.log(err);
      }
      fetchAddress();
    }

    setInput(prev => ({ ...prev, contactNumber: '' }));
  };

  const handleChange = e => {
    // if recieving contact number or zip code input, convert them to string type
    if (e.target.value === 'contactNumber' || e.target.value === 'zipcode') {
      setInput(prev => ({ ...prev, [e.target.name]: e.target.value + '' }));
    } else {
      setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container sx={{ flexGrow: 1 }} component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Add Address
            </Typography>

            <Box component="form" noValidate sx={{ my: 0.5 }}>
              <TextField
                value={input.name}
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                value={input.contactNumber}
                margin="normal"
                required
                fullWidth
                name="contactNumber"
                label="Contact Number"
                type="number"
                autoComplete="lastname"
                onChange={handleChange}
              />
              <TextField
                value={input.email}
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                onChange={handleChange}
              />
              <TextField
                value={input.street}
                margin="normal"
                required
                fullWidth
                name="street"
                label="Street"
                type="street"
                autoComplete="street"
                onChange={handleChange}
              />
              <TextField
                value={input.city}
                margin="normal"
                required
                fullWidth
                name="city"
                label="City"
                type="city"
                autoComplete="city"
                onChange={handleChange}
              />
              <TextField
                value={input.state}
                margin="normal"
                required
                fullWidth
                name="state"
                label="State"
                type="state"
                autoComplete="state"
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="landmark"
                label="Landmark"
                type="landmark"
                autoComplete="landmark"
                onChange={handleChange}
              />
              <TextField
                value={input.zipcode}
                margin="normal"
                required
                fullWidth
                name="zipcode"
                label="Zip Code"
                type="number"
                autoComplete="zipcode"
                onChange={handleChange}
              />
              {message && (
                <Typography variant="body1" color="secondary">
                  {message}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                SAVE ADDRESS
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AddressForm;
