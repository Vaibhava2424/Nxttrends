import { useCart } from '../../context/useCart'
import Header from '../Header'
import './index.css'

const Cart = () => {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart } = useCart()

  return <>
  <Header />
    <div className="cart-container">
      <h1>Cart</h1>
      {items.length === 0 ? (
        <div className="empty-cart-card">
          <p className="empty-cart-message">Your cart is empty. Add some products!</p>
          <span className="empty-cart-note">Fresh picks and best deals are waiting for you.</span>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <h2>{item.title}</h2>
                  <p>by {item.brand}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="price-section">
                  <p className="cart-item-price">Rs {item.price * item.quantity}/-</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="cart-summary-card">
            <p className="summary-label">Cart Summary</p>
            <div className="summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <strong>Rs {totalPrice}/-</strong>
            </div>
            <p className="summary-note">Free delivery on orders above Rs 999.</p>
          </aside>
        </>
      )}
    </div>
  </>
}

export default Cart
