import { createContext, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { axios, urlPrefix } from '../apiConfig';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {},
  );

  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('access-token')) || '',
  );

  const [products, setProducts] = useState([]);

  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem('username')) || '',
  );

  const [role, setRole] = useState(
    JSON.parse(localStorage.getItem('role')) || 'USER',
  );

  const [categoryList, setCategoryList] = useState([]);

  const [newAdminToken, setNewAdminToken] = useState(
    JSON.parse(localStorage.getItem('signin')) || '',
  );

  //getting user list with admin token input
  const getUsersContext = async tokenInput => {
    try {
      const res = await axios.get(`${urlPrefix}/users`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${newAdminToken || tokenInput}`,
        },
      });

      setUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // getting the current user from the use list
  const getCurrentUser = () => {
    const currentUserData = users?.filter(item =>
      item?.email?.includes(username),
    )[0];

    if (currentUserData) {
      setCurrentUser(currentUserData);
      setRole(currentUserData?.roles[0]?.name);
    } else {
      setCurrentUser({});
    }
  };

  // checking if the user signed in is an admin, then save the admin token
  const checkingAdmin = async token => {
    try {
      const res = await axios.get(`${urlPrefix}/users`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // setting user list and admin token with the result from API call on '/users'
      setUsers(res.data);
      setNewAdminToken(token);
    } catch (e) {
      console.log(e);
    }
  };

  const login = async inputs => {
    try {
      const res = await axios.post(`${urlPrefix}/auth/signin`, inputs); ///login
      setToken(res.data.token);
      localStorage.setItem('access-token', JSON.stringify(res.data.token));
      // checking if it is an admin user
      await checkingAdmin(res.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  // getting user list whenever the admin token is changed
  useEffect(() => {
    const gettingUsersData = async newAdminToken => {
      try {
        await getUsersContext(newAdminToken);
      } catch (e) {
        console.log(e);
      }
    };

    gettingUsersData();

    if (users !== []) {
      getCurrentUser();
    }
  }, [newAdminToken]);

  useEffect(() => {
    localStorage.setItem('signin', JSON.stringify(newAdminToken));
  }, [newAdminToken]);

  useEffect(() => {
    localStorage.setItem('access-token', JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    setCurrentUser(currentUser);
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('role', JSON.stringify(role));
  }, [role]);

  // API call on the "/products"
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${urlPrefix}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const Alert = (text, id) => {
    toast.success(text, { toastId: id });
  };

  // API  call on the "/categories"
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${urlPrefix}/products/categories`);
      setCategoryList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access-token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    setCurrentUser({});
    setToken('');
    setUsername('');
    setRole('');
  };

  return (
    <AuthContext.Provider
      value={{
        fetchProducts,
        login,
        logout,
        products,
        setProducts,
        Alert,
        ToastContainer,
        currentUser,
        token,
        setUsername,
        getCurrentUser,
        getUsersContext,
        checkingAdmin,
        fetchCategories,
        categoryList,
        newAdminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
