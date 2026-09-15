import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/hero_logo.png'
import { FiShoppingCart, FiUser } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className='navbar'>
      <nav className='navbar-container'>
        <Link to='/' className='navbar-logo' aria-label='PowerFit home'>
          <img src={logo} alt='PowerFit' />
        </Link>

        <ul className='navbar-links'>
          <li className='navbar-link'>
            <FiUser aria-hidden='true' />
            {isAuthenticated ? (
              <>
                <Link to='/myorders' className='navbar-link'>My Orders</Link>
                <span className='auth-user'>Hi, {user.name}</span>
                <button type='button' onClick={logout} className='auth-button'>Logout</button>
              </>
            ) : (
              <span className='auth-actions'>
                <Link to='/login' className='navbar-link'>Login</Link>
               
              </span>
            )}
          </li>
          <li>
            <Link to='/cart' className='navbar-link' aria-label='Open cart'>
              <FiShoppingCart aria-hidden='true' />
              {totalItems > 0 && <span className='cart-count'>{totalItems}</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar