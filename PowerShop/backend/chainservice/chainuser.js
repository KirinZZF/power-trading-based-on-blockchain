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

var ChainUser = {}
ChainUser.getNetwork = getNetwork;
ChainUser.addUser = addUser;
ChainUser.find = find;
ChainUser.findOne = findOne;
ChainUser.findById = findById;
ChainUser.save =save;
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

async function findOne(query) {
  try {
    let network = await getNetwork();
    let contract = network.getContract("users")
    let result = await contract.evaluateTransaction("findOneUser", query.email)
    if (result == null) {
      console.log('result is null!!!!!!!!!!!');
      return null;
    }
    console.log('Transaction has been submitted');
    //console.log(JSON.parse(result))
    return JSON.parse(result)
  } catch (error) {
    console.log(error)
  }

}
async function addUser(user) {
  try {
    let network = await getNetwork();
    // Get the contract from the network.
    const contract = network.getContract('users');
    //console.log("contract:"+JSON.stringify(contract))

    let result = await contract.submitTransaction('addUser', JSON.stringify(user));
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
async function find(query) {
  try {
    let network = await getNetwork();
    let contract = network.getContract("users")
    let result = await contract.evaluateTransaction("find", JSON.stringify(query))
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

async function findById(email) {

}
async function save(user) {
  try {
    let network = await getNetwork();
    let contract = network.getContract("users")
    let result = await contract.submitTransaction("updateUser", JSON.stringify(user))
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

export default ChainUser
