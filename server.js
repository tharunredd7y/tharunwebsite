const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data.json exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

app.use(express.json());

// Serve the form directly
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Person Details Form</title>
        <style>
            body { font-family: Arial; background: #f4f4f4; text-align: center; margin-top: 50px; }
            .container { background: white; padding: 20px; width: 300px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            input { width: 90%; padding: 8px; margin: 10px 0; }
            button { padding: 10px 20px; cursor: pointer; }
            #result { margin-top: 20px; color: green; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Person Details Form</h1>

            <form id="personForm">
                <input type="text" id="name" name="name" placeholder="Full Name" required /><br/>
                <input type="email" id="email" name="email" placeholder="Email Address" required /><br/>
                <input type="number" id="age" name="age" placeholder="Age" min="1" required /><br/>
                <button type="submit">Submit</button>
            </form>

            <div id="result"></div>
        </div>

        <script>
            document.getElementById('personForm').addEventListener('submit', async function (e) {
                e.preventDefault();
                const data = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    age: document.getElementById('age').value
                };

                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                document.getElementById('result').innerText = result.message;
                document.getElementById('personForm').reset();
            });
        </script>
    </body>
    </html>
    `);
});

// Handle form submission
app.post('/submit', (req, res) => {
    const person = req.body;

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.push(person);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');

    res.json({ message: 'Details saved successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});
