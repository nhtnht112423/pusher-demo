import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import pusherConfig from "./pusherConfig";
import Pusher from "pusher-js";
import {UserAPI} from "./api";
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
    useEffect( () => {
        if(!user || !token) return;
        const pusher = new Pusher(pusherConfig.key, {
            ...pusherConfig,
            channelAuthorization: {
                endpoint: "http://localhost:3005/api/v1/pubsub/auth",
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        });

        const userChannelName = `private-USER-${user.safe_id}`;
        const event = 'EVENT';
        const userChannel = pusher.subscribe(userChannelName);
        userChannel.bind(event, (data) => {
            console.log('Received user event:', data);
        });

        const clientChannelName = `private-CLIENT-${user.currentClientId}`;
        const clientChannel = pusher.subscribe(clientChannelName);
        clientChannel.bind(event, (data) => {
            console.log('Received client event:', data);
        });

        console.log('=====userChannelName', userChannelName)
        console.log('=====clientChannelName', clientChannelName)


        // Clean up the subscription on component unmount
        return () => {
            clientChannel.unbind(event);
            userChannelName.unbind(event);
            pusher.unsubscribe(clientChannelName);
            pusher.unsubscribe(userChannelName);
        };
    }, [token, user]);

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
