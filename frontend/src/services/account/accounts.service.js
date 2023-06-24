import axios from "axios";


const baseURL = process.env.REACT_APP_API_URL;


const login = async credentials => {
    try {
        let token = null;
        let response = await fetch(baseURL + "/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })

        if (response) token = response.json();
        console.log(token);
        // console.log(token);
        return token;
    } catch(error){
        console.log(error.response.data);
        return error.response.data;
    }
}


const createUserAccount = async credentials => {
    try {
        let user = null;
        let response = await axios.post(baseURL + "/accounts/v1/users/", { ...credentials })
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        return error.response.data;
    }
}

const fetchUserDetails = async id => {
    try {
        let user = null;
        let response = await axios.get(baseURL + `/accounts/v1/users/${id}/`)
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        console.log(error.response.data);
        return error.response.data;
    }
}

const activateAccount = async (id, token) => {
    try {
        let user = null;
        let response = await axios.patch(baseURL + `/accounts/v1/users/${id}/account_activation/`, { token });
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        console.log(error.response.data);
        return error.response.data;
    }
}


const resendVerificationEmail = async (id) => {
    try {
        let status = null;
        let response = await axios.get(baseURL + `/accounts/v1/users/${id}/resend_otp/`);
        if (response) status = response.data;
        console.log(status);
        return status;
    } catch(error){
        console.log(error.response.data);
        return error.response.data;
    }
}


export const accountAPI = {
    createUserAccount,
    fetchUserDetails,
    activateAccount,
    login,
    resendVerificationEmail
}
