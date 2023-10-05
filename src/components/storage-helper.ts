class StorageHelper<D> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public saveToLocal(data: D) {
    const rawData = {
      version: 1.0,
      timestamp: Date.now(),
      data,
    };

    console.debug("Saving local data", rawData);
    // Save data to local storage
    localStorage.setItem(this.key, JSON.stringify(rawData));
  }

  public loadFromLocal(): D | null {
    // Load data from local storage
    const rawData = localStorage.getItem(this.key);
    if (rawData) {
      console.log("Storage data found", rawData);
      const objData = JSON.parse(rawData);
      if (objData.version >= 2.0) {
        confirm(
          "Cannot load data from previous version. Local data will be ignored",
        );
        return null;
      }
      try {
        return objData.data;
      } catch (e) {
        console.warn("Failed to deserialize data", e);
        confirm(
          "Failed to load data from local storage. Local data will be ignored",
        );
        return null;
      }
    } else {
      console.log("No storage data found");
      return null;
    }
  }
}

export { StorageHelper };
