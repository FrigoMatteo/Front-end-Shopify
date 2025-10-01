const sendPost=async (username, password)=>{
    const response=await fetch('http://localhost:10000/api/session/login', {
            method: "POST",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                username:username,
                password:password,
            })
            }
    )

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}


// Get products
const getProducts=async ()=>{

    const response=await fetch('http://localhost:10000/api/products',{
        method: "GET",
        credentials:'include'
    });
    const products=await response.json()

    //console.log("Products:", products)
    return products;

}

// Get orders
const getOrders=async ()=>{

    const response=await fetch('http://localhost:10000/api/orders',{
        method: "GET",
        credentials:'include'
    });
    const orders=await response.json()

    //console.log("Orders:", orders)
    return orders;

}



// Get user Sessions:
const getSessionAPI=async ()=>{

    const response=await fetch('http://localhost:10000/api/session/current',{
        method: "GET",
        credentials: 'include',
    });
    const user=await response.json()

    console.log("Credentials session", user)
    return user;

}


// Logout fetch
const logoutSession=async ()=>{

    const response=await fetch('http://localhost:10000/api/session/logout',{
        method: "DELETE",
        credentials: 'include',
    });
    const Logout=await response

    console.log("Logout", Logout)
    return Logout;

}

export {sendPost,getProducts,getOrders,getSessionAPI,logoutSession};