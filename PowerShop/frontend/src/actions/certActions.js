import axios from 'axios';
import {
    CERT_LIST_GET,
    CERT_LIST_GET_FAIL,
    CERT_LIST_GET_SUCCESS,
    CERT_REDEEM,
    CERT_REDEEM_FAIL,
    CERT_REDEEM_SUCCESS,
} from '../constants/certConstants.js'
export const getCertList = (email) => async (dispatch, getState) =>{
    try {
        dispatch({
          type: CERT_LIST_GET,
          loading:true
        });
    
        const {
          userLogin: { userInfo },
        } = getState();
    
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        //console.log("gggggggggggggggggggg")
        const { data } = await axios.get(`/api/cert/${email}`, config);
    
        dispatch({
          type: CERT_LIST_GET_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: CERT_LIST_GET_FAIL,
          payload: error,
        });
      }
};
export const redeemCert = (certno) => async (dispatch, getState) =>{
    try {
        dispatch({
          type: CERT_REDEEM,
        });
    
        const {
          userLogin: { userInfo },
        } = getState();
    
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const {data} = await axios.post('/api/cert/redeem',{certno},config)
        dispatch({
          type: CERT_REDEEM_SUCCESS,
          payload: data,
        });
        dispatch(getCertList(userInfo.email))
      } catch (error) {
        dispatch({
          type: CERT_REDEEM_FAIL,
          payload: error,
        });
      }
};