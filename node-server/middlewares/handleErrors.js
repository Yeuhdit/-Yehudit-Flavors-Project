// node-server/middlewares/handleErrors.js

export const pageNotFound = (req, res, next) => {
    const error = new Error('page is not found');
    error.status = 404;
    next(error);
    console.log('error', error);
};

export const serverErrors = (error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
};
// --- מטרת הקובץ ---
// קובץ זה הוא middleware לניהול שגיאות בשרת Node.js.
// הוא מטפל בשגיאות של דפים שלא נמצאו (404) ובשגיאות שרת כלליות (500).
// זה מאפשר לשלוט על הפלט של השגיאות ולשלוח תגובה אחידה ללקוח.