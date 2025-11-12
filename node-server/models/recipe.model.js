// node-server/middlewares/userAuth.js
//בודקה טוקנים 
import jwt from 'jsonwebtoken';

// Middleware לאימות משתמש רגיל
export const userAuth = (req, res, next) => {
    try {
        // חילוץ הטוקן מה-Headers
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        
        // מפתח סודי ל-JWT
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
        
        // אימות הטוקן וקבלת הנתונים שבו
        const data = jwt.verify(token, privateKey);
        req.user = data;

        // בדיקה של תפקיד המשתמש
        if (req.user.role !== 'user' && req.user.role !== 'registered user') {
            return next({ message: 'no permission to invoke this function', status: 403 });
        }

        // ממשיך ל-Middleware הבא או לרוטר
        next();
    } catch (error) {
        console.log('error', error);
        next({ message: error.message || error, status: 401 });
    }
};

// Middleware לאימות גישה אך לא מחייבת
export const getAuth = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
        const data = jwt.verify(token, privateKey);
        req.user = data;

        if (req.user.role !== 'user' && req.user.role !== 'registered user') {
            return next({ message: 'no permission to invoke this function', status: 403 });
        }

        next();
    } catch (error) {
        console.log('error', error);
        // במקרה הזה ממשיכים גם אם אין טוקן תקין
        next();
    }
};
// userAuth → מוודא שהמשתמש שלח טוקן תקין ושיש לו תפקיד מתאים. אם לא → חסימת גישה.

// getAuth → מוודא טוקן ותפקיד אם קיים, אך אם אין טוקן → ממשיך.

// הקובץ מאפשר לנו להגן על Routes בשרת ולבדוק הרשאות לפני ביצוע פעולות.
///מטררת הדף הזה :לאמת ולהגן על Routes.
//דף א' (userAuth.js) → המטרה שלו היא לאמת ולהגן על Routes.

// בודק אם המשתמש שולח טוקן JWT תקין.

// בודק את תפקיד המשתמש (user/registered user).

// אם הטוקן לא תקין או אין הרשאות → חוסם גישה.

// בקיצור: בדיקה לפני שמישהו נכנס למתקן (API/דף).

