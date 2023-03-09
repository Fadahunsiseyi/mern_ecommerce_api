const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
    }
},{
    timestamps: true,
});


userSchema.pre('save', async function(next){
  this.password = await bcrypt.hash(this.password,12)
  next()
})

userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Export the model
module.exports = mongoose.model('User', userSchema);