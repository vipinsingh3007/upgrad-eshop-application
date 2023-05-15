import axiosObj from 'axios';

/**
 * The backend is running locally on port 8080. Hence the url is http://localhost:8080.
 *
 * Change urlPrefix in case the backend server is running else where.
 * */
export const urlPrefix = 'http://localhost:8080/api';

export const axios = axiosObj;
