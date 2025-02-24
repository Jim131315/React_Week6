import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    useEffect(() => {
        setInterval(() => {
            navigate('/')
        }, 4000);
    },[])

    return (
        <>
            <h1>頁面不存在，調轉回首頁中</h1>
            <br />
            <Link to="/" className="fs-4">回到首頁</Link>
        </>
    )
}