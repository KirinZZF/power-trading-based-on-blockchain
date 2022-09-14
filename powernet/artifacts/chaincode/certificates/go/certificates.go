package main
import (
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
	"fmt"
	"encoding/json"
	"bytes"
)
type CertChaincode struct{
}

type Certificate struct{
	CertNo string `json:"certno"`
	Generator string `json:"generator"`
	Power int `json:"power"`
	Owner string `json:"owner"`
	GenerateDate int64 `json:"generatedate"`
	Redeemed string `json:"redeemed"`
}
type User struct {
	Name     string `json:"name"`
	Email   string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
	CleanPowerPoint float32`json:"cleanpowerpoint"`
	IsAdmin string `json:"isAdmin"`
}

func putCertificate(stub shim.ChaincodeStubInterface, cert Certificate) ([]byte, bool){
	certAsByte, err := json.Marshal(cert)
	if err != nil{
		return nil, false
	}
	err = stub.PutState(cert.CertNo, certAsByte)
	if err != nil{
		return nil, false
	}
	return certAsByte, true
}
func getCertificateById(stub shim.ChaincodeStubInterface, certId string)([]byte, bool){
	certAsByte, err := stub.GetState(certId)
	if err != nil {
		return certAsByte, false
	}
	if certAsByte == nil {
		return certAsByte, false
	}
	return certAsByte, true
}
func getCertificateByQueryString(stub shim.ChaincodeStubInterface, queryString string)([]byte, bool){
	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
        return nil,false
    }
    defer resultsIterator.Close() //释放迭代器

    var buffer bytes.Buffer
    bArrayMemberAlreadyWritten := false
    buffer.WriteString(`[`)

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next() //获取迭代器中的每一个值
        if err != nil {
            return nil,false
        }
        if bArrayMemberAlreadyWritten == true {
            buffer.WriteString(",")
        }
        buffer.WriteString(string(queryResponse.Value)) //将查询结果放入Buffer中
        bArrayMemberAlreadyWritten = true
    }
    buffer.WriteString(`]`)
    fmt.Print("Query result: %s", buffer.String())

    return buffer.Bytes(),true
}
func getUserById(stub shim.ChaincodeStubInterface, userId string) ([]byte, bool)  {
	userAsByte, err := stub.GetState(userId)
	if err != nil {
		return userAsByte, false
	}
	if userAsByte == nil {
		return userAsByte, false
	}
	return userAsByte, true
}
func putUser(stub shim.ChaincodeStubInterface, user User) ([]byte, bool){
	userAsByte, err := json.Marshal(user)
	if err != nil{
		return nil, false
	}
	err = stub.PutState(user.Email, userAsByte)
	if err != nil{
		return nil, false
	}
	return userAsByte, true
}
func (t *CertChaincode) generateCert(stub shim.ChaincodeStubInterface,args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	var cert Certificate
	err := json.Unmarshal([]byte(args[0]),&cert)
	if err != nil {
		return shim.Error("Erro when unmarshal at step 1 "+args[0])
		//return shim.Error(args[0])
	}
	_,exist := getCertificateById(stub,cert.CertNo)
	if exist{
		return shim.Error("Certificate exists!!!")
	}
	certAsByte, bl := putCertificate(stub, cert)
	if !bl {
		return shim.Error("Error when saving Certificate")
	}
	return shim.Success(certAsByte)
}
func (t *CertChaincode) findOneCert(stub shim.ChaincodeStubInterface,args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	certno :=args[0]
	certArrayAsbytes, bl := getCertificateById(stub,certno)
	if !bl {
		return shim.Error("Error when finding Certificate")
	}
	return shim.Success(certArrayAsbytes)
}
func (t *CertChaincode) findCert(stub shim.ChaincodeStubInterface,args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	queryString := fmt.Sprintf(`{"selector":%s}`, args[0])
	certArrayAsbytes, bl := getCertificateByQueryString(stub,queryString)
	if !bl {
		return shim.Error("Error when finding Certificate")
	}
	return shim.Success(certArrayAsbytes)
}
func (t *CertChaincode) updateCert(stub shim.ChaincodeStubInterface,args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	var cert Certificate
	err := json.Unmarshal([]byte(args[0]),&cert)
	if err != nil {
		return shim.Error("Erro when unmarshal")
		//return shim.Error(args[0])
	}
	certAsByte, bl := putCertificate(stub, cert)
	if !bl {
		return shim.Error("Error when saving Certificate")
	}
	return shim.Success(certAsByte)
}
func (t *CertChaincode) redeemCert(stub shim.ChaincodeStubInterface,args []string)peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	
	oldCertAsByte,exist := getCertificateById(stub,args[0])
	if !exist{
		return shim.Error("Certificate is not existing!!!")
	}
	var cert  Certificate
	err := json.Unmarshal(oldCertAsByte,&cert)
	if err != nil{
		return shim.Error("Error when unmashal the oldcert")
	}
	cert.Redeemed="yes"
	certAsByte, bl := putCertificate(stub, cert)
	if !bl {
		return shim.Error("Error when redeem Certificate")
	}
	var funcName="findOneUser"
	var funcArg = cert.Owner
	var invokeArgByte = [][]byte{[]byte(funcName),[]byte(funcArg)}
 	response:=stub.InvokeChaincode("users",invokeArgByte,"mychannel")
	if response.Status != shim.OK{
		return shim.Error("User get fail when redeem"+string(response.Payload))
	}
	userAsByte:=response.Payload
	var user User
	errUserUnmarshal := json.Unmarshal(userAsByte,&user)
	if errUserUnmarshal!=nil{
		return shim.Error("User unmarshal fail when redeem"+string(userAsByte))
	}
	user.CleanPowerPoint = user.CleanPowerPoint+float32(cert.Power)
	userUpdatedAsByte,errUpdatedUser:= MarshalUserJSON(user)
	if errUpdatedUser!=nil{
		return shim.Error("Updated user marshal fail when redeem")
	}
	funcName = "updateUser"
	funcArg= string(userUpdatedAsByte)
	invokeArgByte = [][]byte{[]byte(funcName),[]byte(funcArg)}
	response=stub.InvokeChaincode("users",invokeArgByte,"mychannel")
	if response.Status!=shim.OK{
		return shim.Error("User update fail when redeem")
	} 
	return shim.Success(certAsByte)
}

func MarshalUserJSON(user User ) ([]byte, error) {
	return json.Marshal(map[string]interface{}{
		"name": user.Name,
		"email":  user.Email,
		"password":user.Password,
		"cleanpowerpoint":user.CleanPowerPoint,
		"role":user.Role,
		"isadmin":user.IsAdmin,
	})
}


func (t *CertChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response{
	fmt.Println(" ==== Init ====")
	return shim.Success(nil)
}
func (t *CertChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	fun, args := stub.GetFunctionAndParameters()
	if fun == "generateCert"{
		return t.generateCert(stub,args)
	}else if fun=="findCert"{
		return t.findCert(stub,args)
	}else if fun =="updateCert"{
		return t.updateCert(stub,args)
	}else if fun=="redeemCert"{
		return t.redeemCert(stub,args)
	}else if fun=="findOneCert"{
		return t.findOneCert(stub,args)
	}
	return shim.Error("Function name does not fount, please check")
}
func main(){
	err := shim.Start(new(CertChaincode))
	if err != nil{
		fmt.Printf("Encounter erro while starting Chaincode CertChaincode: %s", err)
	}
}
