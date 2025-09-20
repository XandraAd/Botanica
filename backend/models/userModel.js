// models/userModel.js
import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  CompanyName: { type: String },
  Country: { type: String, required: true },
  StreetAddress: { type: String, required: true },
  Apartment: { type: String },
  City: { type: String, required: true },
  State: { type: String, required: true },
  ZipCode: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  orderNotes: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  password: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: "" 
  },
 
  

  isAdmin: { 
    type: Boolean, 
    required: true, // Fixed: removed the extra comma and formatting issue
    default: false 
  }
}, { 
  timestamps: true 
});

const User = mongoose.model("User", userSchema);
export default User;