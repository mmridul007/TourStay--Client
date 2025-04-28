import { createChatBotMessage } from 'react-chatbot-kit';
import HotelList from './widgets/HotelList';
import QuickStayList from './widgets/QuickStayList';
import DatePicker from './widgets/DatePicker';
import GuestCounter from './widgets/GuestCounter';
import BotAvatar from './widgets/BotAvatar';

const config = {
  initialMessages: [
    createChatBotMessage("Hi there! I can help you find hotels and quick stays. What would you like to do?", {
      delay: 300,
      widget: 'options',
    }),
  ],
  botName: "Hotel Assistant",
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
  },
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => (
        <div className="options-container">
          <button 
            className="option-button"
            onClick={() => props.actionProvider.handleHotelSearch()}
          >
            Find Hotels
          </button>
          <button 
            className="option-button"
            onClick={() => props.actionProvider.handleQuickStaySearch()}
          >
            Find Quick Stays
          </button>
          <button 
            className="option-button"
            onClick={() => props.actionProvider.showHelp()}
          >
            Help
          </button>
        </div>
      ),
    },
    {
      widgetName: 'hotelList',
      widgetFunc: (props) => <HotelList {...props} />,
      mapStateToProps: ['hotels', 'searchParams'],
    },
    {
      widgetName: 'quickStayList',
      widgetFunc: (props) => <QuickStayList {...props} />,
      mapStateToProps: ['quickStays', 'searchParams'],
    },
    {
      widgetName: 'datePicker',
      widgetFunc: (props) => <DatePicker {...props} />,
      mapStateToProps: ['searchParams'],
    },
    {
      widgetName: 'guestCounter',
      widgetFunc: (props) => <GuestCounter {...props} />,
      mapStateToProps: ['searchParams'],
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#4CAF50',
    },
  },
  state: {
    hotels: [],
    quickStays: [],
    searchParams: {
      city: null,
      checkIn: null,
      checkOut: null,
      adults: 2,
      children: 0,
    },
    currentSearch: null, // 'hotel' or 'quickStay'
  }
};

export default config;