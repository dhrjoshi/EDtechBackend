const UserRepository = require('../repository/user-repository');
const ProfileRepository = require('../repository/profile-repository');
const OTPRepository = require('../repository/otp-repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mainSender');
const passwordUpdated = require('../mailTemplates/passwordUpdateEmail');

const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();
const otpRepository = new OTPRepository();

class UserService {
    async signUp(data) {
        try {
            //Validation
            if(!data){
                throw {
                    message: 'All fields are required'
                }
            }
            if(data.password !== data.confirmPassword){
                throw {
                    message: 'Password ans Confirm Password Do not match...'
                }
            }

            const email = data.email;
            const existingUser = await userRepository.findBy({email});
            if(existingUser){
                throw {
                    message: 'User already exists. Sign-in to continue'
                }
            }
            
            //find most recent OTP for the email
            const response = await otpRepository.get({email}).sort({createdAt: -1}).limit(1);
            if(response.length === 0){
                throw {
                    message: 'OTP invalid'
                }
            } else if(data.otp !== response[0].otp){
                throw {
                    message: 'OTP invalid'
                }
            }
            
            //Hash Password
            const hashedPassword = await bcrypt.hash(data.password,10);
            data.password = hashedPassword;

            //create additional profile for user
            const profile = await profileRepository.create(null);
            data.additionalDetails = profile._id;
            data.image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
            
            //save entry in db
            const user = await userRepository.create(data);
            return user;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async login(data) {
        try {
            //Validation
            if(!data){
                throw {
                    message: 'fill all required fields'
                }
            }
            const email = data.email;
            const user = await userRepository.findBy({email}).populate('additionalDetails');
            if(!user){
                throw {
                    message: 'User not register, SignUp'
                }
            }

            //generate JWT token and compare password
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            };
            if(await bcrypt.compare(data.password,user.password)){
                const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '24h'});
                user.token = token;
                user.password = undefined;
                //set cookie for token and return success response
                // const options = {
                //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				//     httpOnly: true
                // };
                return {token,user};
            } else{
                throw {
                    message: 'Password is incorrect'
                }
            }
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async sendOTP(data) {
        try {
            const email = data.email;
            //Validate
            const checkUserPresent = await userRepository.findBy({email});
            if(checkUserPresent){
                throw {
                    message: 'User is already registered'
                }
            }
            
            //Generate OTP
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            const result = await otpRepository.findBy({otp: otp});
            while(result) {
                otp = otpGenerator(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false,
                });
                result = await otpRepository.findBy({otp: otp});
            }
            const otpPayload = {email,otp};
            const otpBody = await otpRepository.create(otpPayload);
            return otpBody;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async changePassword(id,data) {
        try {
            const userDetails = await userRepository.get(id);
            const isPasswordMatch = await bcrypt.compare(data.oldPassword,userDetails.password);
            //Validate
            if(!isPasswordMatch){
                throw {
                    message: 'Password incorrect'
                }
            }
            if(data.newPassword != data.confirmNewPassword){
                throw {
                    message: 'The password and compare password does not match'
                }
            }
            
            //Update Password
            const encryptedPassword = await bcrypt.hash(data.newPassword,10);
            data.password = encryptedPassword;
            const updatedUserDetails = await userRepository.update(id,data);
            
            //send notification on email
            const emailResponse = await mailSender(updatedUserDetails.email,passwordUpdated(updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
            return true;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }
}

module.exports = UserService;