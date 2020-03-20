import localInfo from './LocalInfo';
import Api from './Api';
import GenerateOTP from './GenerateString';
import SmsService from './SmsService';
const jwt = require('jsonwebtoken');

export default class AuthService {
    /*constructor() {
        //this.auth0 = new auth0.WebAuth(auth0_config);
    }*/

    login = async (username , password) => {
        // username and password
        // try to login
        // if pass: save in localstorage
        // if fail: alert user
        const params = {
            username: username,
            password: password,
            strategy: "local",
        };

        try {
            let user = await new Api('others').create(
                params,
                {},
                {},
                'https://elp-core-api-dev.herokuapp.com/v1/client/users/login'
            );

            if( user ){
                try {
                    var decoded = jwt.verify(user.data.token, 'Z7oGGqapxnMrBSd2xXFuqseC');

                    const response = decoded.data;

                    localStorage.setItem('accessToken' , user.data.token);
                    localStorage.setItem('userDetails' , JSON.stringify(response.user));
                    localStorage.setItem('username' , response.user.username);
                    localStorage.setItem('activeBranch' , response.access[0].branches[0].branchId);
                    localStorage.setItem('userData', JSON.stringify(response));

                    return {
                        success: 200,
                        user: response.user
                    };
                } catch(err) {
                    return {
                        error: {
                            msg: "Invalid token",
                            status: 401
                        }

                    };
                }
            }
        }catch (error) {
            return {
                error: {
                    msg: "Invalid login credentials",
                    status: 401
                }
            };
        }


    };

    register = async( data ) => {
        // check if user exists - core-api
        // user registers : username and password on AuthService -- done
        // create company on core-api - companies table -- done
        // create first company on core-api and associate to user -- done
        /*
        @var { username , firstName , otherNames, phone, password}
        @todo check if user exist
        */
        let user;
        const params = {
            user: {
                "password": data.password,
                "firstName": data.firstName,
                "otherNames": data.otherNames,
                "phone": data.phone,
                "username": data.username,
                "whatsAppPhone": data.phone,
                "otp": new GenerateOTP(4).generateNumber(),
            },
            company: {
                "name": data.companyName,
                "businessCategoryId": parseInt(data.storeCategory),
            },
            branch: {
                "name": data.companyName,
                "startDate": "",
                "location": data.companyName,
                "gps": "",
                "logo": "",
                "phone": data.phone,
                "whatsAppPhone": data.phone,
                "type": data.storeType,
            },
        };

        try{
            const response = await new Api('others').create(
                params,
                {},
                {},
                'https://elp-core-api-dev.herokuapp.com/v1/client/users/register'
            );

            if( response ){
                localStorage.setItem('randomString' , data.password);
                localStorage.setItem('activeBranch' , response.data.branch.id);
                localStorage.setItem('userDetails' , JSON.stringify(response.data.user));

                user = response.data.user;
                console.log(user);
                //const response = await this.sendOTP(user.firstName ,user.phone , user.otp);

                return {
                    user
                };
            }
        }catch (error){
            return {
                error: {
                    msg: error.response.data.message,
                    status: 401
                }
            };
        }
    };

    registerUser = async ( data ) => {
        let res = await new Api('users').create(
            data
        );

        return res.data;
    };

    registerCompany = async ( data ) => {
        let res = await new Api('companies').create(
            data
        );

        return res.data;
    };

    sendOTP = (name , contact , token) => {
        const message = `Hello ${name}, your verification code is: ${token}. Please enter it.`;

        return new SmsService(contact , message).sendSMS();
    };

    logout = () => {
        // clear local storage
        // call logout on auth0
    }
}