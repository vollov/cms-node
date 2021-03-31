import express from 'express'
import {
    list, add, find, update, remove, insertMany
} from './service'

const router = express.Router()

/**
 * Note: Errors were handled and logged in service layer
 */

router.get('/:id',  async (req, res) => {
    const uid = req.params.id
    try {
        const data = await find(id)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

/**
 * find one by key
 */
router.get('/user/:uid', async (req, res) => {
    const uid = req.params.uid
    try {
        const data = await list(uid)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const data = await add(req.body)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.post('/add/bulk', async (req, res) => {
    try {
        const data = await insertMany(req.body)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const data = await update(id, req.body)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const data = await remove(id)
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)
    }
})

export default router