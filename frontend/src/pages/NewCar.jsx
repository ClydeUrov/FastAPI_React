import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import Layout from "../components/Layout"
import FormInput from '../components/FormInput';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';

const NewCar = () => {
    const [apiError, setApiError] = useState()
    const {user} = useAuth()
    let navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onErrors = errors => console.error(errors);
    console.log("here")
    const onFormSubmit  = async (data) => {
        console.log(user.id)
        data['owner'] = user.id
        console.log(data)
        const response = await fetch('http://127.0.0.1:8000/cars/',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${user.token}`
            },
            body:JSON.stringify(data)}        
        )

        // if the submit is successful - console
        if (response.ok){
            navigate("/protected", {replace:true})
        } else {
            let errorResponse = await response.json()
            let errArray = errorResponse.detail.map(el=>{
                return `${el.loc[1]} -${el.msg}`
            })        
            setApiError(errArray)
        }
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <div className="flex flex-col justify-center items-center">
                    <label class="label">
                        <span class="label-text">Car brand</span>   
                    </label>
                    <input 
                        type="text" 
                        placeholder="brand" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="brand"
                        autoComplete="off"
                        {...register('brand',{ required: "The brand is required" })}
                    />
                    {errors?.brand && errors.brand.message}

                    <label class="label">
                        <span class="label-text">Car model</span>   
                    </label>
                    <input 
                        type="text" 
                        placeholder="make" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="make"
                        autoComplete="off"
                        {...register('make',{ required: "The make is required" })}
                    />
                    {errors?.make && errors.make.message}

                    <label class="label">
                        <span class="label-text">Production year</span>   
                    </label>

                    <input 
                        type="number" 
                        placeholder="year" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="year"
                        autoComplete="off"
                        {...register('year',{ required: "The year is required" })}
                    />
                    {errors?.year && errors.year.message}

                    <label class="label">
                        <span class="label-text">Mileage in Km</span>   
                    </label>
                    <input 
                        type="number" 
                        placeholder="km" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="km"
                        autoComplete="off"
                        {...register('km',{ required: "The km is required" })}
                    />
                    {errors?.km && errors.km.message}


                    <label class="label">
                        <span class="label-text">Engine displacement (cm3)</span>   
                    </label>
                    <input 
                        type="number" 
                        placeholder="cm3" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="cm3"
                        autoComplete="off"
                        {...register('cm3',{ required: "The cm3 is required" })}
                    />
                    {errors?.cm3 && errors.cm3.message}

                    <label class="label">
                        <span class="label-text">Price in Euro</span>   
                    </label>

                    <input 
                        type="number" 
                        placeholder="price" 
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="price"
                        autoComplete="off"
                        {...register('price',{ required: "The price is required" })}
                    />
                    {errors?.price && errors.price.message}

                    <button className="btn btn-outline btn-accent m-3 btn-block">Create</button>
                </div>
            </form>


            {apiError && 
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{apiError}</span>
                    </div>
                </div>}


        </div>
    )
}

// const NewCar = () => {
//     const emptyCar = {
//         "brand":"",
//         "make":"",
//         "year":null,
//         "cm3":null,
//         "price":null
//     }

//     const inputs = [
//         {
//             id:"brand",
//             name:"brand",
//             type:"text",
//             placeholder:"Brand",
//             label:"Brand"
//         },
//         {
//             id:"make",
//             name:"make",
//             type:"text",
//             placeholder:"Make",
//             label:"Make"
//         },
//         {
//             id:"year",
//             name:"year",
//             type:"number",
//             placeholder:"Year",
//             label:"Year"
//         },
//         {
//             id:"price",
//             name:"price",
//             type:"number",
//             placeholder:"Price",
//             label:"Price"
//         },
//         {
//             id:"cm3",
//             name:"cm3",
//             type:"number",
//             placeholder:"Cm3",
//             label:"Cm3"
//         },
//         {
//             id:"km",
//             name:"km",
//             type:"number",
//             placeholder:"km",
//             label:"km"
//         },
//     ]

//     const [newCar, setNewCar] = useState(emptyCar);
//     const [error, setError] = useState([]);
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         addCar(newCar)
//     }

//     const onChange = (e) => {
//         setNewCar({...newCar, [e.target.name]: e.target.value})
//     }

//     const handleReset = (e) => {
//         setNewCar(emptyCar)
//     }

//     const addCar = async (newCar) => {
//         const response = await fetch("http://127.0.0.1:8000/cars/", {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body:JSON.stringify(newCar)
//         })
//         const data = await response.json()

//         if (!response.ok) {
//             let errArray = data.detail.map(el => {
//                 return `${el.loc[1]} -${el.msg}`
//             })
//             setError(errArray)
//         } else {
//             setError([])
//             navigate('/cars')
//         }
//     }

//     return (
//         <Layout>
//             <div>
//                 <h1 className="text-center text-lg my-2 font-mono font-semibold">Insert a New Car</h1>
//             </div>
//             <div className="text-center my-2">New car status: {JSON.stringify(newCar)}</div>
//                 {error && <ul className='flex flex-col mx-auto text-center'>
//                     {error && error.map(
//                         (el, index) => (
//                             <li key={index} className="my-2 p-1 border-2 border-red-700 max-w-md mx-auto">{el}</li>
//                         )
//                     )}
//                 </ul>}
//             <div className='flex flex-row align-middle justify-center'>
//                 <form onSubmit={handleSubmit}>
//                     {inputs.map((input) => (
//                         <FormInput
//                             key={input.id}
//                             name={input.name}
//                             {...input}
//                             value={newCar[input.name]}
//                             onChange={onChange}
//                             required
//                         />
//                     ))}

//                     <button type="submit" onClick={handleSubmit} className="bg-yellow-500 m-2 w-full text-white rounded-md">
//                         Insert
//                     </button>
//                     <button type="reset" onClick={handleReset} className="bg-black m-2 w-full text-white rounded-md ">
//                         Reset
//                     </button>
//                 </form>
//             </div>
//         </Layout>
//     )
// }

export default NewCar;