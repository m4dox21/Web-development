# gallery
Aplikacja gallery

## Funkcjonalność
![pasek_nawigacyjny](https://github.com/m4dox21/Web-development/assets/132065931/36fe7492-89e6-43bc-9264-cae47ee6e67e)  
./ - strona główna

./stats - zawiera informacje o ilości przechowywanych użytkowników, galerii oraz obrazów. 
./users - wyświetla listę zarejestrowanych użytkowników
./galleries - wyświetla listę utworzonych przez użytkowników galerii. 
./images - wyświetla listę obrazów które zostały dodane do aplikacji. 

./galleries/gallery_browse

./users/user_add
./galleries/gallery_add
./images/image_add

./users/user_login
./user_logout

Użytkownicy mogą rejestrować nowe konta poprzez ściężkę /users/user_add, następnie przy pomocy danych podanych w rejestracji można dokonać logowania pod wybierając z paska "Login" lub pod adresem /users/user_login.

## Połączenie z bazą danych
Aplikacja wykorzystuje połączenie z bazą GalleryDB, która składa się z:  
**galleries** - przechowującego informacje o utworzonych przez użytkowników galeriach,  
**images** - zawierającego takie informacje jak name, description, path, gallery.  
**users** - first_name, last_name, username, password