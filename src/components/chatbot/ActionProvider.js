import axios from "axios";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.dispatch = null; // Initialize as null, will be set by subclass
  }

  updateConversationState = (state) => {
    this.setState((prevState) => ({
      ...prevState,
      conversationState: state,
    }));
  };

  updateSearchParams = (params) => {
    this.setState((prevState) => ({
      ...prevState,
      searchParams: {
        ...prevState.searchParams,
        ...params,
      },
    }));
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  // Handle greeting
  handleGreeting = () => {
    const message = this.createChatBotMessage(
      "Hello! I can help you find and book hotels or quick stays. What would you like to search for?",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };

  // Show help message
  showHelp = () => {
    const message = this.createChatBotMessage(
      "I can help you with:\n" +
        "- Finding hotels in any city\n" +
        "- Finding quick stays for hourly or short-term rentals\n" +
        "- Booking accommodations with your preferences\n\n" +
        "Just tell me what you're looking for!",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };

  // Handle unknown inputs
  handleUnknown = () => {
    const message = this.createChatBotMessage(
      "I'm not sure what you're looking for. Would you like to search for hotels or quick stays?",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };

  // Reset search
  resetSearch = () => {
    this.setState((prevState) => ({
      ...prevState,
      hotels: [],
      quickStays: [],
      searchParams: {
        city: null,
        checkIn: null,
        checkOut: null,
        adults: 2,
        children: 0,
      },
      currentSearch: null,
      conversationState: "initial",
    }));

    const message = this.createChatBotMessage(
      "Let's start over. What would you like to search for?",
      {
        widget: "options",
      }
    );
    this.addMessageToState(message);
  };

  // Handle hotel search intent
  handleHotelSearch = () => {
    this.setState((prevState) => ({
      ...prevState,
      currentSearch: "hotel",
      conversationState: "askingCity",
    }));

    const message = this.createChatBotMessage(
      "Great! Which city would you like to stay in?"
    );
    this.addMessageToState(message);
  };

  // Handle quick stay search intent
  handleQuickStaySearch = () => {
    this.setState((prevState) => ({
      ...prevState,
      currentSearch: "quickStay",
      conversationState: "askingCity",
    }));

    const message = this.createChatBotMessage(
      "Quick stays are perfect for short-term needs. Which city are you looking for a quick stay in?"
    );
    this.addMessageToState(message);
  };

  // Handle city response
  //   handleCityResponse = (city) => {
  //     const cleanCity = city.trim();

  //     if (cleanCity.length < 2) {
  //       const message = this.createChatBotMessage(
  //         "Please enter a valid city name."
  //       );
  //       return this.addMessageToState(message);
  //     }

  //     this.updateSearchParams({ city: cleanCity });

  //     if (this.state.currentSearch === "hotel") {
  //       this.updateConversationState("askingCheckIn");
  //       const message = this.createChatBotMessage(
  //         `Great! When would you like to check in to your hotel in ${cleanCity}?`,
  //         {
  //           widget: "datePicker",
  //           payload: { dateType: "checkIn" },
  //         }
  //       );
  //       this.addMessageToState(message);
  //     } else {
  //       // For quick stay, search immediately
  //       this.searchQuickStays(cleanCity);
  //     }
  //   };

  handleCityResponse = (city) => {
    const cleanCity = city.trim();

    if (cleanCity.length < 2) {
      const message = this.createChatBotMessage(
        "Please enter a valid city name."
      );
      return this.addMessageToState(message);
    }

    this.updateSearchParams({ city: cleanCity });

    this.setState((prevState) => {
      if (prevState.currentSearch === "hotel") {
        this.updateConversationState("askingCheckIn");
        const message = this.createChatBotMessage(
          `Great! When would you like to check in to your hotel in ${cleanCity}?`,
          {
            widget: "datePicker",
            payload: { dateType: "checkIn" },
          }
        );
        this.addMessageToState(message);
      } else {
        this.searchQuickStays(cleanCity);
      }
      return prevState; // you must return the previous state
    });
  };

  // Handle check-in response
  handleCheckInResponse = (date) => {
    // This would normally include validation
    this.updateSearchParams({ checkIn: date });
    this.updateConversationState("askingCheckOut");

    const message = this.createChatBotMessage(
      `Check-in date set to ${date}. When would you like to check out?`,
      {
        widget: "datePicker",
        payload: { dateType: "checkOut" },
      }
    );
    this.addMessageToState(message);
  };

  // Handle check-out response
  handleCheckOutResponse = (date) => {
    // This would normally include validation
    this.updateSearchParams({ checkOut: date });
    this.updateConversationState("askingAdults");

    const message = this.createChatBotMessage(
      "How many adults will be staying?",
      {
        widget: "guestCounter",
        payload: { guestType: "adults" },
      }
    );
    this.addMessageToState(message);
  };

  // Handle adults response
  handleAdultsResponse = (adults) => {
    const adultCount = parseInt(adults);

    if (isNaN(adultCount) || adultCount < 1) {
      const message = this.createChatBotMessage(
        "Please enter a valid number of adults (minimum 1)."
      );
      return this.addMessageToState(message);
    }

    this.updateSearchParams({ adults: adultCount });
    this.updateConversationState("askingChildren");

    const message = this.createChatBotMessage(
      "How many children will be staying?",
      {
        widget: "guestCounter",
        payload: { guestType: "children" },
      }
    );
    this.addMessageToState(message);
  };

  // Handle children response
  //   handleChildrenResponse = (children) => {
  //     const childCount = parseInt(children);

  //     if (isNaN(childCount) || childCount < 0) {
  //       const message = this.createChatBotMessage(
  //         "Please enter a valid number of children (0 or more)."
  //       );
  //       return this.addMessageToState(message);
  //     }

  //     this.updateSearchParams({ children: childCount });

  //     // Now we have all the information, so we can search for hotels
  //     const { city, checkIn, checkOut, adults } = this.state.searchParams;

  //     const message = this.createChatBotMessage(
  //       `Thanks for the information! I'll search for hotels in ${city} for ${adults} adults and ${childCount} children from ${checkIn} to ${checkOut}.`
  //     );
  //     this.addMessageToState(message);

  //     this.searchHotels(city, checkIn, checkOut, adults, childCount);
  //   };

  handleChildrenResponse = (children) => {
    const childCount = parseInt(children);

    if (isNaN(childCount) || childCount < 0) {
      const message = this.createChatBotMessage(
        "Please enter a valid number of children (0 or more)."
      );
      return this.addMessageToState(message);
    }

    this.updateSearchParams({ children: childCount });

    this.setState((prevState) => {
      const { city, checkIn, checkOut, adults } = prevState.searchParams;

      // Dispatch to SearchContext
      if (this.dispatch) {
        this.dispatch({
          type: "NEW_SEARCH",
          payload: {
            city,
            dates: [new Date(checkIn), new Date(checkOut)],
            options: {
              adult: adults,
              children: childCount,
              room: 1, // You might want to add rooms to your chat interface
            },
          },
        });
      }

      const message = this.createChatBotMessage(
        `Thanks for the information! I'll search for hotels in ${city} for ${adults} adults and ${childCount} children from ${checkIn} to ${checkOut}.`
      );
      this.addMessageToState(message);

      this.searchHotels(city, checkIn, checkOut, adults, childCount);

      return prevState;
    });
  };

  // Search hotels API
  searchHotels = async (city, checkIn, checkOut, adults, children) => {
    const loadingMessage = this.createChatBotMessage("Searching for hotels...");
    this.addMessageToState(loadingMessage);

    try {
      const response = await axios.get(
        `https://tourstay-server.onrender.com/api/hotels/search`,
        {
          params: {
            city,
            checkIn,
            checkOut,
            adults,
            children,
          },
        }
      );

      const results = response.data;

      if (results && results.length > 0) {
        this.setState((prevState) => ({
          ...prevState,
          hotels: results,
          conversationState: "showingResults",
        }));

        const resultMessage = this.createChatBotMessage(
          `I found ${results.length} hotels in ${city}!`,
          {
            widget: "hotelList",
          }
        );
        this.addMessageToState(resultMessage);

        const actionMessage = this.createChatBotMessage(
          "Type 'show more' to see more hotels or 'new search' to start over."
        );
        this.addMessageToState(actionMessage);
      } else {
        const noResultsMessage = this.createChatBotMessage(
          `Sorry, I couldn't find any hotels in ${city} for your dates. Would you like to try different dates or a different city?`
        );
        this.addMessageToState(noResultsMessage);
        this.updateConversationState("initial");
      }
    } catch (error) {
      console.error("Error searching hotels:", error);
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error searching for hotels. Please try again later."
      );
      this.addMessageToState(errorMessage);
      this.updateConversationState("initial");
    }
  };

  // Search quick stays API
  searchQuickStays = async (city) => {
    const loadingMessage = this.createChatBotMessage(
      "Searching for quick stays..."
    );
    this.addMessageToState(loadingMessage);

    try {
      const response = await axios.get(
        `https://tourstay-server.onrender.com/api/quickrooms/searchforChat`,
        {
          params: { city },
        }
      );

      const results = response.data;

      if (results && results.length > 0) {
        this.setState((prevState) => ({
          ...prevState,
          quickStays: results,
          conversationState: "showingResults",
        }));

        const resultMessage = this.createChatBotMessage(
          `I found ${results.length} quick stay options in ${city}!`,
          {
            widget: "quickStayList",
          }
        );
        this.addMessageToState(resultMessage);

        const actionMessage = this.createChatBotMessage(
          "Type 'show more' to see more options or 'new search' to start over."
        );
        this.addMessageToState(actionMessage);
      } else {
        const noResultsMessage = this.createChatBotMessage(
          `Sorry, I couldn't find any quick stays in ${city}. Would you like to try a different city?`
        );
        this.addMessageToState(noResultsMessage);
        this.updateConversationState("initial");
      }
    } catch (error) {
      console.error("Error searching quick stays:", error);
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error searching for quick stays. Please try again later."
      );
      this.addMessageToState(errorMessage);
      this.updateConversationState("initial");
    }
  };

  // Handle booking intent
  handleBookingIntent = (itemNumber) => {
    const bookingMessage = this.createChatBotMessage(
      "Great choice! I'll take you to the booking page for this selection. Normally, this would redirect you to the booking form with all your details pre-filled!"
    );
    this.addMessageToState(bookingMessage);

    // In a real implementation, this would redirect or open a booking form
    // e.g., window.location.href = `/booking?id=${selectedItemId}`;
  };

  // Show more results
  showMoreResults = () => {
    const message = this.createChatBotMessage("Here are more options:", {
      widget:
        this.state.currentSearch === "hotel" ? "hotelList" : "quickStayList",
      payload: { page: 2 },
    });
    this.addMessageToState(message);
  };
}

export default ActionProvider;
