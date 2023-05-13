import { Layout, message } from 'antd';
import React, { useEffect, useState } from 'react';

import axios from './axios';
import ChatRoom from './components/ChatRoom/index';

const { Header, Content } = Layout;

interface IMessage {
  text: string;
  sender: string;
  timestamp: string;
}

interface IHistory {
  message: string;
  sender: string;
  timestamp: string;
}

interface IInitResponse {
  history: IHistory[];
  collection: string;
}

function App() {
  const [collection, setCollection] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data } = await axios.get<IInitResponse>('/api/init');
      const { history, collection } = data;
      setMessages(
        history.map(({ message, sender, timestamp }) => ({
          text: message,
          sender,
          timestamp,
        }))
      );
      setCollection(collection);
    } catch (error) {
      console.error(error);
      message.error('Failed init chat');
    }
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ color: 'white' }}>Shelly ({collection})</Header>
      <Content
        style={{
          padding: '10px',
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <ChatRoom history={messages} />
      </Content>
    </Layout>
  );
}

export default App;
