import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MyUserContext, MyDispatchContext, MyUserReducer } from './configs/Contexts';

const Main = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

reportWebVitals();
