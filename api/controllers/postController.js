
const getAllPostsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query
    const response= await fetch(`https://dummyapi.io/data/v1/post?page=${page}&limit=${limit}`, {
      headers:{
        "app-id":process.env.APP_ID,
      }
    })
    const responseJSON= await response.json()
    res.status(200).jsonResponse(200, true, "Posts fetched successfully", responseJSON.data)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export { getAllPostsController }
