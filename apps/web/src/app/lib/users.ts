export const UserLogin = async (data: any)  => {
    const res = await fetch(`http://localhost:8000/api/users/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': "application/json"
        }
    })
    const result = await res.json()
    return result
}

export const UserRegister = async (data: any) => {
    const res = await fetch(`http://localhost:8000/api/users`,{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const result = await res.json()
    return result
}