import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650577346047 implements MigrationInterface {
    name = "Migration1650577346047";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."friend_request_status_enum" AS ENUM('Accepted', 'Denied')`
        );
        await queryRunner.query(
            `ALTER TABLE "friend_request" ADD "status" "public"."friend_request_status_enum" NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."friend_request_status_enum"`);
    }
}
