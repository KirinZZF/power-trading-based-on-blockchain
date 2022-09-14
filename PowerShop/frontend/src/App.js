import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyOrderScreen from './screens/MyOrderScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import OrderListScreen from './screens/OrderListScreen';
import MyProductScreen from './screens/MyProductScreen';
import MyRequestingScreen from './screens/MyRequestingScreen';
import MySoldOrderScreen from './screens/MySoldOrderScreen';
import RequestingScreen from './screens/RequestingScreen';
import RequestCreateScreen from './screens/RequestCreateScreen';
import  PowerScreen from './screens/PowerScreen'
import  GiftScreen from './screens/GiftScreen'
import  PointScreen from './screens/PointScreen'
import MyCertificateScreen from './screens/MyCertificateScreen'
import ChatListScreen from './screens/ChatListScreen';
const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/chatlist" component={ChatListScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile/:email" component={ProfileScreen} />
          <Route path="/myorders" component={MyOrderScreen} />
          <Route path="/mysoldorders" component={MySoldOrderScreen} />
          <Route path="/product/edit/:id" component={ProductEditScreen} />
          <Route path="/newproduct" component={ProductCreateScreen} />
          <Route path="/product/:id" component={ProductScreen} exact />
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route path="/admin/user/:email/edit" component={UserEditScreen} />
          <Route path="/myproducts" component={MyProductScreen} exact />
          <Route path="/myrequesting" component={MyRequestingScreen} exact />
          <Route path="/newrequest" component={RequestCreateScreen} exact />
          <Route path="/mycertificate" component={MyCertificateScreen}/>
          <Route
            path="/myproducts/:pageNumber"
            component={MyProductScreen}
            exact
          />
          <Route
            path="/admin/productlist"
            component={ProductListScreen}
            exact
          />
          <Route
            path="/admin/productlist/:pageNumber"
            component={ProductListScreen}
            exact
          />

          <Route path="/admin/orderlist" component={OrderListScreen} />
          <Route path="/search/:category&:keyword" component={HomeScreen} exact />
          <Route path="/page/:pageNumber" component={HomeScreen} exact />
          <Route path="/power" component={PowerScreen} exact />
          <Route path="/gift" component={GiftScreen} exact />
          <Route path="/point" component={PointScreen} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeScreen}
            exact
          />
          <Route path="/" component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
