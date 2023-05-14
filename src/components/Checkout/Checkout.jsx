import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Grid,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
} from '@mui/material';

import { AddAddress, ConfirmPaper } from '../../common';
import './Checkout.css';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../context/authContext';

const customId = 'custom-id-yes';

const steps = ['Items', 'Select Address', 'Confirm Order'];

// this component is used for the first step of checkout
const OrderInfo = ({ product, qtyC, calTotal, transformedTextCategory }) => {
  const totalPrice = Math.round(product.price * qtyC * 100) / 100;
  calTotal(totalPrice);

  return (
    <Box sx={{ mx: 20, my: 0 }}>
      <Grid sx={{ flexGrow: 1 }} container className="details">
        <Grid item xs={4} className="media">
          <img src={product.imageUrl} alt={product.name} />
        </Grid>
        <Grid item xs={8} className="descriptionOrder">
          <Typography variant="h4" mb={1}>
            {product.name}
          </Typography>
          <Typography variant="body1" mb={1}>
            Quantity: {qtyC}
          </Typography>

          <div className="descDetails">
            <Typography variant="subtitle1" gutterBottom>
              Categories: <b>{transformedTextCategory}</b>{' '}
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              {product.description}
            </Typography>
            <Typography variant="h5" color="secondary">
              Total Price: ${totalPrice}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectItem, setSelectItem] = useState({});
  const { token, currentUser } = useContext(AuthContext);

  // if the user did not login, they will be redirected to login page
  useEffect(() => {
    if (token.length === 0) {
      navigate('/login');
    }
  }, []);

  const { product, num, transformedTextCategory } = location.state;

  // handling the next button
  const handleNext = () => {
    // if there is no address selected at step 1, alert the user
    if (Object.keys(selectItem).length === 0 && activeStep === 1) {
      Alert();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  // handling the go-back button
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    if (activeStep - 1 === 1) {
      setSelectItem({});
    }
  };

  const submitOrder = async e => {
    //fetch user, address from db, for product, get it from product in the location.state
    const input = {
      id: currentUser.id,
      user: currentUser.id,
      product: product.id,
      address: selectItem.id,
      quantity: num,
    };
    e.preventDefault();
    //Posting data to the database below and check if any errors
    try {
      await axios.post('/orders', input, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      navigate('/', { state: { message: 'Order placed successfully!' } });
    } catch (err) {
      console.log(err);
    }
  };

  const Alert = () => {
    toast.error('Please select address!', { toastId: customId });
  };

  return (
    <>
      <Box sx={{ width: '100%', my: 0 }} className="checkout">
        <ToastContainer autoClose={2000} theme="colored" />
        <Box className="checkoutWrap">
          <Stepper activeStep={activeStep} className="steps">
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <OrderInfo
                  product={product}
                  calTotal={setTotalPrice}
                  qtyC={num}
                  transformedTextCategory={transformedTextCategory}
                />
              )}
              {activeStep === 1 && (
                <AddAddress
                  selectItem={selectItem}
                  setSelectItemFunc={setSelectItem}
                  Alert={Alert}
                />
              )}
              {activeStep === 2 && (
                <ConfirmPaper
                  product={product}
                  selectItem={selectItem}
                  totalPrice={totalPrice}
                  qtyC={num}
                  transformedTextCategory={transformedTextCategory}
                />
              )}

              <Box className="backForth">
                <div className="buttons">
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      onClick={submitOrder}
                      className="button2"
                      variant="contained"
                      color="primary"
                    >
                      PLACE ORDER
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="button2"
                      variant="contained"
                      color="primary"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Checkout;
