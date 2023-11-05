const express = require('express');
const cors = require("cors");
const db = require('./config/config.js');
const app = express();

app.use(cors({origin : 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/fixed/list', async (req, res) => {
    try {
        const [rows, fields] = await db.query("SELECT * FROM flow_schema.fixed_extension");
        res.send(rows);
    } catch (err) {
        console.log('query is not executed: ' + err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/custom/list', async (req, res) => {
    try {
        const [rows, fields] = await db.query("SELECT * FROM flow_schema.custom_extension");
        res.send(rows);
    } catch (err) {
        console.log('query is not executed: ' + err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('api/update/fixed', async (req, res) => {
    const {id, status} = req.body
    const sql = `UPDATE flow_schema.fixed_extension SET status = ? WHERE id = ?`;
    try {
        const [rows, fields] = await db.query(sql, [status === 0 ? 1 : 0, id])
        res.status(200).send('Status updated successfully');
    } catch (error) {
        console.log('query is not executed : ' + error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/api/update/custom', async (req, res) => {
    const {name} = req.body
    console.log(name)
    const sql = 'INSERT INTO flow_schema.custom_extension (name) VALUES (?)';
    try {
        const [rows, fields] = await db.query(sql, [name])
        res.status(200).send({id:rows.insertId});
    } catch (error) {
        console.log('query is not executed : ' + error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/api/delete/custom', async (req,res) => {
    const {id} = req.body
    const sql = 'DELETE FROM flow_schema.custom_extension WHERE id = ?'
    try {
        const [rows, fields] = await db.query(sql, id);
        res.status(200).send('Successfully Deleted');
    } catch (error) {
        console.log('query is not executed : ' + error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(5001, () => {
    console.log("Server started on port 5001");
});
