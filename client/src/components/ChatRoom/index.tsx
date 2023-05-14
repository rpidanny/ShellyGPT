import './styles.css';

import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Input, List, message } from 'antd';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import sheldon from '../../assets/sheldon_mid.png';
import axios from '../../axios';

interface IMessage {
  text: string;
  sender: string;
  timestamp: string;
}

interface IChatRoomProps {
  history: IMessage[];
}

function ChatRoom({ history }: IChatRoomProps) {
  const [messages, setMessages] = useState<IMessage[]>(history);
  const [newMessage, setNewMessage] = useState<string>('');
  const chatRoomRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(history);
  }, [history]);

  useEffect(() => {
    if (chatRoomRef.current) {
      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  }, [messages]);

  function handleNewMessage(event: ChangeEvent<HTMLTextAreaElement>) {
    setNewMessage(event.target.value);
  }

  function handleSendMessage() {
    if (newMessage.trim() !== '') {
      const newMessages = [
        ...messages,
        {
          text: newMessage,
          sender: 'user',
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(newMessages);
      setNewMessage('');

      axios
        .post('/api/chat', { message: newMessage })
        .then((response) => {
          if (response.status === 200) {
            const { text, sender, timestamp } = response.data;
            setMessages([...messages, { text, sender, timestamp }]);
          }
        })
        .catch((error) => {
          console.error(error);
          message.error('Failed to send message');
        });
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  function renderItem({ text, sender }: IMessage) {
    return (
      <List.Item className="message-bubble">
        <List.Item.Meta
          avatar={
            sender === 'user' ? (
              <Avatar icon={<UserOutlined />} />
            ) : (
              <Avatar src={sheldon} />
            )
          }
          description={
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      // children={String(children).replace(/\n$/, '')}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children)}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
          }
        />
      </List.Item>
    );
  }

  return (
    <div className="chat-room">
      <div className="chat-messages" ref={chatRoomRef}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          style={{ padding: '10px', color: 'black' }}
          renderItem={renderItem}
        />
      </div>
      <div className="chat-input">
        <Input.TextArea
          ref={messageInputRef}
          placeholder="Type a message..."
          autoFocus
          autoSave="on"
          value={newMessage}
          autoSize={{ minRows: 1, maxRows: 10 }}
          onChange={handleNewMessage}
          onKeyDown={handleKeyDown}
        />
        <SendOutlined className="send-icon" onClick={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatRoom;
