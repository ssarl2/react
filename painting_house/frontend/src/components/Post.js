import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { UserContext } from './UserContext'
import dbConnection from '../services/dbConnection'
import ImageHandler from './ImageHandler'
import PostDescriptionAndTags from './PostDescriptionAndTags'
import PostProfile from './PostProfile'

const POST_DB = 'posts'
const USER_DB = 'users'

const Comment = ({ post }) => {
    const id = post.id
    const [inputValue, setInputValue] = useState('')
    const [comments, setComments] = useState(post.comments)
    const [updateComments, setUpdateComments] = useState(false)

    const handleClick = (comment) => {
        setComments([...comments, comment])
        setUpdateComments(true)
    }

    useEffect(() => {
        if (updateComments) {
            const updatedPost = { ...post, comments: comments }
            dbConnection
                .updateData(id, updatedPost, POST_DB)
                .then(() => { return dbConnection.getDataById(id, POST_DB) })
                .then(currentPost => {
                    setComments(currentPost.comments)
                    setInputValue('')
                    setUpdateComments(false)
                })
        }
    }, [updateComments])

    return (
        <div>
            {
                comments.map(comment => <div key={comment}>
                    {comment}
                </div>)
            }
            <div style={{ display: 'flex' }}>
                <input style={{ flex: 1, marginRight: '1vw' }} value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
                <button onClick={() => { handleClick(inputValue) }}>Comment</button>
            </div>
        </div>
    )
}

const Post = ({ parentPost, setPosts }) => {

    const [post, setPost] = useState(parentPost)

    const navigate = useNavigate()
    const { state } = useLocation()
    const { editedPost } = state || {}
    const { user, setUser } = useContext(UserContext)

    useEffect(() => {

        // In order to update the edited post directly after it
        // Otherwise, it does not update for the long context sometimes
        if (editedPost !== undefined) {
            if (editedPost.title === post.title)
                setPost(editedPost)
        }
    }, [])

    const handleEditClick = (id, title, category, description, tags) => {
        navigate(`/edit/${id}`, {
            state: {
                postTitle: title,
                postCategory: category,
                postDescription: description,
                postTags: tags
            },
        })
    }

    const handleDeleteClick = (id, title) => {
        if (window.confirm(`Delete ${title}?`))
            dbConnection
                .deleteData(id, title, POST_DB)
                .then(() => { return dbConnection.getData(POST_DB) })
                .then(currentPosts => setPosts(currentPosts))
    }

    const handleLikeClick = async (id) => {
        const loggedIn = Object.keys(user).length > 0
        if (!loggedIn) {
            return
        }

        const foundPostHistory = await user.postHistory.find(post => post['postId'] === id)

        let updatedPost
        if (foundPostHistory) {
            const updatedPostHistory = { ...foundPostHistory, liked: !foundPostHistory.liked }
            const updatedUser = { ...user, postHistory: updatedPostHistory }
            await dbConnection
                .updateData(user.id, updatedUser, USER_DB)
                .then(returnedUser => setUser(returnedUser))

            let updatedLike
            if (updatedPostHistory.liked) {
                // not liked -> liked
                updatedLike = '' + (parseInt(post.like) + 1)
            } else {
                // liked -> not liked
                updatedLike = '' + (parseInt(post.like) - 1)
            }
            updatedPost = { ...post, like: updatedLike }
        } else {
            const newPostHistory = {
                postId: id,
                liked: true,
                comments: []
            }

            const updatedUser = { ...user, postHistory: [...user.postHistory, newPostHistory] }
            await dbConnection
                .updateData(user.id, updatedUser, USER_DB)
                .then(returnedUser => setUser(returnedUser))

            const updatedLike = '' + (parseInt(post.like) + 1)
            updatedPost = { ...post, like: updatedLike }
        }

        dbConnection
            .updateData(id, updatedPost, POST_DB)
            .then(returnedPost => { setPost(returnedPost) })
    }

    return (
        <div>
            <table border='1' style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td colSpan='2'>{post.category}</td>
                    </tr>
                    <tr>
                        <td colSpan='2'>{post.title}</td>
                    </tr>
                    <tr>
                        <td style={{ width: '40%' }}>
                            <ImageHandler parentImages={post.images} />
                        </td>
                        <td style={{ width: '60%' }}>
                            <table border='1' style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <PostDescriptionAndTags postDescription={post.description} postTags={post.tags} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table border='1' style={{ width: '100%', height: '10vw' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: '85%' }}>
                                                            <PostProfile author={post.author} />
                                                        </td>
                                                        <td onClick={() => handleLikeClick(post.id)} style={{ width: '15%', cursor: 'default' }}>
                                                            <img className='likeImage' src={require('../images/like.png')} />
                                                            {post.like}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    {user?.profile?.nickname === post.author &&
                        <tr>
                            <td colSpan='2'>
                                <button onClick={() => { handleDeleteClick(post.id, post.title) }} style={{ float: 'right' }}>Delete</button>
                                <button onClick={() => { handleEditClick(post.id, post.title, post.category, post.description, post.tags) }} style={{ float: 'right', marginRight: '1vw' }}>Edit</button>
                            </td>
                        </tr>}
                    <tr>
                        <td colSpan='2'>
                            <Comment post={post} />
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Post