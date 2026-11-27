import logo from './assets/forgotten-depths-logo.webp'
import cavernBg from './assets/forgotten-cavern.png'
import books from './books';
import './App.css'

function App() {
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
          <button className="cart-button">Cart (0)</button>
        </div>
      </header>

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
  <div className="book-grid">
  {books.map((book) => (
    <div className="book-card" key={book.id}>
      <div className="book-cover">
        BOOK COVER
      </div>

      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>₱{book.price.toLocaleString('en-PH')}</p>
    </div>
                        ))}
  </div>
</section>

      </main>
    </>
  )
}

export default App
