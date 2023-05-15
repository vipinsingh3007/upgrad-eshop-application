import React, { useEffect, useContext } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/authContext';

import './Categories.css';

export default function Categories({ deleteProduct }) {
  const [alignment, setAlignment] = React.useState('all');
  const navigate = useNavigate();

  const { setProducts, fetchProducts, fetchCategories, categoryList } =
    useContext(AuthContext);

  useEffect(() => {
    // getting the categories throug API call when this component is render
    const fetchingCategories = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        console.log(err);
      }
    };

    fetchingCategories();
  }, []);

  // when a product is deleted, updating the category list
  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        console.log(err);
      }
    };

    fetchingCategories();
  }, [deleteProduct]);

  // this is used to sort the products per category
  const handleChange = async (event, newAlignment) => {
    setAlignment(newAlignment);

    // excepting all categories, sort the product per the selected category option
    if (newAlignment !== 'all') {
      await fetchProducts();

      setProducts(products =>
        products.filter(item => item.category.includes(newAlignment)),
      );
    } else {
      try {
        await fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      className="categories"
    >
      <ToggleButton value="all" onClick={() => navigate(`/`)}>
        ALL
      </ToggleButton>
      {/* use category data from the API all on '/categories' to render these buttons */}
      {categoryList.map(item => (
        <ToggleButton value={item} type="submit">
          {item.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
