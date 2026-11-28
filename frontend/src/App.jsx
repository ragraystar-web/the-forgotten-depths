import logo from './assets/forgotten-depths-logo.webp'
import cavernBg from './assets/forgotten-cavern.png'
import { useState, useEffect, useRef } from 'react';
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const checkoutLock = useRef(false);
  
  useEffect(() => {
    fetch("/api/books")
    .then((response) => response.json())
    .then((data) => setBooks(data))
    .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const addToCart = (bookToAdd) => {
    setCheckoutCompleted(false);
    setCheckoutMessage("");

   setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => item.id === bookToAdd.id
    );

    if (existingItem) {
      if (existingItem.quantity >= bookToAdd.stock) {
        setCartMessage(`Maximum stock reached for "${bookToAdd.title}".`);

        return currentItems;
      }
      
      setCartMessage("");

      return currentItems.map((item) =>
        item.id === bookToAdd.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    if (bookToAdd.stock <= 0) {
      return currentItems;
    }
    
    return [...currentItems, { ...bookToAdd, quantity: 1 }];

  });

  };

  const updateQuantity = (bookId, change) => {
  const existingItem = cartItems.find(
    (item) => item.id === bookId
  );

  if (change > 0 && existingItem && existingItem.quantity >= existingItem.stock) {
    setCartMessage(
      `Maximum stock reached for "${existingItem.title}".`
    );
    return;
  }

  setCartMessage("");

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



const validateCheckout = async () => {

  if (checkoutLock.current) {
    return false;
  }

  if (checkoutCompleted) {
    setCheckoutMessage("This order has already been completed.");
    return false;
  }

  if (cartItems.length === 0) {
    setCheckoutMessage("Your cart is empty. Add books before proceeding.");
    return false;
  }

const invalidItem = cartItems.find(
  (item) => !books.some((book) => book.id === item.id)
);

if (invalidItem) {
  setCheckoutMessage(`Invalid book ID: ${invalidItem.id}`);
  return false;
}

const invalidQuantity = cartItems.find(
  (item) => !Number.isInteger(item.quantity) || item.quantity <= 0
);

if (invalidQuantity) {
  setCheckoutMessage(
    `Invalid quantity for "${invalidQuantity.title}".`
  );
  return false;
}

const insufficientStock = cartItems.find(
  (item) => item.quantity > item.stock
);

if (insufficientStock) {
  setCheckoutMessage(
    `Insufficient stock for "${insufficientStock.title}". Available: ${insufficientStock.stock}.`
  );
  return false;
}

const invalidPrice = cartItems.find((item) => {
  const catalogBook = books.find((book) => book.id === item.id);

  return item.price !== catalogBook.price;
});

if (invalidPrice) {
  setCheckoutMessage(
    `Invalid price for "${invalidPrice.title}".`
  );
  return false;
}

const expectedTotal = cartItems.reduce((total, item) => {
  const catalogBook = books.find((book) => book.id === item.id);

  return total + catalogBook.price * item.quantity;
}, 0);

if (cartTotal !== expectedTotal) {
  setCheckoutMessage("Order total does not match the expected total.");
  return false;
}

    try {

    checkoutLock.current = true;
    setCheckoutLoading(true);  

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setCheckoutMessage(data.error || "Checkout failed.");
      return false;
    }

    setCheckoutCompleted(true);

    setCartItems([]);

    fetch("/api/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error refreshing books:", error));

    setCheckoutMessage(
      `Order validated successfully! Total: ₱${data.order.total.toLocaleString("en-PH")}`
    );

return true;

  } catch (error) {
      setCheckoutMessage("Unable to connect to the server. Please try again.");
      return false;
    } finally {
      checkoutLock.current = false;
      setCheckoutLoading(false);
      }
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
        {cartMessage && <p className="cart-message">{cartMessage}</p>}

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
            <button className="checkout-button" disabled={cartItems.length === 0} onClick={() => 
              {setIsCheckoutOpen(true);
              setIsCartOpen(false);
              }}>
              Proceed to Checkout
            </button>
          </div>
      )}

      {isCheckoutOpen && (
        <div className="checkout-panel">
          <h2>Checkout</h2>
          <p>Review your order before proceeding.</p>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                  Unit Price: ₱{item.price.toLocaleString('en-PH')}</p>
                  <p>
                  Subtotal: ₱{(item.price * item.quantity).toLocaleString('en-PH')}</p>
        </div>
      ))}

    </div>

    <p>
    Order Total: ₱{cartTotal.toLocaleString('en-PH')}
    </p>
    
   

    <button
      onClick={validateCheckout}
      disabled={checkoutLoading || checkoutCompleted}
    >
      {checkoutLoading
        ? "Processing Order..."
        : checkoutCompleted
        ? "Order Completed"
        : "Validate Order"}
    </button>
    
    {checkoutMessage && (
      <p className="checkout-message">{checkoutMessage}</p>
      )}
      
      <button onClick={() => setIsCheckoutOpen(false)}>
        Back to Store
      </button>

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
      <div className="book-card" key={book.id} onClick={() => setSelectedBook(book)}>
        <div className="book-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} />
            ) : (
            <span>BOOK COVER</span>
          )}
        </div>

        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.description}</p>
        <p>₱{book.price.toLocaleString('en-PH')}</p>

        <button
          type="button" className="add-to-cart-button" disabled={book.stock === 0}
          onClick={() => addToCart(book)}
        >
        
        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
      <div className="book-card" key={book.id} onClick={() => setSelectedBook(book)}>
        <div className="book-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} />
            ) : (
            <span>BOOK COVER</span>
          )}
        </div>

        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.description}</p>
        <p>₱{book.price.toLocaleString('en-PH')}</p>

        <button
          type="button" className="add-to-cart-button" disabled={book.stock === 0}
          onClick={() => addToCart(book)}
        >
        
        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

      </div>

    ))}

  </div>

</section>

      </main>

      {selectedBook && (
        <div className="book-details-overlay" onClick={() => setSelectedBook(null)}>
          <div className="book-details-panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-details-button"
              onClick={() => setSelectedBook(null)}
            >
              ✕
            </button>

            <div className="book-details-content">
              {selectedBook.cover && ( <img className="book-details-cover" src={selectedBook.cover} alt={selectedBook.title} />
              )}
            <div className="book-details-info">
              <h2>{selectedBook.title}</h2>
              <p>{selectedBook.author}</p>
              <p>Category: {selectedBook.category}</p>
              <p>{selectedBook.description}</p>
              <p>₱{selectedBook.price.toLocaleString('en-PH')}</p>
              <p>Stock Available: {selectedBook.stock}</p>
              <p
                className={`stock-status ${
                  selectedBook.stock === 0
                  ? "out-of-stock": selectedBook.stock <= 3
                  ? "low-stock"
                  : "in-stock"
                  }`}
              >

  {selectedBook.stock === 0
    ? "Out of Stock"
    : selectedBook.stock <= 3
      ? "Low Stock"
      : "In Stock"}
</p>
              
              <button disabled={selectedBook.stock === 0}
                onClick={() => addToCart(selectedBook)}
              >
              {selectedBook.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default App
