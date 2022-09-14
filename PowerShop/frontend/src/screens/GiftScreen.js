import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

const RequestingScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    //Screen for advertising products
    dispatch(listProducts(keyword, pageNumber, 'gift'));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <>
      <Link to="/" className="btn btn-dark my-2">
          Power market
        </Link>{' '}
        <Link to="/gift" className="btn btn-dark my-2">
          Gitf market
        </Link>{' '}
        <Link to="/point" className="btn btn-dark my-2">
          Point market
        </Link>
      </>
      <Meta />

      <h1>There are gifts you can buy with your clean power points</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
            location="home"
          />
        </>
      )}
    </>
  );
};

export default RequestingScreen;
