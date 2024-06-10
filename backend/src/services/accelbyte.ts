import { Accelbyte, Network } from "@accelbyte/sdk"
import { IamUserAuthorizationClient } from "@accelbyte/sdk-iam";
import config from "../config";

const accelbyte = Accelbyte.SDK({
  options: {
    baseURL: "https://universityofhelsinki.prod.gamingservices.accelbyte.io",
    clientId: "35568f9b3f1a44f7a37089948bffefd2",
    namespace: "Serendip",
    redirectURI: "http://127.0.0.1",
    
  },
});

const iamClient = new IamUserAuthorizationClient(accelbyte);


const network = Network.create(accelbyte.assembly());

export const loginWithUsernamePassword = async (credentials: {username: string, password: string}) => {
  return await iamClient.loginWithPasswordAuthorization(credentials);      
}



export const loginWithAuthCode = async (code: string) => {
  return await network.post('/iam/v3/token/exchange', {code: code}, {headers: {'Content-Type': 'application/x-www-form-urlencoded', Authorization: config.ACCELBYTE_TOKEN}})
  }



export default accelbyte
