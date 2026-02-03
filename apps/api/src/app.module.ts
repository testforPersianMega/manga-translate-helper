import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { BooksModule } from "./books/books.module";
import { ChaptersModule } from "./chapters/chapters.module";
import { PagesModule } from "./pages/pages.module";
import { TranslationProjectsModule } from "./translation-projects/translation-projects.module";
import { TranslationEntriesModule } from "./translation-entries/translation-entries.module";
import { ActivityLogModule } from "./activity-log/activity-log.module";
import { PrismaService } from "./common/prisma.service";
import { AssetsModule } from "./assets/assets.module";
import { UserBooksModule } from "./user-books/user-books.module";
import { TranslationsModule } from "./translations/translations.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 30
      }
    ]),
    AuthModule,
    UsersModule,
    BooksModule,
    ChaptersModule,
    PagesModule,
    TranslationProjectsModule,
    TranslationEntriesModule,
    ActivityLogModule,
    AssetsModule,
    UserBooksModule,
    TranslationsModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
