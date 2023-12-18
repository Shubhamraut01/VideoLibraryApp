import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const cars = ["volvo", "honda", "suzuki", "tata"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const response = await axios.get('https://dummyjson.com/products');
      // console.log("data",response.data.products)
      // setData(response.data.products);
      fetch("https://dummyjson.com/products")
        .then((res) => {
          console.log("res ::::", res);
          return res.json();
        })
        .then((data) => {
          console.log("data:::::", data);
        })
        .catch((error) => {
          console.log("error:::::", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {/* {
        data.map((item)=>{
        
           return ( 
           <div>
           <p>{item.title}</p>
           <p>{item.brand}</p>
           </div>
           )
         
        })
       
      } */}
    </div>
  );
}

export default App;
