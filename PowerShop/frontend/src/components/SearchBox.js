import React, { useState,useDispatch} from 'react';
import { Form, Button } from 'react-bootstrap';
const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');
  //const [prefix, setPrefix] = useState('')
  const submitHandler = (e) => {
    e.preventDefault();
    var status = document.getElementById('market').value.split(' ')[0];
    //console.log(status+' with '+keyword.trim())
    if(status=='power'&&keyword.trim()==''){
      history.push('/power')
    }else if(status=='gift'&&keyword.trim()==''){
      history.push('/gift')
    }else if(status=='point'&&keyword.trim()==''){
      history.push('/point')
    }
    if (keyword.trim()) {
      console.log(' key word'+keyword)
      history.push(`/search/${status}&${keyword.trim()}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        size="sm"
        as="select"
        id="market"
        className="mr-sm-2 ml-sm-2"
      >
        <option>power market</option>
        <option>gift market</option>
        <option>point market</option>
      </Form.Control>

      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Type to search"
        className="mr-sm-3 ml-sm-4"
        id="searchBox"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
