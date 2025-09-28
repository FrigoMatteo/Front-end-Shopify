const sendPost=async (username, password)=>{
    const response=await fetch('http://localhost:3001/api/post/add', {
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

    console.log("Post inserted:", res)
    return res;

}