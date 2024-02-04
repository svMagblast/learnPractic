import Auth from './components/Auth';
import ModeratorPanel from './components/ModeratorPanel';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
const App = () => {
  return (
    <div>
      <Auth />
      <RequestForm />
      <RequestList />
      <ModeratorPanel />
    </div>
  );
};

export default App;
