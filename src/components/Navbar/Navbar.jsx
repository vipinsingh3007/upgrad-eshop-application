import React, { useContext } from 'react';

import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

import { ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import { SearchProduct } from '../../common/index.js';

import { AuthContext } from '../../context/authContext.js';

import './Navbar.css';

const Navbar = () => {
  const { logout, currentUser, token } = useContext(AuthContext);

  let currentRole;

  // getting the role of the current user for authorization
  if (Object.keys(currentUser).length !== 0) {
    currentRole = currentUser?.roles[0]?.name;
  } else {
    currentRole = '';
  }

  const navigate = useNavigate();

  // logging out and navigate to the login page
  const handleLogOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar className="navContent">
          <div className="logo">
            <ShoppingCart
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></ShoppingCart>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              upGrad E-Shop
            </Typography>
          </div>

          {/* after authentication and authorization, use this section */}
          {token ? (
            <>
              <SearchProduct className="search" />
              <div className="buttons">
                <Link className="linkNav" to="/" color="inherit">
                  Home
                </Link>
                {currentRole === 'ADMIN' && (
                  <Link className="linkNav" to="/update" color="inherit">
                    Add Product
                  </Link>
                )}
                <Button
                  onClick={handleLogOut}
                  variant="contained"
                  color="secondary"
                >
                  LOGOUT
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Link className="linkNav" to="/login" color="inherit">
                  Login
                </Link>
                <Link className="linkNav" to="/signup" color="inherit">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
