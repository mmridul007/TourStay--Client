class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCase = message.toLowerCase();

    // Check for search reset or new search
    if (
      lowerCase.includes("restart") ||
      lowerCase.includes("new search") ||
      lowerCase.includes("start over")
    ) {
      return this.actionProvider.resetSearch();
    }

    // Check for greeting
    if (
      lowerCase.includes("hello") ||
      lowerCase.includes("hi") ||
      lowerCase.includes("hey")
    ) {
      return this.actionProvider.handleGreeting();
    }

    // Check for help
    if (
      lowerCase.includes("help") ||
      lowerCase.includes("how") ||
      lowerCase.includes("what can you")
    ) {
      return this.actionProvider.showHelp();
    }

    // Check for booking intent
    if (
      lowerCase.includes("book") &&
      !isNaN(lowerCase.split("book")[1].trim())
    ) {
      const itemNumber = parseInt(lowerCase.split("book")[1].trim());
      return this.actionProvider.handleBookingIntent(itemNumber);
    }

    // Check for show more intent
    if (lowerCase.includes("show more") || lowerCase.includes("more options")) {
      return this.actionProvider.showMoreResults();
    }

    // Check if we're waiting for specific input based on conversation state
    const { conversationState } = this.state;

    if (conversationState === "askingCity") {
      return this.actionProvider.handleCityResponse(message);
    }

    if (conversationState === "askingCheckIn") {
      return this.actionProvider.handleCheckInResponse(message);
    }

    if (conversationState === "askingCheckOut") {
      return this.actionProvider.handleCheckOutResponse(message);
    }

    if (conversationState === "askingAdults") {
      return this.actionProvider.handleAdultsResponse(message);
    }

    if (conversationState === "askingChildren") {
      return this.actionProvider.handleChildrenResponse(message);
    }

    // Check for hotel search intent
    if (
      lowerCase.includes("hotel") ||
      lowerCase.includes("room") ||
      lowerCase.includes("stay")
    ) {
      return this.actionProvider.handleHotelSearch();
    }

    // Check for quick stay intent
    if (
      lowerCase.includes("quick") ||
      lowerCase.includes("short") ||
      lowerCase.includes("hour")
    ) {
      return this.actionProvider.handleQuickStaySearch();
    }

    // Check for city mentions
    const cityPattern = /(in|at|for|near)\s+([a-z]+)/i;
    const cityMatch = lowerCase.match(cityPattern);
    if (cityMatch) {
      return this.actionProvider.handleCityResponse(cityMatch[2]);
    }

    // Default fallback
    return this.actionProvider.handleUnknown();
  }
}

export default MessageParser;


