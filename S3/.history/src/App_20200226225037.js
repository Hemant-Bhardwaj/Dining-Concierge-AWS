import React from 'react';
import './App.css';

var apigClientFactory = require('./apigClient').default;

class ChatBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages : [],
      messageToSend: "",
      apigClient : null
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
  }

  changeMessage(event) {
    this.setState({
      messageToSend : event.target.value
    })
  }

  sendMessage() {
    let newMessage = this.state.messageToSend;
    this.setState({
      messages : this.state.messages.concat(newMessage)
    });

    this.setState({
      messageToSend: ""
    });

    
    let UnstructuredMessage = {
      "id" : "0",
      "text" : newMessage,
      "timestamp" : Date(Date.now()).toString()
    }
    
    let Message = {
        "type" : "string",
        "unstructured" : UnstructuredMessage
    }
    
    let botRequest = {
        "messages": [Message]
    }

    this.state.apigClient.chatbotPost(null, botRequest)
    .then((response) => {
      let responseMessage = JSON.parse(response.data.body).messages[0].unstructured.text;
      this.setState({
        messages : this.state.messages.concat(responseMessage)
      });
    })
    .catch((result) => {
      console.error(result);
    });
  }

  componentDidMount() {
    var apigClient = apigClientFactory.newClient({
      apiKey: '3PQW9K7GB44nRUE6q8jqL3QaokV1bKApNqBVegsc'
    });

    this.setState({
      apigClient : apigClient
    });
  }

  render() {
    return (
      <div className="App">
      <div className="App-header">
          <h1>Dining Concierge</h1>
        </div>
        {/* <ul className="Messages-list">
        {messages.map(m => this.renderMessage(m))}
      </ul> */}
          <div className="card d-flex flex-column align-items-end" style={{height:'90%'}}>
            <ul className="Messages-list">
                {this.state.messages.map((message, index) =>
                  // <ChatBubble message={message} />
                  <li className={"Messages-message"}>
                      <div className="Message-content" key={index} >
                        <div className="text">
                          {message}
                        </div>
                  </div>
                  </li>
                  )}
              </ul>
          </div>
          <div className="d-flex justify-content-end mt-2" >
          <input
            onChange={this.changeMessage}
            value={this.state.messageToSend}
            type="text"
            placeholder="Enter your message and press ENTER"
            autoFocus="{true}"
          />
          <button>Send</button>

          </div>

    )
  }
}

function App() {
  return (
      // <div className="row justify-content-center" style={{height:700}}>
        <div className="col m-4">
          <ChatBox />
        </div>
      // </div>
  );
}

export default App;
