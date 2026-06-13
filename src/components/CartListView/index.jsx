import { useCart } from '../../context/useCart'
import CartItem from '../CartItem'

import './index.css'

const CartListView = () => {
  const { items } = useCart()

  return (
    <ul className="cart-list">
      {items.map(eachCartItem => (
        <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
      ))}
    </ul>
  )
}

export default CartListView
