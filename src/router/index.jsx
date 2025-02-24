import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import NotFound from "../pages/NotFound";

const router = createHashRouter([
    {
        path: '/',
        element: <FrontLayout />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'products',
                element: <ProductPage />,
            },
            {
                path: 'products/:id',
                element: <ProductDetailPage />
            },
            {
                path: 'cart',
                element: <CartPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;