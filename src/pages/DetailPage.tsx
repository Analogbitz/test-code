import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Rating, Box } from "@mui/material";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  rating: number;
  reviews: Review[];
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  discountPercentage: string;
}

export const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get<ProductDetail>("https://dummyjson.com/products/" + id)
        .then((res) => {
          console.log(res.data);
          setProduct(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  return (
    <div>
      <Navbar/>
    <div className="flex flex-col p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 items-center min-h-screen justify-center">
      <div className="flex bg-white rounded-lg shadow-lg py-5 px-8 m-16 justify-center items-center w-128 h-128">
        {product ? (
          <div className="flex flex-col p-4 w-full h-full">
            <div className="flex items-center">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-36 max-w-36 object-contain"
              />
              <div className="ml-4">
                <Typography variant="h5" className="w-64">
                  {product.title}
                </Typography>
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mr: 1 }}>Rating: {product.rating}</Box>
                  <Rating
                    name="read-only"
                    size="small"
                    value={product.rating}
                    readOnly
                  />
                </Box>
                <h4 className="text-slate-500">
                  Warranty: {product.warrantyInformation}
                </h4>
                <h4 className="text-slate-500">
                  Shipping: {product.shippingInformation}
                </h4>
                <div className="flex flex-row space-x-4 pt-4">
                  <h4 className="text-2xl font-sans font-semibold">
                    ${product.price}
                  </h4>
                  <h4 className="text-xs font-sans font-semibold px-1 text-white bg-red-600 rounded-md flex justify-center items-center">
                    -{product.discountPercentage}%
                  </h4>
                </div>

                <h4 className="text-slate-500">
                  Stock: {product.stock} {product.availabilityStatus}
                </h4>
              </div>
            </div>
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-4">
                <Typography variant="h6">Reviews</Typography>
                {product.reviews.map((review, index) => (
                  <div key={index} className="mt-2 py-4 px-4 shadow-md">
                    <h4>{review.reviewerName} </h4>
                    <Rating
                      name="read-only"
                      size="small"
                      value={review.rating}
                      readOnly
                    />
                    <h4>{dayjs(review.date).format("MMMM D, YYYY")}</h4>
                    <h4>Comment: {review.comment}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default DetailPage;
