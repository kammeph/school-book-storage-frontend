import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

function App() {
  return (
    <main className="flex flex-col-reverse justify-stretch h-screen lg:flex-col">
      <Navigation />
      <Outlet />
    </main>
  );
}

export default App;
