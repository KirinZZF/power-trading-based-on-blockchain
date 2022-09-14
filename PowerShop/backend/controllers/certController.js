import asyncHandler from 'express-async-handler'
import Cert from '../chainservice/certservice.js'

const getAllCert = asyncHandler(async (req, res) => {
    var email = req.params.email
    //console.log("email? at get all cert"+JSON.stringify(req.params))
    console.log("email? at get all cert"+email)
    var certArray = await Cert.find({ "owner":email })
    if (certArray) {
        //console.log(chatlist)
        res.status(200).json(
            certArray
        )
    }
})

const getCertByCertNo = asyncHandler(async (req, res) => {
    var certno = req.params.certno
    var certArray = await Cert.findOne({ certno })
    if (certArray) {
        //console.log(chatlist)
        res.status(200).json(
            certArray
        )
    }else{
        res.status(400)
        throw new Error("Cert did not found")
    }
})

const redeemCert = asyncHandler(async (req, res)=>{
    req.setTimeout(0)
    console.log("waiting for redeem:"+req.body.certno)
        //console.log("waiting for redeem:"+JSON.stringify(certno))
        let redeemedCert = await Cert.redeemCert(req.body.certno)
        if(redeemedCert){
            console.log("fuck I am not null!!!!!!!!!!!!!!!!!!!!")
            res.status(200).json(redeemedCert)
        }else{
            res.status(404)
            throw new Error("Cert reedem failed")
        }
})
const generateCert = asyncHandler(async (req,res)=>{
    const {certno,generator, power,owner,generatedate} = req.body
    //console.log('type of:'+ typeof(power))
    var intpower = parseInt(power)
    //console.log('type of:'+ typeof(intpower))
    var cert = await Cert.generateCert({certno,generator, power:intpower,owner,generatedate,"redeemed":"no"})
    if(cert){
        res.status(200).json(cert)
    }else{
        res.status(400)
        throw new Error("Failed to generate the Certificate")
    }
})
export {generateCert,redeemCert,getCertByCertNo,getAllCert}
