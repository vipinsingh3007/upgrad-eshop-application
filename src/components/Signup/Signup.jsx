import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <a
        color="inherit"
        href="https://www.upgrad.com/vn/"
        target="_blank"
        rel="noreferrer"
      >
        upGrad
      </a>{' '}
      {2021}
      {'.'}
    </Typography>
  );
}

const Signup = () => {
  const [input, setInput] = useState({
    email: '',
    role: ['admin'],
    password: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const navigate = useNavigate();

  const { getUsersContext, newAdminToken, token } = useContext(AuthContext);

  // getting the users for login process
  const gettingUsersData = async newAdminToken => {
    try {
      await getUsersContext(newAdminToken);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, []);
  // This function is used to validate password input
  const validating = password => {
    if (confirmPass.length < 6) {
      setError('Password length should be greater than 6');
      return true;
    } else if (confirmPass !== password) {
      setError('Mismatched password! Try again');
      return true;
    } else {
      return false;
    }
  };

  // save the sign up field value in the input
  const handleChange = e => {
    if (e.target.name === 'contactNumber') {
      setInput(prev => ({ ...prev, [e.target.name]: e.target.value + '' }));
    } else {
      setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  //submit the input via sign up api
  const handleSubmitSignUp = async e => {
    e.preventDefault();

    let userList;

    // in the case of user login, use admin token to get user database
    if (newAdminToken) {
      try {
        const res = await axios.get(`/users`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${newAdminToken}`,
          },
        });

        userList = res.data;
      } catch (e) {
        console.log(e);
      }
    }

    // checking if the email input is existing in the user list
    let checkingEmail = [];
    if (userList) {
      checkingEmail = userList?.filter(user => user.email === input.email);
    }

    const validation = validating(input.password);

    if (checkingEmail.length !== 0) {
      setError('This email has been used');
      return;
    }

    if (Object.values(input).filter(val => val === '').length !== 0) {
      setError('All fields must not be empty');
      return;
    }

    // checking if the password is valid or not before the API call
    if (validation === false) {
      try {
        // sign up for the application
        const res = await axios.post('/auth/signup', input);
        console.log(res);
        //updating the user list with the new added user for login process
        gettingUsersData(newAdminToken);
        navigate('/login');
      } catch (err) {
        console.log(err);
        // when the user first sign up and there is some error, this can help validate the email input without the checking in the database
        setError('This email has been used');
      }
    }
  };

  return (
    <>
      <Navbar />
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              autoFocus
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              type="lastName"
              id="lastName"
              autoComplete="lastName"
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email address"
              type="email"
              id="email"
              autoComplete="email"
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
              onChange={e => setConfirmPass(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contactNumber"
              label="Contact Number"
              type="number"
              id="contact"
              autoComplete="contact"
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmitSignUp}
              color="primary"
            >
              Sign Up
            </Button>
            {error && (
              <Typography variant="body1" color="secondary">
                {error}
              </Typography>
            )}
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Log In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
};

export default Signup;
