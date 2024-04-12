import { Accelbyte } from "@accelbyte/sdk"
import { IamUserAuthorizationClient } from "@accelbyte/sdk-iam";

const accelbyte = Accelbyte.SDK({
  options: {
    baseURL: "https://universityofhelsinki.prod.gamingservices.accelbyte.io",
    clientId: "35568f9b3f1a44f7a37089948bffefd2",
    namespace: "Serendip",
    redirectURI: "http://127.0.0.1",
  }
});

const iamClient = new IamUserAuthorizationClient(accelbyte);

export const loginWithUsernamePassword = async (credentials: {username: string, password: string}) => {
  return await iamClient.loginWithPasswordAuthorization(credentials);      
}

export default accelbyte
