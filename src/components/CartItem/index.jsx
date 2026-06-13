import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import { useCart } from '../../context/useCart'

import './index.css'

const CartItem = props => {
  const {cartItemDetails} = props
  const {title, brand, quantity, price, imageUrl, id} = cartItemDetails
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <li className="cart-item">
      <img className="cart-product-image" src={imageUrl} alt={title} />
      <div className="cart-item-details-container">
        <div className="cart-product-title-brand-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-product-brand">by {brand}</p>
        </div>
        <div className="cart-quantity-container">
          <button type="button" className="quantity-controller-button" onClick={() => updateQuantity(id, quantity - 1)}>
            <BsDashSquare color="#52606D" size={12} />
          </button>
          <p className="cart-quantity">{quantity}</p>
          <button type="button" className="quantity-controller-button" onClick={() => updateQuantity(id, quantity + 1)}>
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div>
        <div className="total-price-delete-container">
          <p className="cart-total-price">Rs {price * quantity}/-</p>
          <button className="remove-button" type="button" onClick={() => removeFromCart(id)}>
            Remove
          </button>
        </div>
      </div>
      <button className="delete-button" type="button" onClick={() => removeFromCart(id)}>
        <AiFillCloseCircle color="#616E7C" size={20} />
      </button>
    </li>
  )
}

export default CartItem
