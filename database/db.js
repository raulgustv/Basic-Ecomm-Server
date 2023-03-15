import mongoose from "mongoose"


export const db = () => mongoose
    .set('strictQuery', false)
    .connect(process.env.MONGO_DB)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('DB Error ', err));