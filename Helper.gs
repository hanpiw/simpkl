function generateId(prefix) {

    return prefix +
      "-" +
      Utilities
        .getUuid()
        .substring(0, 8)
        .toUpperCase();
  
  }