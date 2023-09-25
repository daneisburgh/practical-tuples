import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650749731493 implements MigrationInterface {
    name = "Migration1650749731493";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "maxFriends" integer NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "maxFriends"`);
    }
}
