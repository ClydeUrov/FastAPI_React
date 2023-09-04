import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Card from "./Card";

const CarList = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    console.log("I'm here")
    useEffect(() => {
        console.log("I'm here")
        fetch("http://127.0.0.1:8000/cars/", {
            mathod: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setCars(json);
            });
    }, [user.token]);

    return (
        <div>
            <h2 className="text-xl text-primary text-center font-bold my-5">
                Cars Page
            </h2>
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                {cars && cars.map((el) => {
                    return <Card key={el._id} car={el} />
                })}
            </div>
        </div>    
    );
};

export default CarList;
