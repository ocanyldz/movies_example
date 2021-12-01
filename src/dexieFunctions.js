import Dexie from "dexie";

const db = new Dexie('queryResults');

const createDb = () => {
    db.version(1).stores({ requests: "++id, url, response, insert_date", images: "++id, url, base64_url, insert_date" });
    db.open().catch(function (err) {
        console.error(err.stack || err);
    });
}

const getItemFromDb = async (url) => {
    const items = await db.requests
        .where('url').equals(url)
        .toArray();
    return items;
}

const getImageFromDb = async (url) => {
    const items = await db.images
        .where('url').equals(url)
        .toArray();
    return items;
}

const addItemToDb = async (url, response) => {
    await db.requests.add({
        url,
        response,
        insert_date: Date.now()
    }).catch(e => {
        if ((e.name === 'QuotaExceededError') ||
            (e.inner && e.inner.name === 'QuotaExceededError'))
        {
          console.error ("QuotaExceeded error!");
        } else {
          console.error (e);
        }
    });
}

const addImageToDb = async (url, base64_url) => {
    await db.images.add({
        url,
        base64_url,
        insert_date: Date.now()
    }).catch(e => {
        if ((e.name === 'QuotaExceededError') ||
            (e.inner && e.inner.name === 'QuotaExceededError'))
        {
          console.error ("QuotaExceeded error!");
        } else {
          console.error (e);
        }
    });
}

const deleteItemFromDb = async (id) => {
    await db.requests.where("id").equals(id).delete();
}

const deleteDb = () => {
    db.delete();
}

const dexieFunctions = {
    createDb,
    getItemFromDb,
    getImageFromDb,
    addItemToDb,
    addImageToDb,
    deleteItemFromDb,
    deleteDb
}

export default dexieFunctions;