import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import ProductCard from '../ProductCard'
import FiltersGroup from '../FiltersGroup'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoryOptions = [
  {categoryId: 'clothing', name: 'Clothing'},
  {categoryId: 'electronics', name: 'Electronics'},
  {categoryId: 'appliances', name: 'Appliances'},
  {categoryId: 'grocery', name: 'Grocery'},
  {categoryId: 'toys', name: 'Toys'},
]

const getCategoryFromImageUrl = imageUrl => {
  const lowerImageUrl = (imageUrl || '').toLowerCase()

  if (lowerImageUrl.includes('clothes')) return 'clothing'
  if (lowerImageUrl.includes('electronics')) return 'electronics'
  if (lowerImageUrl.includes('appliances')) return 'appliances'
  if (lowerImageUrl.includes('grocery')) return 'grocery'
  if (lowerImageUrl.includes('toys')) return 'toys'

  return ''
}

const ratingsList = [
  {
    ratingId: '5',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/star-img.png',
  },
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/star-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/star-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/star-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/star-img.png',
  },
]

const AllProductsSection = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: [],
    errorMsg: null,
  })
  const [activeRatingId, setActiveRatingId] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    setApiResponse(prev => ({...prev, status: apiStatusConstants.inProgress}))
    try {
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/products'
      const options = {method: 'GET'}
      if (jwtToken) {
        options.headers = {Authorization: `Bearer ${jwtToken}`}
      }
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        const text = await res.text()
        const msg = `Request failed: ${res.status} ${res.statusText} - ${text}`
        console.error('Products API error', {apiUrl, options, status: res.status, statusText: res.statusText, body: text})
        throw new Error(msg)
      }
      const json = await res.json()
      const products = json.products || json
      const formattedData = products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
        category: getCategoryFromImageUrl(product.image_url),
      }))
      setApiResponse({
        status: apiStatusConstants.success,
        data: formattedData,
        errorMsg: null,
      })
    } catch (err) {
      setApiResponse({
        status: apiStatusConstants.failure,
        data: [],
        errorMsg: err.message,
      })
      console.error('getProducts error', err)
    }
  }

  const handleCategoryChange = categoryId => {
    setActiveCategoryId(categoryId === activeCategoryId ? '' : categoryId)
  }

  const handleRatingChange = ratingId => {
    setActiveRatingId(ratingId === activeRatingId ? '' : ratingId)
  }

  const handleSearchChange = value => {
    setSearchInput(value)
  }

  const handleClearFilters = () => {
    setActiveRatingId('')
    setActiveCategoryId('')
    setSearchInput('')
  }

  const enterSearchInput = () => {
    getProducts()
  }

  const renderLoading = () => <div className="loader">Loading...</div>

  const renderFailure = () => (
    <div className="failure">
      <p>Unable to load products. Try again later.</p>
    </div>
  )

  const getFilteredProducts = () => {
    const lowerSearchInput = searchInput.trim().toLowerCase()

    return apiResponse.data.filter(product => {
      const matchesCategory =
        !activeCategoryId || product.category === activeCategoryId
      const matchesRating =
        !activeRatingId || Number(product.rating) >= Number(activeRatingId)
      const matchesSearch =
        !lowerSearchInput ||
        product.title.toLowerCase().includes(lowerSearchInput) ||
        product.brand.toLowerCase().includes(lowerSearchInput)

      return matchesCategory && matchesRating && matchesSearch
    })
  }

  const renderProducts = () => {
    const filteredProducts = getFilteredProducts()

    return (
      <div className="all-products-container">
      <div className="filters-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeRatingId={activeRatingId}
          activeCategoryId={activeCategoryId}
          changeRating={handleRatingChange}
          changeCategory={handleCategoryChange}
          searchInput={searchInput}
          changeSearchInput={handleSearchChange}
          enterSearchInput={enterSearchInput}
          clearFilters={handleClearFilters}
        />
      </div>
      <div className="products-section">
        <h1 className="products-heading">All Products</h1>
        <ul className="products-list">
          {filteredProducts.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    </div>
    )
  }

  switch (apiResponse.status) {
    case apiStatusConstants.inProgress:
      return renderLoading()
    case apiStatusConstants.failure:
      return renderFailure()
    case apiStatusConstants.success:
      return renderProducts()
    default:
      return null
  }
}

export default AllProductsSection
