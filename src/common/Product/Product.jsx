import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import './Product.css';
import { confirmDialog } from '../ConfirmDialog/ConfirmDialog';

const Product = props => {
  const { Notice, product, setDeleteProductFunc } = props;
  const { id, name, price, description, imageUrl } = product;
  const navigate = useNavigate();

  const { token, currentUser } = useContext(AuthContext);

  let currentRole;

  if (Object.keys(currentUser).length !== 0) {
    currentRole = currentUser?.roles[0]?.name;
  } else {
    currentRole = '';
  }

  // handle delete button
  const handleDelete = () => {
    //delete method importing from the ComfirmDialog component below
    confirmDialog('Are you sure you want to delete the product?', async () => {
      // API call to delete a product per id
      try {
        await axios.delete(`/products/${id}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ` + token,
          },
        });
        setDeleteProductFunc(prev => !prev);
        Notice(`Product ${name} deleted successfully`);
      } catch (err) {
        console.log(err);
      }
    });
  };

  // if editing a product, navigate to the update product page with the pathname having product id
  const handleEdit = () => {
    navigate(`/update/${id}`, { state: { title: 'Modify Product' } });
  };

  return (
    <Card className="card" sx={{ width: 350, height: 450 }} key={id}>
      <CardMedia
        sx={{ height: 200 }}
        image={imageUrl}
        title={name}
        alt={name}
        key={id}
      />
      <CardContent>
        <div className="cardContent">
          <Typography
            className="productName"
            gutterBottom
            variant="h6"
            component="div"
          >
            {name}
          </Typography>
          <Typography
            className="price"
            gutterBottom
            variant="h6"
            component="div"
          >
            <span>&#x20B9;</span> {price}
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions className="CTA" sx={{ mt: 2 }}>
        <Link className="buy" to={`/${id}`}>
          <Button size="small" variant="contained" color="primary">
            Buy
          </Button>
        </Link>

        {currentRole === 'ADMIN' && (
          <Typography className="adminOps">
            <IconButton aria-label="delete" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>

            <IconButton aria-label="delete" onClick={handleEdit}>
              <EditIcon fontSize="small" onClick={handleEdit} />
            </IconButton>
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default Product;
