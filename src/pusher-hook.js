import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import pusherConfig from './pusherConfig';

let pusher;
export const usePusher = (user, token) => {
    const [userEvent, setUserEvent] = useState(null);
    const [clientEvent, setClientEvent] = useState(null);

    useEffect(() => {
        if (!user || !token) return;
        if (!pusher) {
            pusher = new Pusher(pusherConfig.key, {
                ...pusherConfig,
                channelAuthorization: {
                    endpoint: "http://localhost:3005/api/v1/pubsub/auth",
                    params: {
                        safeId: user.safe_id,
                        clientId: user.currentClientId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                }
            });
        }

        const userChannelName = `private-USER-${user.safe_id}`;
        const event = 'EVENT';
        const userChannel = pusher.subscribe(userChannelName);
        userChannel.bind(event, (data) => {
            setUserEvent(data);
        });

        const clientChannelName = `private-CLIENT-${user.currentClientId}`;
        const clientChannel = pusher.subscribe(clientChannelName);
        clientChannel.bind(event, (data) => {
            setClientEvent(data);
        });

        // Clean up the subscription on component unmount
        return () => {
            clientChannel.unbind(event);
            userChannel.unbind(event);
            pusher.unsubscribe(clientChannelName);
            pusher.unsubscribe(userChannelName);
        };
    }, [token, user]);

    return { userEvent, clientEvent };
}
