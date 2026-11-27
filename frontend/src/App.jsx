import logo from './assets/forgotten-depths-logo.webp'
import cavernBg from './assets/forgotten-cavern.png'
import { useState } from 'react';
import books from './books';
import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const addToCart = (bookToAdd) => {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => item.id === bookToAdd.id
    );

    if (existingItem) {
      return currentItems.map((item) =>
        item.id === bookToAdd.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...currentItems, { ...bookToAdd, quantity: 1 }];
  });
};

  const updateQuantity = (bookId, change) => {
  setCartItems((currentItems) =>
    currentItems
      .map((item) =>
        item.id === bookId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  return (  
    <>
      <header className="site-header">
        <div className="brand">
          <img src={logo} alt="The Forgotten Depths Bookstore" />
        </div>

        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#catalog">Catalog</a>
          <a href="#elder-scrolls">Elder Scrolls</a>
          <a href="#warhammer">Warhammer 40K</a>
        </nav>

        <div className="header-actions">
          <button
            className="cart-button"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>
      </header>

      {isCartOpen && (
        <div className="cart-panel">
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
        cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <h3>{item.title}</h3>
          <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, -1)}>
              −
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQuantity(item.id, 1)}>
              +
              </button>
          </div>
          <p>Price: ₱{item.price.toLocaleString('en-PH')}</p>
          <p>
            Subtotal: ₱{(item.price * item.quantity).toLocaleString('en-PH')}
          </p>
          </div>
              ))
            )}
            <p className="cart-total">
            Total: ₱{cartTotal.toLocaleString('en-PH')}
            </p>
          </div>
      )}

      <main>
        <section 
          className="hero"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(5, 8, 10, 0.35),
                rgba(5, 8, 10, 0.55)
                ),
                url(${cavernBg})`
          }}>
          <p className="hero-label">AN ARCHIVE BEYOND TIME</p>

          <h1>The Forgotten Depths</h1>

          <p className="hero-description">
            Where forgotten knowledge is rediscovered.
            <br />
            Explore the books, legends, and secrets buried beneath the ages.
          </p>

          <a href="#catalog" className="explore-button">
            Explore the Collection
          </a>
        </section>

        
<section id="catalog" className="catalog-intro">
  <p className="section-label">THE ARCHIVES ARE OPEN</p>
  <h2>Discover the Collection</h2>
  <p>
    Knowledge from worlds long forgotten, waiting to be rediscovered.
  </p>

  <div className="collection-grid">
    <a href="#elder-scrolls" className="collection-card">
      <span className="collection-number">ARCHIVE I</span>
      <h3>The Elder Scrolls</h3>
      <p>
        Chronicles, legends, magic, and the forgotten history of Tamriel.
      </p>
      <span className="collection-link">ENTER ARCHIVE →</span>
    </a>

    <a href="#warhammer" className="collection-card">
      <span className="collection-number">ARCHIVE II</span>
      <h3>Warhammer 40,000</h3>
      <p>
        The grim darkness of the far future, preserved in the written word.
      </p>
      <span className="collection-link">ENTER ARCHIVE →</span>
    </a>
  </div>

  <h2 id="elder-scrolls">The Elder Scrolls Archive</h2>
  <p>Chronicles, histories, and forgotten knowledge of Tamriel.</p>

  <div className="book-grid">
    
  {books
    .filter((book) => book.universe === "elder-scrolls")
    .map((book) => (
      <div className="book-card" key={book.id}>
        <div className="book-cover">
          BOOK COVER
        </div>

        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.description}</p>
        <p>₱{book.price.toLocaleString('en-PH')}</p>

        <button
          type="button"
          className="add-to-cart-button"
          onClick={() => addToCart(book)}
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>

  <h2 id="warhammer">Warhammer 40,000 Archive</h2>
  <p>The grim darkness of the far future, chronicled across the Imperium and beyond.</p>

  <div className="book-grid">
  {books
    .filter((book) => book.universe === "warhammer-40k")
    .map((book) => (
      <div className="book-card" key={book.id}>
        <div className="book-cover">
          BOOK COVER
        </div>

        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.description}</p>
        <p>₱{book.price.toLocaleString('en-PH')}</p>

        <button
          type="button"
          className="add-to-cart-button"
          onClick={() => addToCart(book)}
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>

</section>

      </main>
    </>
  )
}

export default App
