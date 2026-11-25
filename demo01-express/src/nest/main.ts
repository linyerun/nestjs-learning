import "reflect-metadata";
import { AppModule } from "./app/app.module";
import { createApp } from "./core/application";

const PORT = Number(process.env.PORT) || 3100;

createApp(AppModule).listen(PORT, () => {
  console.log(`mini-nest 已启动: http://localhost:${PORT}/users`);
});