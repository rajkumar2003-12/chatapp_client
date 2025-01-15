import axios from "axios";
import { useState } from "react";
import { Signinput } from "../zod/zod"; 
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type FormData = z.infer<typeof Signinput>;

interface Token{
  token:string;
  message:string;
}
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {register,handleSubmit,formState: { errors },} = useForm<FormData>({resolver: zodResolver(Signinput),});

  const handleLogin = async (data: FormData) => {
    setLoading(true);
 

    try {
      const response = await axios.post<Token>(
        "http://localhost:3000/author/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201 || response.status === 200){

        const {token}  = response.data;
        localStorage.setItem("authToken",token)
        console.log("logged successful:", response.data);
        navigate('/home')
      }
     
    } catch (err) {
      console.error("Error during loggin:", err);
      alert("error during logging");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gary-100 h-full flex items-center justify-center py-8 px-4 mt-5">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-gray-100">
        <div className="mt-4 text-center mb-4">
          <h1 className="text-2xl font-bold">login into your account</h1>
          <p className="text-sm mb-2">
            don't have an account?{" "}
            <Link to="/signup" className="text-red-300 underline ml-2">
              signup
            </Link>
          </p>
        </div>
  
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-4"
        >
  
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
  
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-full transition duration-200"
            disabled={loading}
          >
            {loading ? "logging..." : "login"}
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Login

