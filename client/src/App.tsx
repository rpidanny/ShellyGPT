import { Layout, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import axios from './axios';
import ChatRoom from './components/ChatRoom/index';

const { Header, Content } = Layout;
const { Title } = Typography;

interface IMessage {
  text: string;
  sender: string;
  date: string;
}

interface IHistory {
  message: string;
  sender: string;
  date: string;
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
        history.map(({ message, sender, date }) => ({
          text: message,
          sender,
          date,
        }))
      );
      setCollection(collection);
    } catch (error) {
      console.error(error);
      message.error('Failed init chat');
    }
  }

  return (
    <Layout style={{ height: '100vh', background: 'white' }}>
      <Header>
        <Title level={3} style={{ color: 'white' }}>
          Shelly ({collection})
        </Title>
      </Header>
      <Content
        style={{
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
