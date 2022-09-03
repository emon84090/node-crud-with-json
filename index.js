const express = require('express');
const cors = require('cors');
const fs = require('fs');

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(cors())


const getUserData = () => {
    const user = fs.readFileSync('data.json');
    const data = JSON.parse(user);
    return data;
}

app.get("/", (req, res) => {
    res.send("node js crud with json server is running");

})
app.get("/user/random", (req, res) => {
    const Random = Math.floor(Math.random() * 3);
    try {
        const data = getUserData();
        for (let x = 0; x < data.length; x++) {
            res.send(data[Random]);
            res.end()
        }
    } catch (err) {
        res.send(err.message);
        res.end()
    }

})
app.get("/user/all", (req, res) => {
    const limit = req.query.limit;
    const data = getUserData();

    if (limit) {
        try {
            res.send(data.slice(0, limit));
            res.end()
        } catch (err) {
            res.send(err.message);
            res.end()
        }
    } else {
        try {
            res.send(data);
            res.end()
        } catch (err) {
            res.send(err.message);
            res.end()
        }
    }

})


app.post("/user/save", (req, res) => {
    const { id, gender, name, contact, address, photoUrl } = req.body;
    if (id && gender && name && contact && address && photoUrl) {
        try {
            const data = getUserData();
            data.push(req.body)
            let newData2 = JSON.stringify(data);
            fs.writeFile("data.json", newData2, (err) => {
                if (err) throw err;
                res.send("data added successfully");
                res.end();
            });

        } catch (err) {
            res.send(err.message);
            res.end()
        }
    } else {
        res.send("all field must required");
        res.end()
    }

})



app.patch("/user/update/:id", (req, res) => {
    const id = req.params.id;
    if (!Number(parseInt(id))) {
        return res.send("user id is not valid");
    }

    const { name, gender, contact, address, photoUrl } = req.body;


    const data = getUserData();

    const filterIndex = data.findIndex((val) => val.id === id);

    data[filterIndex].name = name
    data[filterIndex].gender = gender
    data[filterIndex].contact = contact
    data[filterIndex].address = address
    data[filterIndex].photoUrl = photoUrl

    fs.writeFile("data.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        res.send("data updated successfully");
        res.end();
    });


})


app.patch("/user/bulk-update", (req, res) => {
    const { id } = req.body;
    id.map((val) => {
        if (!Number(parseInt(val))) {
            return res.send("user id is not valid");
        }

    })
    const { name } = req.body;
    const data = getUserData();
    id.map((ids) => {
        const filterIndex = data.findIndex((val) => val.id === ids);
        if (filterIndex === -1) {
            return res.send("this id user not found");
        }
        data[filterIndex].name = name;
    })


    fs.writeFile("data.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        res.send("data updated successfully");
        res.end();
    });



})




app.delete("/user/delete/:id", (req, res) => {
    const id = req.params.id;
    if (typeof (parseInt(id)) !== "number") {
        return res.send("user id is not valid");
    }
    try {
        const data = getUserData();
        const filterIndex = data.findIndex((val) => val.id === id);

        if (filterIndex === -1) {
            return res.send("this id user not found");
        }

        data.splice(filterIndex, 1);
        fs.writeFile("data.json", JSON.stringify(data), (err) => {
            if (err) throw err;
            res.send("data deleted successfully");
            res.end();
        });


    } catch (err) {
        res.send(err.message);
        res.end()
    }


})


app.listen(PORT, () => {
    console.log(`your project is running on ${PORT}`);
})