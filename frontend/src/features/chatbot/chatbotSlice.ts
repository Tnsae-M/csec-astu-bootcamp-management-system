import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: 'USER' | 'AI';
  timestamp: string;
}

interface ChatbotState {
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
}

const initialState: ChatbotState = {
  messages: [
    { id: '1', text: 'Hello! How can I help you today with the Bootcamp Management System?', sender: 'AI', timestamp: new Date().toISOString() }
  ],
  isOpen: false,
  isTyping: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    resetChat: (state) => {
      state.messages = initialState.messages;
      state.isOpen = false;
      state.isTyping = false;
    }
  },
});

export const { toggleChat, addMessage, setTyping, resetChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;
