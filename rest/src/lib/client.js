import axios from 'axios'

const {
  APP_PORT
} = process.env

axios.defaults.baseURL = `http://localhost:${APP_PORT}/api/`

export default axios
