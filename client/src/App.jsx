import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import About from './pages/about';
import Profile from './pages/profile';
import Header from './components/header';


export default function App(){
  return<BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signIn' element={<SignIn/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Routes>
  </BrowserRouter>
}