import React, { useState } from 'react';

import { Box, FormControl, Typography } from '@mui/material';

import './AddAddress.css';
import AddressForm from '../AddressForm/AddressForm';
import CreatableSelect from 'react-select/creatable';

const selectStyles = {
  menu: base => ({
    ...base,
    zIndex: 100,
    textAlign: 'left',
  }),
};

const SelectAdd = ({ saveAddress, setSelectItemFunc }) => {
  function handleChange(e) {
    setSelectItemFunc(e.value);
  }
  //producing address line in the select section
  const addOptions = saveAddress?.map(item => ({
    value: item,
    label: `${item.name} --> ${item.street}, ${item.city}, ${item.state}, ${item.landmark}`,
  }));

  return (
    <>
      <div className="selectAddWrap">
        <Box className="selectAdd">
          <FormControl className="addressForm">
            <Typography display="inline" variant="body1" align="left">
              Select Address:
            </Typography>
            <CreatableSelect
              options={addOptions}
              clearable={false}
              styles={selectStyles}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
      </div>
      <Typography className="or">-OR-</Typography>
    </>
  );
};

const AddAddress = ({ selectItem, setSelectItemFunc }) => {
  const [saveAddress, setSaveAddress] = useState([]);

  return (
    <>
      {/* a component for selecting an address before submitting an order*/}
      <SelectAdd
        saveAddress={saveAddress} //passing the saved addressed to the select section
        selectItem={selectItem} //passing the selected item for the display of select section of the chosen address
        setSelectItemFunc={setSelectItemFunc} //passing the function from parent to this child for getting the selected address
      />
      <AddressForm
        saveAddressFunc={setSaveAddress} //passing the function to its child for getting the address data
        saveAddress={saveAddress}
      />
    </>
  );
};

export default AddAddress;
