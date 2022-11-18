import axios from 'axios';
import Promise from 'promise';
import { logout } from './../../../auth-utils';

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error && error.response){
    if(error.response.status === 401) {
      logout();
      return;
    }
  }
  return Promise.reject(error);
});