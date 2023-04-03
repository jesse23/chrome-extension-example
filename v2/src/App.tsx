import React, { useCallback } from "react";
import { DOMMessage, DOMMessageResponse } from "./types";
import { ChakraProvider, Button } from '@chakra-ui/react'
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [title, setTitle] = React.useState("");
  const [headlines, setHeadlines] = React.useState<string[]>([]);

  const queryDom = useCallback(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as DOMMessage,
            (response: DOMMessageResponse) => {
              setTitle(response.title);
              setHeadlines(response.headlines);
            }
          );
        }
      );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ChakraProvider>
          <Button onClick={queryDom}>Query DOM</Button>
          {title && <div>Title: {title}</div>}
          {headlines && headlines.length > 0 && (
            <div>
              <div>
                H1 (count {headlines.length}) {"==>"}
              </div>
              <ul>
                {headlines.map(
                  (headline, index) =>
                    headline && <li key={index}>{headline}</li>
                )}
              </ul>
            </div>
          )}
        </ChakraProvider>
      </header>
    </div>
  );
}

export default App;
