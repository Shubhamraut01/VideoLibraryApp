import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId)=>{
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshTokens()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

return{accessToken,refreshToken}

  }catch(error){
    throw new ApiError(500,"Something Went Wrong while generating access and refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
 
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username,email
  // check for images,check for avatar
  //upload them to cloudnary , avatar
  // create user object - create entry in db
  // remove password and referesh token field from response
  //check for user creation
  //return res
  const {fullName , email ,username , password} = req.body

  if([fullName , email ,username , password].some((field)=> field?.trim() === "")){
    throw new  ApiError(400,"All fields are required")

  }
const existedUser = await User.findOne({
  $or: [
    { email: email },
    { username: username },
  ]
})
console.log("existedUser:::::",existedUser)
if(existedUser){
  throw new ApiError(409,"User already exists")}

  const avatarLocalPath = req.files?.avatar[0]?.path
  console.log("file path avatar ::::::",avatarLocalPath)
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }

  const coverImageLocalPath = req.files?.coverImage[0]?.path
  console.log("file path cover::::::",coverImageLocalPath)
  if(!coverImageLocalPath){
    throw new ApiError(400,"CoverImage is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(500,"Avatar upload failed")
  }
  if(!coverImage){
    throw new ApiError(500,"CoverImage upload failed")
  }
  console.log("avatar:::::::",avatar)
  console.log("coverImage:::::::",coverImage)

 const user = await User.create({
  fullName,
  email,
  username : username.toLowerCase(),
  password,
  avatar:avatar?.url,
  coverImage:coverImage?.url || ""
})

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"User creation failed")}

  return res.status(201).json(
    new ApiResponse(201,"User created successfully",createdUser)
  )
});


const loginUser = asyncHandler(async (req, res) => {
//req body -> data
// username or email
// find the user
// password check
// generate access token
// generate refresh token
// save refresh token in db
// send cookie
// return res

const {email , username , password} = req.body
if (!username || !email){
  throw new ApiError(400,"Username or email is required")

}
const user = await User.findOne({
  $or:[
    {email:email},
    {username:username}
  ]

})

if(!user){
  throw new ApiError(404,"User not found")}

  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401,"Invalid password")
  }

  const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly :true,
    secure: true
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{
      user:loggedInUser ,accessToken,refreshToken
    },"User Logged in Successfully")
  )


})


const logoutUser = asyncHandler(async (req, res) => {
  

  await User.findByIdAndUpdate(req.user._id,{
    $set:{
      refreshToken: undefined
    }
  },{
    new:true
  }).select("-password -refreshToken")
  
const options = {
  httpOnly:true,
  secure:true
}
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{}, "User Logged out Successfully")
  )
}
)
  
  // const {refreshToken} = req.cookies
  // if(!refreshToken){
  //   throw new ApiError(400,"Refresh token is required")
  // }
  
  // const {userId} = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
  
  // const user = await User.findById(userId)
  
  // if(!user){
  //   throw new ApiError(404,"User not found")}
  
  //   user.refreshToken = ""
  //   await user.save({validateBeforeSave:false})
  
  //   return res.status(200)
  //   .clearCookie("accessToken")
  //   .clearCookie("refreshToken")
  //   .json(
  //     new ApiResponse(200,{}, "User Logged out Successfully")
  //   )
  
  
  // })
export { registerUser,loginUser,logoutUser };
