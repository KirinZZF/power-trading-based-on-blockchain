import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Power Shop!',
  description:
    'This is a Clean Power and Clean Power Points Trading Platform',
  keywords: 'buy clean power, sell clean power points',
};

export default Meta;
