
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import ViewContainer from './salaryView/view-container';

function App() {
  return (
    <div className="App">
      <div className="container">
              <ViewContainer user={{username: 'olotem321'}} />
            </div>
    </div>
  );
}

export default App;
