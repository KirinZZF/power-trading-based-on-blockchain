import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userSocket from './socketMidle'
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productTopRatedReducer,
  myProductListReducer,
  productStatusUpdateReducer,
} from './reducers/productReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userReviewsReduer,
  userSocketReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderCompleteReducer,
  orderArrangeReducer,
  orderListMyReducer,
  orderListMySoldReducer,
  orderListReducer,
  orderReviewCreateReducer,
  orderInfoReducer,
} from './reducers/orderReducers';

import {
  userChatListReducer,
  userMessageSendReducer,
  selectedChatReducer,
} from './reducers/userChatReducers';

import {certListReducer,certRedeemReducer} from './reducers/certReducers'
const reducer = combineReducers({
  productList: productListReducer,
  myProductList: myProductListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productTopRated: productTopRatedReducer,
  productStatusUpdate: productStatusUpdateReducer,
  orderInfo: orderInfoReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  orderReviewCreate: orderReviewCreateReducer,
  userDelete: userDeleteReducer,
  userReviews: userReviewsReduer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderComplete: orderCompleteReducer,
  orderArrange: orderArrangeReducer,
  orderListMy: orderListMyReducer,
  orderListMySold: orderListMySoldReducer,
  orderList: orderListReducer,
  userChatList: userChatListReducer,
  userMessageSend: userMessageSendReducer,
  selectedChat: selectedChatReducer,
  userGlobalSocket: userSocketReducer,
  certList:certListReducer,
  certRedeem:certRedeemReducer,
});

// const userInfoFromStorage = localStorage.getItem('userSocket')
//   ? JSON.parse(localStorage.getItem('userSocket'))
//   : null;

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};
//const userSocketFromStorage = localStorage.getItem('userSocket')?JSON.parse(localStorage.getItem('userSocket')):null;
const initialState = {
  orderInfo: {
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
  //userGlobalSocket:{userSocket:userSocketFromStorage},
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
