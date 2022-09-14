import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCertList,redeemCert} from '../actions/certActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Paginate from '../components/Paginate';
import {
  CERT_LIST_GET,
  CERT_LIST_GET_FAIL,
  CERT_LIST_GET_SUCCESS,
  CERT_REDEEM_FAIL,
  CERT_REDEEM_SUCCESS,
} from '../constants/certConstants.js'
import axios from 'axios'

const MyCertificateScreen = ({ history }) => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const certList = useSelector((state) => state.certList)
  const certRedeem = useSelector((state) => state.certRedeem)
  const { loading,certArray,error} = certList
  const {processing } = certRedeem
  useEffect(() => {
    if (userInfo) {
        console.log("before dispath"+certArray)
      dispatch(getCertList(userInfo.email))
      console.log("after dispath"+certArray)
      //dispatch(getCertList(userInfo.email))
    } else {
      history.push('/login')
    }
  }, [history])
  const redeemHandler = (certno) =>{
    if (window.confirm('Are you sure?')) {
      dispatch(redeemCert(certno))
      //dispatch(getCertList(userInfo.email))
    }
  };
  return (
    <>
    {(loading||processing)?(<><Loader></Loader></>):
        ((error)?
            (<><Message variant="danger">{error}</Message></>):
            (        <>
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>CerNo</th>
                      <th>Generator</th>
                      <th>Owner</th>
                      <th>Power</th>
                      <th>Date</th>
                      <th>Redeemed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certArray.map((cert) => (
                      <tr key={cert.certno}>
                        <td>{cert.certno}</td>
                        <td>{cert.generator}</td>
                        <td>{cert.owner}</td>
                        <td>{cert.power}</td>
                        <td>{new Date(cert.generatedate).toString()}</td>
                        <td>{cert.redeemed}</td>
                        <td><Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => redeemHandler(cert.certno)}
                    >
                      <i className="fas fa-trash"></i>
                    Redeem it</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>)
        )}
    </>
  )
}

export default MyCertificateScreen