import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listProductDetails } from '../actions/productActions';
import { saveOrderProductInfo } from '../actions/orderActions';
import userSocket from '../socketMidle'
import axios from 'axios';
import 'socket.io-client';
import store from '../store'
const ProductScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  // const userGlobalSocket = useSelector((state) => state.userGlobalSocket);
  // const { userSocket } = userGlobalSocket;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!product || !product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id)); 
    }
    // console.log('zajzjzjjzj'+store.getState().productDetails.product.status)
    //   if(store.getState().productDetails.product.status==='deleted'){
    //     history.push('/')
    //   }
    
  }, [dispatch, match]);

  const requestBookHandler = () => {
    dispatch(saveOrderProductInfo(product));
    history.push('/login?redirect=shipping');
  };
  const productManageHandler = () => {
    history.push(`/product/edit/${product._id}`);
  };

  const contactHandler = async (e) => {
    if (!userInfo) {
      history.push('/login');
    }
    const product_id = product._id;
    console.log(product.sellerEmail);
    var { data } = await axios.get(
      `/api/users/getUserInfo/${product.sellerEmail}`
    );
    console.log('data:' + JSON.stringify(data));
    const seller_id = data._id;
    //console.log(JSON.stringify(seller))
    const buyer_id = userInfo._id;
    console.log(buyer_id + '     ' + seller_id);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    var chat = await axios.post(
      '/api/chatlist/chat/',
      { product_id, seller_id, buyer_id },
      config
    );
    chat = chat.data;
    console.log(JSON.stringify(chat));
    if (chat != 'none') {
      history.push('/chatlist');
    } else {
      console.log(buyer_id + '     ' + seller_id);
      let newchat = {
        productId: product_id,
        sellerId: seller_id,
        buyerId: buyer_id,
        unread: true,
        messages: [
          {
            srcUser: buyer_id,
            destUser: seller_id,
            msgContent: 'Hi, I Let us talk about the book~',
            msgTime: Date.now(),
          },
        ],
      };

      await userSocket.emit('createNewChat', newchat);
      history.push('/chatlist');
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Homepage
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) :(product.status==='deleted')?(<Message variant="danger">This product has been {product.status}</Message>):
       (
        <>
        
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            {(
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Seller:</Col>
                        <Col>
                          <LinkContainer to={`/profile/${product.sellerEmail}`}>
                            <Alert.Link className="md" variant="light">
                              {product.sellerEmail}
                            </Alert.Link>
                          </LinkContainer>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {!userInfo || userInfo.email !== product.sellerEmail ? (
                      <>
                        <ListGroup.Item>
                          <Button
                            className="btn-block"
                            type="button"
                            onClick={contactHandler}
                          >
                            Contact
                          </Button>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Button
                            onClick={requestBookHandler}
                            className="btn-block"
                            type="button"
                            disabled={product.status !== 'selling'}
                          >
                            Buy It
                          </Button>
                        </ListGroup.Item>
                      </>
                    ) : (
                      <ListGroup.Item>
                        <Button
                          onClick={productManageHandler}
                          className="btn-block"
                          type="button"
                          disabled={product.status !== 'selling'}
                        >
                          Manage 
                        </Button>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            )}
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
