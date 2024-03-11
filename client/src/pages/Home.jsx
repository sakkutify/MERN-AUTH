import { useCallback, useEffect, useRef, useState } from "react"
import useInfiniteScroll from "../hooks/useInfiniteScroll"
import PostCard from "../components/PostCard"
import LoaderIcon from "../assets/LoaderIcon.svg"

const Home = () => {
  const [page, setPage] = useState(1)
  const { loading, error, posts, hasMore } = useInfiniteScroll(
    "/api/v1/posts",
    page
  )

  const observer = useRef()
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return

      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) {
        observer.current.observe(node)
      }
    },
    [loading, hasMore]
  )

  return (
    <main>
      <section className="flex flex-col gap-4 max-w-4xl mx-auto justify-center text-center px-2 my-20">
        <span className=" mx-auto bg-accentLightPinkDark px-2 py-1  block border border-accentRed text-black">
          Read the latest Tech Blog 🚀
        </span>
        <h1 className="text-3xl md:text-6xl">
          Well researched content by experts in tech at{" "}
          <span className="text-accentRed font-semibold home-heading">
            {import.meta.env.VITE_SITE_TITLE}
          </span>
        </h1>
      </section>
      <section className="flex flex-col gap-4 max-w-6xl mx-auto justify-center text-center px-2 my-20">
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5 gap-3">
          {posts.map((post, index) => {
            if (posts.length === index + 1)
              return (
                <PostCard
                  key={index}
                  lastPostRef={lastPostRef}
                  post={post}
                  className="h-64"
                />
              )
            else
              return (
                <PostCard
                  key={index}
                  post={post}
                  className="h-64"
                />
              )
          })}
        </ul>
        {loading && (
          <div className="flex justify-center">
            <img
              src={LoaderIcon}
              alt="Loading..."
              className="w-20"
            />
          </div>
        )}
        {error && <p className="text-red-500">Could not load posts...</p>}
        {!hasMore && <p>No more posts</p>}
      </section>
    </main>
  )
}

export default Home
