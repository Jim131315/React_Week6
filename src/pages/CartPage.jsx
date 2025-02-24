import {  useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;



export default function CartPage() {
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    // 取得購物車列表 API
    const [cartList, setCartList] = useState({})

    useEffect(() => {
        getCartList();
      }, []);

    const getCartList = async() => {
        try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);     
        setCartList(res.data.data);
        } catch (error) {
        alert('取得購物車列表失敗')
        }
    }

    // 刪除購物車項目（單一）
    const removeCartItem = async(id) => {
        setIsScreenLoading(true)
        try {
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
        getCartList()  

        } catch (error) {
        alert('刪除失敗')
        } finally {
        setIsScreenLoading(false)
        }
    }

    // 刪除購物車項目（全部）
    const removeCart = async() => {
        setIsScreenLoading(true)
        try {
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
        getCartList()  

        } catch (error) {
        alert('清空購物車失敗')
        } finally {
        setIsScreenLoading(false)
        }
    }

    // 調整購物車產品數量
    const updateCartItem = async(cartItem_id, product_id, qty) => {
        setIsScreenLoading(true)
        try {
        await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
            data: {
            product_id: product_id,
            qty: Number(qty)
            }
        });
        getCartList()  
    
        } catch (error) {
        alert('更新品項數量失敗')
        } finally {
        setIsScreenLoading(false)
        }
    }

    const {
    register,
    handleSubmit,
    formState: {errors},
    reset
    } = useForm()

    const onSubmit = handleSubmit((data) => {
    
    // 把資料改成api的data格式
    const {message, ...user} = data;
    const userInfo = {
        data: {
        user,
        message
        }
    }
        checkout(userInfo);
    })

        // 結帳付款
    const checkout = async (data) => {
        setIsScreenLoading(true)
        try {
        await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
        reset();
        } catch (error) {
        alert('結帳失敗');
        } finally {
        setIsScreenLoading(false)
        }
    }
   
    return (
        <>
            <div className="container">
                <div>
                    {cartList.carts?.length > 0 && (
                        <>
                        <div className="text-end py-3">
                            <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                            清空購物車
                            </button>
                        </div>
            
                        <table className="table align-middle">
                            <thead>
                            <tr>
                                <th></th>
                                <th>品名</th>
                                <th style={{ width: "150px" }}>數量/單位</th>
                                <th className="text-end">單價</th>
                            </tr>
                            </thead>
            
                            <tbody>
                            {cartList.carts?.map((cartItem) => {
                                return (
                                <tr key={cartItem.id}>
                                    <td>
                                    <button onClick={() => removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                                        x
                                    </button>
                                    </td>
                                    <td>{cartItem.product.title}</td>
                                    <td style={{ width: "150px" }}>
                                    <div className="d-flex align-items-center">
                                        <div className="btn-group me-2" role="group">
                                        <button
                                            type="button" onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                                            className="btn btn-outline-dark btn-sm" disabled={cartItem.qty === 1}
                                        >
                                            -
                                        </button>
                                        <span
                                            className="btn border border-dark"
                                            style={{ width: "50px", cursor: "auto" }}
                                        >{cartItem.qty}</span>
                                        <button
                                            type="button" onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                                            className="btn btn-outline-dark btn-sm"
                                        >
                                            +
                                        </button>
                                        </div>
                                        <span className="input-group-text bg-transparent border-0">
                                        {cartItem.product.unit}
                                        </span>
                                    </div>
                                    </td>
                                    <td className="text-end">{cartItem.total}</td>
                                </tr>         
                                )
                            })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end">
                                總計：
                                </td>
                                <td className="text-end" style={{ width: "130px" }}>{cartList['final_total']}</td>
                            </tr>
                            </tfoot>
                        </table>
                        </>)
                        }
                </div>
            
                <div className="my-5 row justify-content-center">
                <form className="col-md-6" onSubmit={onSubmit}>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        {...register('email', {
                        required: 'Email 欄位未填寫',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Email 格式不正確'
                        } 
                        })}
                        id="email"
                        type="email"
                        className={`form-control ${errors.email && 'is-invalid'}`}
                        placeholder="請輸入 Email"
                    />

                    {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                    
                    </div>
            
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        收件人姓名
                    </label>
                    <input
                        {...register('name', {
                        required: '收件人姓名 未填寫'
                        })}
                        id="name"
                        className={`form-control ${errors.name && 'is-invalid'}`}
                        placeholder="請輸入姓名"
                    />

                    {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                    </div>

                    <div className="mb-3">
                    <label htmlFor="tel" className="form-label">
                        收件人電話
                    </label>
                    <input
                        {...register('tel', {
                        required: '收件人電話 未填寫',
                        pattern: {
                            value: /^(0[2-8]\d{7}|09\d{8})$/,
                            message: '電話 格式不正確'
                        }
                        })}
                        id="tel"
                        type="tel"
                        className={`form-control ${errors.tel && 'is-invalid'}`}
                        placeholder="請輸入電話"
                    />

                    {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                    </div>

                    <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        收件人地址
                    </label>
                    <input
                        {...register('address', {
                        required: '地址 欄位未填寫',
                        pattern: {
                            value: /(?<city>\D+[縣市])(?<district>\D+?(市區|鎮區|鎮市|[鄉鎮市區]))(?<others>.+)/,
                            message: '地址 格式不正確'
                        }
                        })}
                        id="address"
                        type="text"
                        className={`form-control ${errors.address && 'is-invalid'}`}
                        placeholder="請輸入地址"
                    />

                    {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                    </div>

                    <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        留言
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        className="form-control"
                        cols="30"
                        rows="10"
                    ></textarea>
                    </div>
                    <div className="text-center">
                    <button type="submit" className="btn btn-danger">
                        送出訂單
                    </button>
                    </div>
                </form>
                </div>

                {isScreenLoading && <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    zIndex: 999,
                }}
                >
                <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                </div>}
            </div>
        </>
    )
}