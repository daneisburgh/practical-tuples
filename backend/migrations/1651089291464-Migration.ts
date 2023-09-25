import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1651089291464 implements MigrationInterface {
    name = "Migration1651089291464";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "friend_request" RENAME COLUMN "status" TO "isAccepted"`
        );
        await queryRunner.query(
            `ALTER TYPE "public"."friend_request_status_enum" RENAME TO "friend_request_isaccepted_enum"`
        );
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "isAccepted"`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD "isAccepted" boolean NOT NULL DEFAULT false`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "isAccepted"`);
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD "isAccepted" "public"."friend_request_isaccepted_enum" NOT NULL DEFAULT 'Pending'`
        );
        await queryRunner.query(
            `ALTER TYPE "public"."friend_request_isaccepted_enum" RENAME TO "friend_request_status_enum"`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" RENAME COLUMN "isAccepted" TO "status"`
        );
    }
}
