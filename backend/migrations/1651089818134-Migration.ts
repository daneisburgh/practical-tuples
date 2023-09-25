import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1651089818134 implements MigrationInterface {
    name = "Migration1651089818134";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "friend_request" RENAME COLUMN "isAccepted" TO "status"`
        );
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "status"`);
        await queryRunner.query(
            `CREATE TYPE "public"."friend_request_status_enum" AS ENUM('Accepted', 'Rejected', 'Pending')`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD "status" "public"."friend_request_status_enum" NOT NULL DEFAULT 'Pending'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."friend_request_status_enum"`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD "status" boolean NOT NULL DEFAULT false`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" RENAME COLUMN "status" TO "isAccepted"`
        );
    }
}
