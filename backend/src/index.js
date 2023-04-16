
import getConnection from './dbconfig/config.js';
import app from "./app.js";
import userRouter from "./routers/userRouter.js";
import itineraryRouter from "./routers/itineraryRouter.js"
import groupRouter from "./routers/groupRouter.js";
import notificationRouter from "./routers/notificationRouter.js";

getConnection();

app.use(userRouter);
app.use(itineraryRouter);
app.use(groupRouter);
app.use(notificationRouter);

export default app;