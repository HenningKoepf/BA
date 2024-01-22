import logo from './logo.svg';
import './App.css';

import MyButton from './buttonfunctions';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>This page is currently under construction!</h1>
        <h2>Welcome to the FSK Webapp
        </h2>
        <MyButton />
        <p>
          Editing my script in  <code>src/App.js</code>.


        </p>
        <p>  React based to enjoy the Webapp or with plain functional Javascript</p>
        <a
          className="Hennings App-link"
          href="https://www.tcs.ifi.lmu.de/lehre/bsc-master-arbeiten_de.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lehrstuhl Ausschreibung
        </a>
      </header>

    </div>
  );
}



export default App;
