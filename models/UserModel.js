const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default: [],
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    address: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }],
    wishlist: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    refreshToken: {
        type:String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},{
    timestamps: true,
});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
  this.password = await bcrypt.hash(this.password,12)
  next()
})

userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.resetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000
}

//Export the model
module.exports = mongoose.model('User', userSchema);