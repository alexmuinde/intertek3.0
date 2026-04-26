import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-1'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl'>
            <span className='text-yellow-400'>Intertek</span>
          </h1>
        </Link>
        
        <form className='bg-slate-100 p-1 rounded-lg flex items-center'>
          <input type='text' placeholder='Search...' className='focus:outline-none w-24 sm:w-64'/>
          <FaSearch className='text-slate-500'/>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'><li className='hidden sm:inline hover:underline'>Home</li></Link>
          <Link to='/about'><li className='hidden sm:inline hover:underline'>About</li></Link>
          <Link to='/signIn'><li className='hover:underline'>Sign-In</li></Link>
          
        </ul>
      </div>
    </header>
  )
}
