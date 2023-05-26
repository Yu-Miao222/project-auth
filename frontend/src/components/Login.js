import React, { useEffect, useState } from "react";
import styled  from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import user from "reducers/user";
import { API_URL } from "utils/urls";

const FormWrapper = styled.div `
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  text-align: center;
  
`
const InnerWrapper = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    border: 1px solid #845ec2;
    box-shadow: 4px 4px 8px #845ec2;
    padding: 10px;
    margin: 120px;
`


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector(store => store.user.accessToken);
    useEffect(() => {
        if(accessToken) {
            navigate("/")
        }
    }, [accessToken]);

    const onFormSubmit = (event) => {
        event.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        }
        fetch(API_URL(mode), options)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    console.log(data)
                    dispatch(user.actions.setAccessToken(data.response.accessToken));
                    dispatch(user.actions.setUsername(data.response.username));
                    dispatch(user.actions.setUserId(data.response.id));
                    dispatch(user.actions.setError(null));
                } else {
                    dispatch(user.actions.setAccessToken(null));
                    dispatch(user.actions.setUsername(null));
                    dispatch(user.actions.setUserId(null));
                    dispatch(user.actions.setError(data.response))
                }
            })
    }

    return (
        <FormWrapper>
            <InnerWrapper>
                <label htmlFor="register">Register</label>
                <input 
                    type="radio" 
                    id="register" 
                    checked={mode === "register"}
                    onChange={() => setMode("register")}/>
                <label htmlFor="login">Login</label>
                <input 
                    type="radio" 
                    id="login" 
                    checked={mode === "login"}
                    onChange={() => setMode("login")}/>
                <form onSubmit={onFormSubmit}>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Submit</button>
                </form>
            </InnerWrapper>
        </FormWrapper>
        
    )
}
export default Login;