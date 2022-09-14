import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const Power = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/power/${power._id}`}>
        <Card.Img src={power.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${power._id}`}>
          <Card.Title as="div">
            <strong>{power.generator}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="h3">${power.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Power;
