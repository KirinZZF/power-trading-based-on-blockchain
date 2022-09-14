import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder, saveOrderProductInfo } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants'
import userSocket from '../socketMidle'
import axios from 'axios'
const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  //include info about the prodcut and Address&Time
  const { error, success, order } = useSelector((state) => state.orderCreate)

  const { shippingAddress, product } = useSelector((state) => state.orderInfo)
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const [price, setPrice] = useState(0)
  const [power, setPower] = useState(1)
  // const userGlobalSocket = useSelector((state) => state.userGlobalSocket);
  // const { userSocket } = userGlobalSocket;
  if (!shippingAddress.address) {
    history.push('/shipping')
  }
  useEffect(() => {
    // if request a book successfully, the redirect to the order detail page.
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
      dispatch({ type: PRODUCT_DETAILS_RESET })
      //mark the product as sold avoid repeating order
      dispatch(saveOrderProductInfo(product))
    }
  }, [history, success])

  const setPowerAndPriceHandler = async (e) => {
    e.preventDefault()
    setPrice(e.target.value * product.price)
    setPower(e.target.value)
  }
  const placeOrderHandler = async () => {
    if (!userInfo) {
      history.push('/login')
    }
    const product_id = product.product
    console.log('product information' + JSON.stringify(product))
    if (product.category == 'power') {
      let date = new Date().valueOf()
      let certnumber = product.name + date

      var cert = {
        certno: certnumber,
        generator: product.name,
        power: power,
        owner: userInfo.email,
        generatedate: date,
      }
      //console.log('before generated cert:'+JSON.stringify(cert))
      const config2 = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      var { data } = await axios.post('/api/cert/generate', cert, config2)
      console.log('generated cert:' + JSON.stringify(data))
    } else if(product.category == 'gift'){
      var user = {
        name: userInfo.name,
        email: userInfo.email,
        cleanpowerpoint: userInfo.cleanpowerpoint - product.price,
        isAdmin: userInfo.isAdmin,
        role: userInfo.role,
      }
      console.log(JSON.stringify(user))
      if(user.cleanpowerpoint<0){
        alert("Clean Power Point is not enough!")
        return;
      }else{
        const config4 = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        var { data } = await axios.put(`api/users/${userInfo.email}`,user,config4)
      }
    }else if (product.category == 'point') {
      var user = {
        name: userInfo.name,
        email: userInfo.email,
        cleanpowerpoint: userInfo.cleanpowerpoint + product.price,
        isAdmin: userInfo.isAdmin,
        role: userInfo.role,
      }
      const config3 = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      var { data } = await axios.put(`api/users/${userInfo.email}`,user,config3)
      
    }
    // console.log('product_id' + product_id);
    // console.log(product.seller);
    // const { data } = await axios.get(`/api/users/getUserInfo/${product.seller}`);
    // console.log('data:' + JSON.stringify(data));
    // const seller_id = data._id;
    // //console.log(JSON.stringify(seller))
    // const buyer_id = userInfo._id;
    // console.log(buyer_id + '     ' + seller_id);
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // };

    // var chat = await axios.post(
    //   '/api/chatlist/chat/',
    //   { product_id, seller_id, buyer_id },
    //   config
    // );
    // chat = chat.data;
    // console.log(JSON.stringify(chat));
    // if (chat != 'none') {
    //   console.log('notify the seller that I have bought');
    //   let message = {
    //     srcUser: buyer_id,
    //     destUser: seller_id,
    //     msgContent: 'I have bought your  power points~',
    //     msgTime: Date.now(),
    //   };

    //   userSocket.emit('private-message', chat._id, message);
    //   //history.push('/chatlist')
    // } else {
    //   console.log('new notify the seller that I have bought');
    //   console.log(buyer_id + '     ' + seller_id);
    //   let newchat = {
    //     productId: product_id,
    //     sellerId: seller_id,
    //     buyerId: buyer_id,
    //     unread: true,
    //     messages: [
    //       {
    //         srcUser: buyer_id,
    //         destUser: seller_id,
    //         msgContent: 'I have bought your power points~',
    //         msgTime: Date.now(),
    //       },
    //     ],
    //   };

    //   await userSocket.emit('createNewChat', newchat);
    //   //history.push('/chatlist')
    // }
    dispatch(
      createOrder({
        orderItem: product,
        shippingAddress: shippingAddress,
        email: userInfo.email,
      })
    )
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>EXPECTED EXCHANGE ADDRESS&TIME</h2>
              <p>
                <strong>Address:</strong>
                {shippingAddress.address} {shippingAddress.postalCode},{' '}
              </p>
              <p>
                <strong>Time&Date:</strong>
                {shippingAddress.dateTime}{' '}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2> Info</h2>
              {!product ? (
                <Message>No power requested</Message>
              ) : (
                <ListGroup variant='flush'>
                  {
                    <ListGroup.Item>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${product.product}`}>
                            {product.name}
                          </Link>
                        </Col>
                        <Col md={4}>{product.price}</Col>
                        <Col>
                          <Form.Control
                            type='number'
                            placeholder='Enter number of power'
                            value={power}
                            onChange={setPowerAndPriceHandler}
                          ></Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  }
                </ListGroup>
              )}
            </ListGroup.Item>

            {error && (
              <ListGroup.Item>
                <Message variant='danger'>{error}</Message>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <Button
                type='button'
                disabled={!product || product.status !== 'selling'}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
