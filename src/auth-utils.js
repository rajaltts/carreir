import appConfig from './Environment/environments';
import axios from 'axios';
import {logout as authLogout} from '@carrier/reactauthwrapper';

export const logout = () => {
  authLogout(appConfig.api.loginConfig);
}

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