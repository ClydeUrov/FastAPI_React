import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { setUser } = useAuth();
    const [apiError, setApiError] = useState({});
    let navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: '',
            role: '',
            email: ''
        }
    });

    const onFormSubmit = async (data) => {
        console.log("Form data:", data);
        try {
            const response = await fetch("http://127.0.0.1:8000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
    
            console.log("Response:", response);
    
            if (response.ok) {
                const user = await response.json();
                console.log("User data:", user);
                await setUser(user);
                navigate("/");
            } else {
                console.log("Server error");
                let errorResponse = await response.json();
                console.log("Error response:", errorResponse);
                setApiError(errorResponse["msg"]);
                setUser(null);
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    const onErrors = (errors) => console.error(errors);

    return (
        <div className="w-2/3 shadow-xl min-h-max flex flex-col items-center justify-center">
            <h2 className="text-xl text-primary text-center font-boldmy-2">
                Register page
            </h2>
            <form onSubmit={ handleSubmit(onFormSubmit, onErrors) }>
                <div  className="flex flex-col justify-center items-center">
                    <input
                        type="text"
                        placeholder="username"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="username"
                        autoComplete="off"
                        {...register("username", { required: "The username is required" })}
                    />
                    {errors?.username && <span className="error">{errors.username.message}</span>}

                    <input
                        type="password"
                        placeholder="your password"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="password"
                        {...register("password", { required: "The password is required"})}
                    />
                    {errors?.password && <span className="error">{errors.password.message}</span>}

                    <input
                        type="text"
                        placeholder="your role"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="role"
                        {...register("role", { required: "The field is required"})}
                    />
                    {errors?.role && <span className="error">{errors.role.message}</span>}

                    <input
                        type="text"
                        placeholder="your email"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="email"
                        {...register("email", { required: "The email is required"})}
                    />
                    {errors?.email && <span className="error">{errors.email.message}</span>}

                    <button className="btn btn-outline-info border rounded p-3 border-info btn-accent m-3 btn-block">
                        Register
                    </button>
                </div>
            </form>
            {apiError && (
                <div className="alert alert-error shadow-lg">
                    <div>
                        {Object.keys(apiError).map((key, index) => (
                            <span key={index}>{key}: {apiError[key]}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register;