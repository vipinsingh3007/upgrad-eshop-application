import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import './ConfirmPaper.css';

const Confirm = ({
  product,
  totalPrice,
  selectItem,
  qtyC,
  transformedTextCategory,
}) => {
  return (
    <>
      <Box
        className="confirm"
        sx={{
          display: 'flex',
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          '& svg': {
            m: 1.5,
          },
          '& hr': {
            mx: 0.5,
          },
        }}
      >
        <Grid item className="confirmOrder">
          <Typography>
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
              <Typography variant="body1">{product.description}</Typography>
              <Typography variant="h5" color="secondary">
                Total Price: <span>&#x20B9;</span> {totalPrice}
              </Typography>
            </div>
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid className="address">
          <Typography variant="h4" mb={1}>
            Address Details
          </Typography>
          <Typography variant="body1" mb={1}>
            {selectItem.name}
          </Typography>
          <Typography variant="body1" mb={1}>
            Contact Number: {selectItem.contactNumber}
          </Typography>
          <Typography variant="body1" mb={1}>
            {selectItem.street}, {selectItem.city},
          </Typography>
          <Typography variant="body1" mb={1}>
            {selectItem.state}, {selectItem.landmark},
          </Typography>
          <Typography variant="body1" mb={1}>
            {selectItem.zipcode}
          </Typography>
        </Grid>
      </Box>
    </>
  );
};

export default Confirm;
