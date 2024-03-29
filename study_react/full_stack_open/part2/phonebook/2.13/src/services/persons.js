import axios from 'axios'

const addr = '192.168.1.99'
const baseUrl = `http://${addr}:3001/persons`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

export default { getAll, create }
