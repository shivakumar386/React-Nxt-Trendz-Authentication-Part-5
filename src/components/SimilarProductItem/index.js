// import './index.css'

// const SimilarProductItem = props => {
//   const {images} = props
//   return (
//     <div>
//       <img
//         src="https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-silver-hair-dryer.png"
//         alt="similar product"
//       />
//       <h1>Wide Bowknot Hat</h1>
//       <p>by MALIK</p>
//       <div>
//         <h1>Rs 288/-</h1>
//         <div>
//           <p>3.6</p>
//           <img
//             src="https://assets.ccbp.in/frontend/react-js/star-img.png"
//             alt="star"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SimilarProductItem

import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        className="similar-product-image"
        alt={`similar product ${title}`}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-products-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
