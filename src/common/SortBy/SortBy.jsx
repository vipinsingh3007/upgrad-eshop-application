import React from 'react';
import { Box, FormControl, Typography } from '@mui/material';

import './SortBy.css';

import CreatableSelect from 'react-select/creatable';

const sortOptions = [
  { value: 'default', label: 'Default', isFixed: true },
  { value: 'desc', label: 'Price: High to Low' },
  { value: 'asc', label: 'Price: Low to High' },
  { value: 'new', label: 'Newest' },
];

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100,
  }),
};

const SortBy = ({ handleChangeFunc }) => {
  return (
    <div className="sortby">
      <Typography display="inline" variant="body1" align="left">
        Sort by:
      </Typography>
      <Box sx={{ minWidth: 120 }}>
        <FormControl className="sortbyForm">
          <CreatableSelect
            color="primary"
            options={sortOptions}
            clearable={false}
            styles={selectStyles}
            // injecting the selected value to the function from the parent
            onChange={e => handleChangeFunc(e.value)}
          />
        </FormControl>
      </Box>
    </div>
  );
};

export default SortBy;
