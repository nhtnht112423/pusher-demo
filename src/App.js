import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {UserAPI} from "./api";
import {usePusher} from "./pusher-hook";
const userAPI = new UserAPI();
function App() {
    const [token, setToken] = useState('')
    const [user, setUser] = useState(null)
    useEffect( () => {
        const func = async () => {
            const token = await userAPI.login();
            const user = await userAPI.me();
            setToken(token);
            setUser(user);
        }
        func();
    },[])

    const { userEvent, clientEvent }  = usePusher(user, token);

    useEffect(() => {
        console.log('====userEvent', userEvent)
    },[userEvent])

    useEffect(() => {
        console.log('====clientEvent', clientEvent)
    },[clientEvent])

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
