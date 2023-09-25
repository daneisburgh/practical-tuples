import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650575287945 implements MigrationInterface {
    name = "Migration1650575287945";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "requesteeId" integer, "requesterId" integer, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_friends_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_f2b5631d91f6b7fda632135932f" PRIMARY KEY ("userId_1", "userId_2"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_04840fd160b733de706a336013" ON "user_friends_user" ("userId_1") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e81f236c989f3fd54836b50a12" ON "user_friends_user" ("userId_2") `
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "maxFriends" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_476a70a97e3d59b51a4f8c037a5" FOREIGN KEY ("requesteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9347bde29efe00b67d39f29d9e7" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_friends_user" ADD CONSTRAINT "FK_04840fd160b733de706a3360134" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "user_friends_user" ADD CONSTRAINT "FK_e81f236c989f3fd54836b50a12d" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_friends_user" DROP CONSTRAINT "FK_e81f236c989f3fd54836b50a12d"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_friends_user" DROP CONSTRAINT "FK_04840fd160b733de706a3360134"`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9347bde29efe00b67d39f29d9e7"`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_476a70a97e3d59b51a4f8c037a5"`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "maxFriends"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e81f236c989f3fd54836b50a12"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04840fd160b733de706a336013"`);
        await queryRunner.query(`DROP TABLE "user_friends_user"`);
        await queryRunner.query(`DROP TABLE "friend_request"`);
    }
}
