import React from 'react';

const Login = (props) => {
    return (<div>
        Enter username and password to enter chat
        <form>username: <input className={'username'} onChange={(e) => {
            e.preventDefault();
            props.handleLogin(e.target.value);
        }}></input>
                </form>
                <form>password: <input className={'password'}></input>
                </form>
                <button onClick={(e) => {
                    e.preventDefault();
                    props.handleLogin('submit');
                }}> Submit </button>
        </div>);
}

export default Login;