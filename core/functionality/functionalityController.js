'use strict';


module.exports = {
    create,
    update,
    select,
    selectById,
    remove
}

async function create(req, res) {
    try {
        res.status(201);
        res.send('Added');
    } catch (error) {
        res.status(500);
        res.send(error);
    }
}

async function update(req, res) {
    try {
        
    } catch (error) {
        
    }
}

async function select(req, res) {
    try {
        
    } catch (error) {
        
    }
}

async function selectById(req, res) {
    try {
        
    } catch (error) {
        
    }
}

async function remove(req, res) {
    try {
        
    } catch (error) {
        
    }
}