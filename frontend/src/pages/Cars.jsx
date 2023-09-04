import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const Cars = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
        fetch("http://127.0.0.1:8000/cars/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Fetched data:", data);
            setCars(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            setError(error); // Set the error state
        });
    }, [user.token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2 className="text-xl text-primary text-center font-bold my-5">
                Cars Page
            </h2>
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                {cars && cars.map((el, index) => (
                <Link key={index} to={`${el._id}`}>
                    <Card car={el} />
                </Link>
                ))}
            </div>
        </div>    
    );
};

export default Cars;

// import Layout from "../components/Layout";
// import Card from "../components/Card";
// import React, { useState, useEffect } from "react";

// function Cars () {
//     const [cars, setCars] = useState([]);
//     const [brand, setBrand] = useState("");
//     const [isPending, setIsPending] = useState(true);
//     const [page, setPage] = useState(1);

//     const handleChangeBrand = (event) => {
//         setCars([])
//         setBrand(event.target.value)
//         setIsPending(true)
//     }

//     const handleChangePage = (event) => {
//         setCars([])
//         setPage(event.target.value)
//         setIsPending(true)
//     }
//     console.log("I in cars")

//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/cars?brand=${brand}&page=${page}`)
//             .then(response => response.json())
//             .then(json => setCars(json))
//             setIsPending(false)
//     }, [brand, page])

//     return (
//         <Layout>
//             <h2 className="font-bold font-mono text-lg text-center my-4">Cars - {brand?brand:"all brands"}</h2>
//             <div className="mx-8">
//                 <label htmlFor="cars">Choose a brand: </label>
//                 <select name="cars" id="cars" onChange={handleChangeBrand}>
//                     <option value="">All cars</option>
//                     <option value="Fiat">Fiat</option>
//                     <option value="Citroen">Citroen</option>
//                     <option value="Renault">Renault</option>                   
//                     <option value="Opel">Opel</option>  
//                 </select>
//                 <label htmlFor="cars">Choose a page: </label>
//                 <select name="page" id="page" onChange={handleChangePage}>
//                     <option value="1">1</option>
//                     <option value="2">2</option>
//                     <option value="3">3</option>
//                     <option value="4">4</option>                   
//                     <option value="5">5</option>              
//                 </select>
//             </div>
//             <div className="mx-8">
//                 {isPending && <div><h2>Loading cars, brand:{brand}...</h2></div>} 
//                 <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//                     {cars && cars.map(
//                         (el)=>{
//                             return (<Card key={el._id} car = {el} />)
//                         }
//                     )}
//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default Cars;