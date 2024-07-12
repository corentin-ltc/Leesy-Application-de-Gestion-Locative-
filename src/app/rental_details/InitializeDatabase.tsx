const initializeDatabase = async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Rental (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_name TEXT NOT NULL,
        rental_city TEXT NOT NULL,
        rental_postal_code TEXT NOT NULL,
        rental_street TEXT NOT NULL,
        number_of_tenants INTEGER NOT NULL,
        country TEXT NOT NULL,
        surface_area REAL NOT NULL,
        rental_type TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(USER_ID)
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User(
        USER_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USERNAME TEXT,
        isPremium INTEGER
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User_Rentals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        location_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(USER_ID),
        FOREIGN KEY (location_id) REFERENCES Rental(id)
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id INTEGER NOT NULL,
        category_id INTEGER,
        amount REAL NOT NULL,
        date INTEGER NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('Expense', 'Income')),
        FOREIGN KEY (rental_id) REFERENCES Rental(id)
      );
    `);
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Tenant (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        rent_amount REAL NOT NULL,
        move_in_date TEXT NOT NULL,
        rent_payment_date TEXT NOT NULL,
        rental_id INTEGER NOT NULL,
        FOREIGN KEY (rental_id) REFERENCES Rental(id)
      );
    `);
  };
  
  export default initializeDatabase;
  