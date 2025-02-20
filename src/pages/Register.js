import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, formData);
      alert("Registration Successful!");
    } catch (error) {
      alert("Registration Failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
      <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
