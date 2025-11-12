// node-server/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

// סכימת משתמש
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { 
    type: String, 
    unique: true, 
    minlength: [8, 'password must contain at least 8'], 
    match: /(?=.*[a-zA-Z])(?=.*\d)/, 
    required: true 
  },
  email: { type: String, unique: true, required: true },
  address: { type: String },
  role: { 
    type: String, 
    default: 'user', 
    enum: ['admin', 'user', 'registered user'], 
    required: true 
  }
});

// הצפנת סיסמה לפני שמירה
userSchema.pre('save', async function(next) {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// מודל mongoose
export const User = mongoose.model('user', userSchema);
export { userSchema };

// Joi validation
export const userJoi = {
  register: Joi.object({
    username: Joi.string().min(2).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).required(),
    email: Joi.string().email().required(),
    address: Joi.string().optional(),
    role: Joi.string().valid('admin', 'user', 'registered user').default('user')
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),
  updatePassword: Joi.object({
    password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).required(),
    repeatPassword: Joi.ref('password')
  })
};

// פונקציה ליצירת JWT
export const generateToken = (user) => {
  const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
  const data = { role: user.role, user_id: user._id };
  return jwt.sign(data, privateKey, { expiresIn: '1h' });
};


// הדף הזה אחראי על כל מה שקשור למשתמשים:

// איך הם נשמרים ב־MongoDB

// איך מאמתים את הנתונים

// איך מצפינים את הסיסמה

// ואיך יוצרים טוקן JWT להתחברות מאובטחת



//// מטרת הקובץ: להגדיר מודל משתמש ב־MongoDB, לְוָלֵד קלט עם Joi, להצפין סיסמאות עם bcrypt, ולייצר טוקן JWT.
// סיכום:
// userSchema – מגדיר איך נראה משתמש במסד הנתונים (שם משתמש, סיסמה, אימייל, כתובת, תפקיד).

// userSchema.pre('save', ...) – מצפין את הסיסמה לפני שמירת המשתמש במסד הנתונים.
// userValidator – מגדיר סכימת ולידציה עם Joi עבור תהליך ההתחברות (אימייל וסיסמה).
// generateToken – פונקציה שיוצרת טוקן JWT עם מידע על המשתמש (תפקיד ומזהה).
// export const User = mongoose.model(...) – יוצר מודל משתמש לשימוש בקבצים אחרים בפרויקט.

//הספור של הלונה פארק  :
// הסיפור של לונה פארק = מנגנון אימות משתמשים

// המשתמש מגיע

// בדמיון שלך, זה כמו שמישהו הולך ללונה פארק.

// בעולם האמיתי, זה המשתמש שרוצה להיכנס לאתר או לאפליקציה.

// הצמיד

// הצמיד הוא הטוקן (JWT) או הסיסמה המוצפנת שהמשתמש קיבל אחרי שהירשם/התחבר.

// הצמיד אומר “כן, אני זה המשתמש הזה”.

// הבדיקה בכניסה למתקן


// המתקן הוא המשאב באתר (כמו דף פרטי המשתמש או API שמחזיר מידע).

// האדם שאחראי על המתקן בודק אם הצמיד / הטוקן אמיתי.

// בעולם האמיתי: שרת האינטרנט בודק את ה־JWT מול המפתח הסודי (JWT_SECRET) או בודק שהסיסמה שהוזנה אחרי hash תואמת למסד הנתונים.

// מה קורה אם הצמיד חוקי

// המשתמש נכנס למתקן – כלומר יש לו גישה למשאב.

// מה קורה אם הצמיד לא חוקי

// המשתמש לא נכנס – כלומר הגישה נדחית, לא נותנים לו להשתמש באתר או במידע שהוא לא אמור לראות.

// איך זה קשור לקוד שלנו:

// bcrypt.hash(this.password) → זה כמו לתת למשתמש צמיד מוצפן במקום סיסמה גולמית.

// generateToken(user) → זה כמו לתת למשתמש צמיד עם קוד סודי (JWT) שהוא יכול להראות לכל המתקנים שהוא רוצה להיכנס אליהם.

// כל בדיקה של jwt.verify(token, privateKey) → זה כמו לבדוק שהצמיד אמיתי ושהסיסמה או הטוקן חוקי.

// 💡 סיכום במילים פשוטות:

// המשתמש צריך “צמיד” (טוקן/סיסמה) כדי להיכנס.

// המערכת בודקת שהצמיד אמיתי לפני שהיא נותנת גישה.

// אם הצמיד לא תקין → המשתמש לא נכנס.



// // 💡 במילים קצרות:
// הקובץ הזה עושה את כל מה שקשור ל-“ניהול משתמשים”:

// שומר משתמשים במסד.

// מוודא שהנתונים שלהם נכונים.

// מצפין סיסמאות.

// נותן להם טוקן (צמיד דיגיטלי) כדי שיוכלו להיכנס לאזורים מוגנים באתר.

// user.model.js) → המטרה שלו היא לנהל משתמשים במסד הנתונים.

// מגדיר איך נראה משתמש (שם, סיסמה, אימייל, תפקיד).

// מצפין סיסמאות עם bcrypt.

// בודק שהנתונים נכונים עם Joi.

// יוצר JWT (צמיד דיגיטלי) אחרי הרשמה/התחברות.

// בקיצור: הכנת המשתמשים, שמירה, ואספקת טוקן כדי שיוכלו להיכנס למתקנים.