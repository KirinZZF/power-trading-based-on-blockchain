import {
    CERT_LIST_GET,
    CERT_LIST_GET_FAIL,
    CERT_LIST_GET_SUCCESS,
    CERT_REDEEM,
    CERT_REDEEM_FAIL,
    CERT_REDEEM_SUCCESS,
} from '../constants/certConstants.js'

export const certListReducer = (state = {loading:true,certArry:[],},action)=>{
    switch (action.type) {
        case CERT_LIST_GET:
          return {
            ...state,
            loading:true
          };
    
        case CERT_LIST_GET_SUCCESS:
          return {certArray: action.payload,loading:false };
        case CERT_LIST_GET_FAIL:
            return{
                loading:false,
                error:action.payload,
            };
        default:
          return state;
      }
};

export const certRedeemReducer = (state = {},action)=>{
  switch (action.type) {
      case CERT_REDEEM:
        return {
          ...state,
          processing:true
        };
  
      case CERT_REDEEM_SUCCESS:
        return {...state,certRedeemed: action.payload,processing:false };
      case CERT_REDEEM_FAIL:
          return{
              ...state,
              processing:false,
              error:action.payload,
          };
      default:
        return state;
    }
};