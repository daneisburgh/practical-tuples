import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650748407396 implements MigrationInterface {
    name = "Migration1650748407396";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "maxFriends"`);
        await queryRunner.query(
            `ALTER TYPE "public"."friend_request_status_enum" RENAME TO "friend_request_status_enum_old"`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."friend_request_status_enum" AS ENUM('Accepted', 'Rejected', 'Pending')`
        );
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ALTER COLUMN "status" TYPE "public"."friend_request_status_enum" USING "status"::"text"::"public"."friend_request_status_enum"`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" ALTER COLUMN "status" SET DEFAULT 'Pending'`
        );
        await queryRunner.query(`DROP TYPE "public"."friend_request_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."friend_request_status_enum_old" AS ENUM('Accepted', 'Denied', 'Pending')`
        );
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ALTER COLUMN "status" TYPE "public"."friend_request_status_enum_old" USING "status"::"text"::"public"."friend_request_status_enum_old"`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" ALTER COLUMN "status" SET DEFAULT 'Pending'`
        );
        await queryRunner.query(`DROP TYPE "public"."friend_request_status_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."friend_request_status_enum_old" RENAME TO "friend_request_status_enum"`
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "maxFriends" integer NOT NULL DEFAULT '2'`);
    }
}
