# Aplikacja gallery

## Opis Funkcjonalności(API)
![pasek_nawigacyjny](https://github.com/m4dox21/Web-development/assets/132065931/36fe7492-89e6-43bc-9264-cae47ee6e67e)  
./ - strona główna

./stats - zawiera informacje o ilości przechowywanych użytkowników, galerii oraz obrazów.  
./users - wyświetla listę zawierającą imię, nazwisko i nazwe użytkownika zarejestrowanych użytkowników.  
./galleries - wyświetla listę utworzonych przez użytkowników galerii w postaci nazwy galerii, opisu galerii, daty utworzenia oraz użytkownika który utworzył daną galerię.  
./images - wyświetla listę obrazów które zostały dodane do aplikacji, informacje wyświetlane są w postaci: nazwy obrazu, opisu obrazu, pliku oraz galerii do której jest przypisany.  

./galleries/gallery_browse - umożliwia przeglądanie zawartości istniejących galerii, przeglądanie nie wymaga zalogowania przez użytkownika.

./users/user_add - umożliwia zarejestrowanie konta użytkownika. 
./galleries/gallery_add - umożliwia utworzenie nowej pustej galerii.
./images/image_add - umożliwia dodanie obrazu do istniejącej galerii.

./users/user_login - pozwala użytkownikowi na zalogowanie się.
./user_logout - wylogowuje użytkownika.

Użytkownicy mogą rejestrować nowe konta poprzez ściężkę /users/user_add, następnie przy pomocy danych podanych w rejestracji można dokonać logowania wybierając z paska "Login" lub pod adresem /users/user_login.


## Połączenie z bazą danych
Aplikacja wykorzystuje połączenie z bazą GalleryDB, która składa się z 3 tabel:  
**galleries** - zawierającej informacje o utworzonych przez użytkowników galeriach. tj. nazwa galerii, opis galerii, data utworzenia oraz id właściciela galerii,  
**images** - zawierającej takie informacje jak nazwa obrazka, opis obrazka, informacja o wysłanym obrazku, id galerii do której zostanie przypisany.  
**users** - zawierającej informacje o imieniu, nazwisku, nazwie użytkownika oraz haśle.
