import React, { useState, useEffect, useContext } from 'react';

import SearchIcon from '@mui/icons-material/Search';

import { AuthContext } from '../../context/authContext.js';

import './SearchProduct.css';

const SearchProduct = () => {
  const { setProducts, fetchProducts } = useContext(AuthContext);

  const [input, setInput] = useState('');

  const fetchingProducts = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    // if there is no input in the search bar, the page should display all products
    if (input === '') {
      fetchingProducts();
    }
  }, [input]);

  // handle input from a user in the search bar
  const handleChange = async e => {
    setInput(e.target.value);
    // filter product in accordance to user inputs
    await fetchProducts();
    setProducts(products =>
      products.filter(product =>
        product.name.toLowerCase().includes(input.toLowerCase()),
      ),
    );
  };

  return (
    <>
      <div class="searchContainer">
        <SearchIcon className="searchIcon" />
        <div className="searchField">
          <input
            type="search"
            value={input}
            onChange={handleChange}
            placeholder="Search…"
          />
        </div>
      </div>
    </>
  );
};

export default SearchProduct;
