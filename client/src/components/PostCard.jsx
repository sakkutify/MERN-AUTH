// {
//   "id": "60d21aeb67d0d8992e610b79",
//   "image": "https://img.dummyapi.io/photo-1579562243430-4732bcb09d91.jpg",
//   "likes": 17,
//   "tags": [
//       "dog",
//       "pet",
//       "animal"
//   ],
//   "text": "Milo durmiendo después de un largo día de jugar en...",
//   "publishDate": "2020-05-22T07:50:38.093Z",
//   "owner": {
//       "id": "60d0fe4f5311236168a109ce",
//       "title": "mr",
//       "firstName": "Rudi",
//       "lastName": "Droste",
//       "picture": "https://randomuser.me/api/portraits/med/men/83.jpg"
//   }
// }

import { SlTrash, SlNote } from "react-icons/sl"
import { IoMdHeart } from "react-icons/io"
import { MdEditCalendar } from "react-icons/md"

const PostCard = ({ post, lastPostRef = null }) => {
  function formatDate(originalDate) {
    const date = new Date(originalDate)
    const options = { day: "numeric", month: "short", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }
  const formattedDate = formatDate(post.publishDate)
  return (
    <li
      ref={lastPostRef}
      className="relative bg-white flex flex-col justify-between items-center border border-gray-300 shadow hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150"
    >
      <img
        src={post.image}
        alt=""
        loading="lazy"
        className="w-full h-[200px] object-cover hover:scale-105 transition-scale duration-200 ease-in"
      />
      <div className="w-full p-[10px] flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <MdEditCalendar className="h-4 w-4 text-accentRed" />
          <p className="font-semibold text-sm text-paragraph truncate">
            {formattedDate}
          </p>
        </div>
        <h3 className="font-semibold text-heading m-0 text-md text-left sm:text-md truncate capitalize">
          {post.text.trim()}
        </h3>

        <div className="flex items-center mt-[10px] space-x-3">
          <div className="flex items-center space-x-1">
            <img
              src={post.owner.picture}
              alt=""
              className="w-8 rounded-full"
            />
            <p className="font-semibold text-sm text-paragraph">
              {post.owner.firstName + " " + post.owner.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[10px] space-x-3">
          {post.tags.map((tag, index) => {
            return (
              <div
                key={index}
                className="text-xs border rounded px-1"
              >
                {tag}
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-2 right-2 flex gap-1 items-center">
        <IoMdHeart className="text-accentRed text-lg cursor-pointer" />
        {post.likes}
      </div>
    </li>
  )
}

export default PostCard
