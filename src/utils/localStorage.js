//To Store Data to LocalStorage
export const storeData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(
      "Error saving to localStorage, probably exceeded storage limit.",
      error
    );
  }
};

//To get stored data from Local Storage
export const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};
