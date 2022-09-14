package main
import (
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
	"fmt"
	"encoding/json"
	"bytes"
)


type User struct {
	Name     string `json:"name"`
	Email   string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
	CleanPowerPoint float32`json:"cleanpowerpoint"`
	IsAdmin string `json:"isAdmin"`
}

type UserChaincode struct{

}

func (t *UserChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response{
	fmt.Println(" ==== Init ====")
	return shim.Success(nil)
}

func (t *UserChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	fun, args := stub.GetFunctionAndParameters()
	if fun == "addUser"{
		return t.addUser(stub,args)
	}else if fun=="find"{
		return t.find(stub,args)
	}else if fun =="updateUser"{
		return t.updateUser(stub,args)
	}else if fun =="findOneUser"{
		return t.findOneUser(stub,args)
	}

	return shim.Error("Function name does not fount, please check")
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
func getUserByQueryString(stub shim.ChaincodeStubInterface, queryString string)([]byte, bool){
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
func (t *UserChaincode) addUser(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	//fmt.Println(args[0])
	var user User
	err := json.Unmarshal([]byte(args[0]), &user)
	if err != nil {
		return shim.Error("Erro when unmarshal")
		//return shim.Error(args[0])
	}
	_, exist := getUserById(stub, user.Email)
	if exist {
		return shim.Error("User exists!!!")
	}
	userAsByte, bl := putUser(stub, user)
	if !bl{
		return shim.Error("Error when saving User")
	}
	return shim.Success(userAsByte)
}
func (t *UserChaincode) find(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	queryString := fmt.Sprintf(`{"selector":%s}`, args[0])
	userArrayAsbytes, bl := getUserByQueryString(stub,queryString)
	if !bl {
		return shim.Error("Error when finding User")
	}
	return shim.Success(userArrayAsbytes)
}

 func (t *UserChaincode) updateUser(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	var user User
	err := json.Unmarshal([]byte(args[0]), &user)
	if err != nil {
		return shim.Error("Erro when unmarshal")
		//return shim.Error(args[0])
	}
	oldUserAsByte, bl := getUserById(stub, user.Email)
	if !bl{
		return shim.Error("User does not exit")
	}
	var oldUser User
	err = json.Unmarshal(oldUserAsByte, &oldUser)
	if err!=nil {
		return shim.Error("oldUser unmarshall erro")
	}
	if user.Password==""{
		user.Password = oldUser.Password
	}
	userAsByte, bl := putUser(stub, user)
	if !bl{
		return shim.Error("Error when updating User")
	}
	return shim.Success(userAsByte)
 }
 func (t *UserChaincode) findOneUser(stub shim.ChaincodeStubInterface,args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("Number of parameter is wrong")
	}
	email :=args[0]
	userAsBytes, bl := getUserById(stub,email)
	if !bl {
		// if userAsBytes==nil{
		// 	return shim.Success(nil)
		// }
		return shim.Error("Error when finding One User")
	}
	return shim.Success(userAsBytes)
}
func main(){
	err := shim.Start(new(UserChaincode))
	if err != nil{
		fmt.Printf("Encounter erro while starting Chaincode UserChaincode: %s", err)
	}
}
