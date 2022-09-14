import FabricCAServices from 'fabric-ca-client'
import { Gateway, Wallets } from 'fabric-network'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve();
//console.log(__dirname)
const ccpPath = path.resolve(
    __dirname,
    '..',
    'powernet',
    'connection',
    'connection-org1.json'
)
const ccpPath2 = path.resolve(
    __dirname,
    '..',
    'powernet',
    'connection',
    'connection-org2.json'
)
var Cert={}
Cert.find = find;
Cert.findOne = findOne;
Cert.generateCert = generateCert;
Cert.updateCert = updateCert;
Cert.redeemCert = redeemCert;
async function getNetwork() {
    try {
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url
        const ca = new FabricCAServices(caURL)

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'backend/chainservice/wallet')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('appUser')
        if (!adminIdentity) {
            console.log(
                'An identity for the admin user "admin" does not exist in the wallet'
            )
            console.log('Run the enrollAdmin.js application before retrying')
            return
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        return network;
    } catch (error) {
        console.log(error)
    }
}
async function find(query) {
    try {
        let network = await getNetwork();
        let contract = network.getContract("certificates")
        let result = await contract.evaluateTransaction("findCert", JSON.stringify(query))
        if (result == null) {
            console.log('result is null!!!!!!!!!!!');
            return null;
        }
        console.log('Transaction has been submitted');
        console.log(JSON.parse(result))
        return JSON.parse(result)
    } catch (error) {
        console.log(error)
    }
}
async function findOne(query) {
    try {
        let network = await getNetwork();
        let contract = network.getContract("certificates")
        let result = await contract.evaluateTransaction("findOneCert", query)
        if (result == null) {
            console.log('result is null!!!!!!!!!!!');
            return null;
        }
        console.log('Transaction has been submitted');
        console.log(JSON.parse(result))
        return (JSON.parse(result))
    } catch (error) {
        console.log(error)
    }
}
async function generateCert(cert) {
    try {
        let network = await getNetwork();
        // Get the contract from the network.
        const contract = network.getContract('certificates');
        //console.log("contract:"+JSON.stringify(contract))

        let result = await contract.submitTransaction('generateCert', JSON.stringify(cert));
        if (result == null) {
            console.log('result is null!!!!!!!!!!!');
            return null;
        }
        console.log('Transaction has been submitted');
        console.log(JSON.parse(result))
        return JSON.parse(result)
    } catch (error) {
        console.log(error)
    }
}
async function updateCert(cert) {
    try {
        let network = await getNetwork();
        let contract = network.getContract("certificates")
        let result = await contract.submitTransaction("updateCert", JSON.stringify(cert))
        if (result == null) {
            console.log('result is null!!!!!!!!!!!');
            return null;
        }
        console.log('Transaction has been submitted');
        console.log(JSON.parse(result))
        return JSON.parse(result)
    } catch (error) {
        console.log(error)
    }
}
async function redeemCert(certno) {
    try {
        let network = await getNetwork();
        let contract = network.getContract("certificates")
        let result = await contract.submitTransaction("redeemCert", certno)
        if (result == null) {
            console.log('result is null!!!!!!!!!!!');
            return null;
        }
        console.log('Transaction has been submitted');
        console.log(JSON.parse(result))
        return JSON.parse(result)
    } catch (error) {
        console.log(error)
    }
}
export default Cert;
