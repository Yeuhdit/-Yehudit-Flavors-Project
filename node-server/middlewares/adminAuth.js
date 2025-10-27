//node-server/middlewares/adminAuth.js
import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next({ message: 'Authorization header missing', status: 401 });
    }

    // פיצול ההדר לשני חלקים: 'Bearer' ו־הטוקן עצמו
    // split(' ') = מפריד לפי רווח
    // [, token] = לוקח רק את החלק השני מהמחרוזת (הטוקן עצמו)
    const [, token] = authorization.split(' ');

  
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = jwt.verify(token, privateKey);
    req.user = data;

    // בדיקה אם התפקיד (role) של המשתמש הוא לא 'admin'
    if (req.user.role !== 'admin') {
      return next({ message: 'No permission to invoke this function', status: 403 });
    }

    // אם הכול תקין – נמשיך למידלוור הבא בשרשרת
    next();
  } catch (error) {
    console.error('error', error);

    next({ message: error.message || 'Unauthorized', status: 401 });
  }
};
