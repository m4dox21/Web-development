const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

// Ustawienie szablonu Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware - logger z użyciem Morgana
app.use(morgan('dev'));

// Middleware - serwowanie plików statycznych
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
app.use('/multimedia', express.static(path.join(__dirname, 'public', 'multimedia')));

// Strona główna
app.get('/', (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'images');
    const picturesDir = path.join(__dirname, 'public', 'pictures');

    const images = fs.readdirSync(imagesDir);
    const pictures = fs.readdirSync(picturesDir);

    res.render('index', { title: 'Strona główna', images, pictures });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
