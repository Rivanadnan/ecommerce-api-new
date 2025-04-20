export const logError = (error) => {
    return error instanceof Error
        ? error.message
        : "Unknown error";
};
