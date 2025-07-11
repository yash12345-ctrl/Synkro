const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = require('./db');

const PDFDocument = require('pdfkit');

app.get('/download-slip', (req, res) => {
  const { name, platform, idea, budget } = req.query;

  const doc = new PDFDocument();
  res.setHeader('Content-disposition', `attachment; filename="${name}_submission_slip.pdf"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(22).text('📄 Submission Slip', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.text(`Preferred Platform: ${platform}`);
  doc.text(`Your Idea: ${idea}`);
  doc.text(`Budget: ₹${budget}`);
  doc.end();
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});


db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);


app.post('/submit-email', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const insertQuery = `INSERT OR IGNORE INTO subscriptions (email) VALUES (?)`;

  db.run(insertQuery, [email], function (err) {
    if (err) {
      console.error('Error inserting email:', err.message);
      return res.status(500).send('Something went wrong.');
    }


    res.redirect('/booking.html');
  });
});


app.post("/save-appointment", (req, res) => {
  const { selectedDate, selectedTime } = req.body;

  console.log("📥 Incoming appointment request:");
  console.log("🗓️  Date:", selectedDate);
  console.log("⏰ Time:", selectedTime);

  if (!selectedDate || !selectedTime) {
    console.log("❌ Missing date or time");
    return res.status(400).send("Missing date or time");
  }

  const query = "INSERT INTO appointments (date, time) VALUES (?, ?)";
  db.run(query, [selectedDate, selectedTime], function (err) {
    if (err) {
      console.error("❌ SQL Error:", err.message);
      return res.status(500).send("Error saving appointment");
    }

    console.log("✅ Appointment saved successfully!");
    res.redirect('/data.html');
  });
});


app.post('/connect', (req, res) => {
  const { name, platform, idea, budget } = req.body;

  if (!name || !platform || !idea || !budget) {
    return res.status(400).send('All fields are required.');
  }

  const insertQuery = `
    INSERT INTO connect_form (name, platform, idea, budget)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertQuery, [name, platform, idea, budget], function (err) {
    if (err) {
      console.error('❌ Failed to save connect form:', err.message);
      return res.status(500).send('Error saving your submission.');
    }

    console.log('✅ Connect form data saved successfully!');
    res.render('submitted', { name, platform, idea, budget });
  });
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  
