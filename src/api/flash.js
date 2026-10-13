import request from '../utils/request'
import { createFlashClient } from '../utils/flash-client.js'

const client = createFlashClient(request)
export const createFlashOrderAPI = client.submit
export const getFlashOrderResultAPI = client.query
