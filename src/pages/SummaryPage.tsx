import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
}

export const SummaryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = () => {
    axios.get("https://dummyjson.com/products").then((response) => {
      setProducts(response.data.products);
    });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="min-h-screen bg-white rounded-lg shadow-lg py-5 m-16">
          <div className="flex text-center my-6 justify-center space-x-96">
            <h1 className="text-3xl font-bold">Summary Products</h1>
          </div>
          <div className="flex justify-center">
            <table className="table-auto justify-center text-center w-3/5 border-2 border-spacing-2 border-slate-500">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>stock</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((val) => (
                    <tr key={val.id} className="border border-slate-600">
                      <td className="flex justify-center ">
                        <img src={val.thumbnail} alt={val.title} width="50" />
                      </td>
                      <td className="text-center border border-slate-600">
                        {val.title}
                      </td>
                      <td className="text-center border border-slate-600">
                        {val.price}
                      </td>
                      <td className="text-center border border-slate-600">
                        {val.stock}
                      </td>
                      <td className="text-center ">
                        <Link to={`/detail/${val?.id}`}>
                          <button className="bg-sky-300 hover:bg-sky-500 rounded px-2 py-1 shadow-lg">
                            Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
