

const sendPost=async (username, password)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/session/login', {
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

// Create client
const postClient=async (customer)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/create/client', {
            method: "POST",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                customer:customer,
            })
        }
    )

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}

// Create draftOrder
const postDraftOrder=async (draftOrder)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/create/draftOrder', {
            method: "POST",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                draftOrder:draftOrder,
            })
        }
    )

    const res=await response.json()

    console.log("Draft inserted:", res)
    return res;

}


// Get products
const getProducts=async ()=>{

    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/products',{
        method: "GET",
        credentials:'include',
        headers: {
            "Content-type": "application/json",
        },
    });
    const products=await response.json()

    //console.log("Products:", products)
    return products;

}

// Get orders
const getOrders=async ()=>{

    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/orders',{
        method: "GET",
        credentials:'include',
        headers: {
            "Content-type": "application/json",
        },
    });
    const orders=await response.json()

    //console.log("Orders:", orders)
    return orders;
}

// Get clients
const getClients=async ()=>{

    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/clients',{
        method: "GET",
        credentials:'include',
        headers: {
            "Content-type": "application/json",
        },
    });
    const clients=await response.json()

    //console.log("Clients:", clients)
    return clients;

}



// Get user Sessions:
const getSessionAPI=async ()=>{

    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/session/current',{
        method: "GET",
        credentials: 'include',
    });
    const user=await response.json()

    console.log("Credentials session", user)
    return user;

}


// Logout fetch
const logoutSession=async ()=>{

    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/session/logout',{
        method: "DELETE",
        credentials: 'include',
    });
    const Logout=await response

    console.log("Logout", Logout)
    return Logout;

}

//------------------------------------------------------------------------------------------------------------
const getListComms=async ()=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/createCom/list', {
            method: "GET",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            }
    )

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}

const createComm=async (username, password)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/createCom/create', {
            method: "POST",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                comUsername:username,
                comPassword:password,
            })
            }
    )

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}

const deleteComm=async (username)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/createCom/delete', {
            method: "DELETE",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                comUsername:username,
            })
            }
    )

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}

const updateCommPassword=async (username,oldPass,newPass)=>{
    const response=await fetch('https://backendshopifyhustleproduction.onrender.com/api/createCom/change', {
            method: "POST",
            credentials:'include',
            headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify({
                comUsername:username,
                password:oldPass,
                newPassword:newPass
            })
            }
    )
    

    const res=await response.json()

    //console.log("Post inserted:", res)
    return res;

}

export {deleteComm,createComm,getListComms,updateCommPassword,sendPost,getProducts,getOrders,getSessionAPI,logoutSession, getClients,postClient, postDraftOrder};



