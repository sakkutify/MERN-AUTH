import { useEffect, useState } from "react"

export default function useInfiniteScroll(url, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  useEffect(() => {
    setLoading(true)
    setError(false)
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${url}?page=${pageNumber}&limit=8`, {
          method: "GET",
        })
        const responseJSON = await res.json()
        if (!res.ok) setError(true)
        else {
          setPosts((prev) => [...prev, ...responseJSON.data])
          setHasMore(responseJSON.data.length > 0)
        }
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [url, pageNumber])
  return { loading, error, posts, hasMore }
}
