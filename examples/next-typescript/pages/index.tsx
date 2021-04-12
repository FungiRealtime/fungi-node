import { Channel, Client } from '@fungi-realtime/core';
import { useEffect, useRef, useState } from 'react';

interface CountEvent {
  amount: number;
}

function Index() {
  const fungi = useRef<Client>();
  const countChannel = useRef<Channel>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    fungi.current = new Client({
      wsEndpoint: 'ws://localhost:8080',
      httpEndpoint: 'http://localhost:8080',
      auth: {
        endpoint: '/api/authorize',
      },
    });
  }, []);

  const subscribe = () => {
    const channel = fungi.current.subscribe('private-count');
    if (!countChannel.current) {
      countChannel.current = channel;

      countChannel.current.bind<CountEvent>('increment', data => {
        setCount(currentCount => currentCount + data.amount);
      });

      countChannel.current.bind<CountEvent>('decrement', data => {
        setCount(currentCount => currentCount - data.amount);
      });
    }
  };

  const unsubscribe = () => {
    fungi.current.unsubscribe('private-count');
  };

  return (
    <>
      <h1>Count: {count}</h1>

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() =>
            countChannel.current?.isSubscribed ? fetch('/api/increment') : {}
          }
        >
          Increment
        </button>
        <button
          onClick={() =>
            countChannel.current?.isSubscribed ? fetch('/api/decrement') : {}
          }
        >
          Decrement
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={subscribe}>Subscribe</button>
        <button onClick={unsubscribe}>Unsubscribe</button>
      </div>
    </>
  );
}

export default Index;
