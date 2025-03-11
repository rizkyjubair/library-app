const dbName = "LibraryDB";
const dbVersion = 1;
let db;

// Membuka Database IndexedDB
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = function(event) {
            db = event.target.result;

            if (!db.objectStoreNames.contains("User")) {
                let userStore = db.createObjectStore("User", { keyPath: "userid", autoIncrement: true });
                userStore.createIndex("username", "username", { unique: true });
                userStore.createIndex("password", "password", { unique: false });
            }
            
            if (!db.objectStoreNames.contains("Book")) {
                let bookStore = db.createObjectStore("Book", { keyPath: "bookid", autoIncrement: true });
                bookStore.createIndex("bookname", "bookname", { unique: true });
                bookStore.createIndex("stock", "stock", { unique: false });
            }
            
            if (!db.objectStoreNames.contains("History")) {
                let historyStore = db.createObjectStore("History", { keyPath: "historyid", autoIncrement: true });
                historyStore.createIndex("userid", "userid", { unique: false });
                historyStore.createIndex("bookid", "bookid", { unique: false });
                historyStore.createIndex("loandate", "loandate", { unique: false });
                historyStore.createIndex("returndate", "returndate", { unique: false, multiEntry: true });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function(event) {
            reject(event.target.errorCode);
        };
    });
}

export async function addData(storeName, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.add(data);
        
        request.onsuccess = () => resolve("Data added to " + storeName);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function getData(storeName, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        let request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function getAllData(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        let request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function updateData(storeName, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.put(data);
        
        request.onsuccess = () => resolve("Data updated in " + storeName);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function deleteData(storeName, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.delete(key);
        
        request.onsuccess = () => resolve("Data deleted from " + storeName);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function addLoan(userid, bookid) {
    let book = await getData("Book", bookid);
    if (!book || book.stock <= 0) {
        throw new Error("Stock buku habis, tidak bisa meminjam.");
    }
    book.stock -= 1;
    await updateData("Book", book);
    return await addData("History", { userid, bookid, loandate: new Date(), returndate: null });
}

export async function returnBook(historyid) {
    const history = await getData("History", historyid);
    if (!history) throw new Error("Riwayat peminjaman tidak ditemukan.");
    history.returndate = new Date();
    await updateData("History", history);
    
    let book = await getData("Book", history.bookid);
    if (book) {
        book.stock += 1;
        await updateData("Book", book);
    }
}

export async function findUserByUsername(username) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        let transaction = db.transaction("User", "readonly");
        let store = transaction.objectStore("User");
        let index = store.index("username");
        let request = index.get(username);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// // Contoh Penggunaan CRUD
// request.onsuccess = function() {
//     db = request.result;
    
//     // Menambahkan Data User
//     addData("User", { username: "john_doe", password: "password123" });
    
//     // Menambahkan Data Book
//     addData("Book", { bookname: "JavaScript Guide", stock: 5 });
    
//     // Menampilkan Semua Data User
//     getAllData("User", (data) => console.log("Users:", data));
// };
