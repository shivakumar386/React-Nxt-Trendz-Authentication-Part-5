// import {Component} from 'react'
// import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
// import Cookies from 'js-cookie'

// import Header from '../Header'
// import SimilarProductItem from '../SimilarProductItem'
// import './index.css'

// class ProductItemDetails extends Component {
//   state = {productDetails: {}, count: 0}

//   componentDidMount() {
//     this.getItemDetails()
//   }

//   getItemDetails = async () => {
//     const {match} = this.props
//     const {params} = match
//     const {id} = params

//     const jwtToken = Cookies.get('jwt_token')

//     const url = `https://apis.ccbp.in/products/${id}`
//     const options = {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${jwtToken}`,
//       },
//     }
//     const response = await fetch(url, options)
//     if (response.ok === true) {
//       const data = await response.json()
//       console.log(data)
//       const updatedData = {
//         availability: data.availability,
//         brand: data.brand,
//         description: data.description,
//         id: data.id,
//         imageUrl: data.image_url,
//         price: data.price,
//         rating: data.rating,
//         style: data.style,
//         title: data.title,
//         totalReviews: data.total_reviews,
//         similarProducts: data.similar_products.map(eachDetail => ({
//           availability: eachDetail.availability,
//           brand: eachDetail.brand,
//           description: eachDetail.description,
//           id: eachDetail.id,
//           imageUrl: eachDetail.image_url,
//           price: eachDetail.price,
//           rating: eachDetail.rating,
//           style: eachDetail.style,
//           title: eachDetail.title,
//           totalReviews: eachDetail.total_reviews,
//         })),
//       }
//       console.log(updatedData.similarProducts)
//       this.setState({productDetails: updatedData})
//     }
//   }

//   onDecrement = () => {
//     const {count} = this.state
//     if (count > 0) {
//       this.setState(prevState => ({count: prevState.count - 1}))
//     }
//   }

//   onIncrement = () => {
//     this.setState(prevState => ({count: prevState.count + 1}))
//   }

//   render() {
//     const {productDetails, count} = this.state
//     const {
//       id,
//       availability,
//       brand,
//       description,
//       imageUrl,
//       price,
//       rating,
//       style,
//       title,
//       totalReviews,
//       similarProducts,
//     } = productDetails
//     return (
//       <>
//         <Header />
//         <div className="product-detail-container">
//           <div className="main-container">
//             <img src={imageUrl} alt="product" className="product-image" />
//             <div>
//               <h1 className="product-heading">{title}</h1>
//               <h1 className="product-prize">Rs {price} /-</h1>
//               <div className="review-container">
//                 <div className="rating-container">
//                   <p className="para">{rating}</p>
//                   <img
//                     src="https://assets.ccbp.in/frontend/react-js/star-img.png"
//                     alt="star"
//                     className="star"
//                   />
//                 </div>

//                 <p>{totalReviews} Reviews</p>
//               </div>
//               <p className="description">{description}</p>
//               <h1 className="heading">
//                 Available: <span className="span">{availability}</span>
//               </h1>
//               <h1 className="heading">
//                 Brand: <span className="span">{brand}</span>
//               </h1>
//               <hr />
//               <div className="increment-container">
//                 <button
//                   type="button"
//                   className="increment"
//                   onClick={this.onDecrement}
//                 >
//                   <BsDashSquare />
//                 </button>
//                 <p className="increment-count">{count}</p>
//                 <button
//                   type="button"
//                   className="increment"
//                   onClick={this.onIncrement}
//                 >
//                   <BsPlusSquare />
//                 </button>
//               </div>
//               <button type="button" className="button">
//                 Add To Cart
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="similar-products">
//           <h1>Similar Products</h1>
//           <SimilarProductItem />
//         </div>
//       </>
//     )
//   }
// }

// export default ProductItemDetails

import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onDecrementQuantity}
                testid="minus"
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onIncrementQuantity}
                testid="plus"
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button type="button" className="button add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
