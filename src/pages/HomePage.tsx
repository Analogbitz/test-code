import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Menu, MenuItem, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axiosInstance from "../utils/axiosInterceptor"; 

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
  discountPercentage?: number;
  totalPrice?: number;
}

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = () => {
    axiosInstance.get("https://dummyjson.com/products").then((response) => {
      setProducts(response.data.products);
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // handle debouncing
  function useDebounce(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterType === "priceAbove1000") {
      filtered = products.filter(
        (product) =>
          product.price > 1000 &&
          product.discountPercentage &&
          product.discountPercentage > 0
      );
    } else if (filterType === "totalPrice") {
      filtered = products.map((product) => ({
        ...product,
        totalPrice:
          product.price * (1 - (product.discountPercentage || 0) / 100),
      }));
    } else if (filterType === "sortRating") {
      filtered = [...products].sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return a.price - b.price;
      });
    }

    return filtered.filter((product) =>
      product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, products, filterType]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
    handleMenuClose();
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="min-h-screen bg-white rounded-lg shadow-lg py-5 m-16">
          <div className="flex text-center my-6 justify-center">
            <h1 className="text-3xl font-bold underline ">Products</h1>
          </div>
          <div className="flex justify-center mb-4 space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products"
              className="p-2 border rounded-lg"
            />
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              variant="text"
              onClick={handleMenuOpen}
              sx={{
                bgcolor: "white",
                color: "black",
              }}
            >
              <FilterListIcon />
              Filter
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleFilterChange("all")}>
                ทั้งหมด
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("priceAbove1000")}>
                กรองราคามากกว่า 1000
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("totalPrice")}>
                แสดงราคารวมต่อชิ้น
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("sortRating")}>
                เรียงตามเรตติ้ง
              </MenuItem>
            </Menu>
          </div>
          <div className="flex justify-center">
            <table className="table-auto justify-center text-center w-3/5 border-2 border-spacing-2 border-slate-500">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  {filterType === "totalPrice" && <th>Total Price</th>}
                  {filterType === "sortRating" && <th>Rating</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((val) => (
                  <tr key={val.id} className="border border-slate-600">
                    <td className="flex justify-center ">
                      <img src={val.thumbnail} alt={val.title} width="50" />
                    </td>
                    <td className="text-center border border-slate-600 ">
                      {val.title}
                    </td>
                    <td className="text-center border border-slate-600 ">
                      {val.price}
                    </td>
                    <td className="text-center border border-slate-600 ">
                      {val.stock}
                    </td>
                    {filterType === "totalPrice" && (
                      <td className="text-center border border-slate-600 ">
                        {val.totalPrice?.toFixed(2)}
                      </td>
                    )}
                    {filterType === "sortRating" && (
                      <td className="text-center border border-slate-600">
                        {val.rating}
                      </td>
                    )}
                    <td className="text-center ">
                      <Link to={`/detail/${val.id}`}>
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
