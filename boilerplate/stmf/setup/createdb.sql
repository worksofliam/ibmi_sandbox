CREATE OR REPLACE TABLE Books(bookId INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(START WITH 1, INCREMENT BY 1),
                       title VARCHAR(30) NOT NULL,
                       isbn VARCHAR(20) NOT NULL,
                       amount DECIMAL(10 , 2) NOT NULL, PRIMARY KEY (bookId))

