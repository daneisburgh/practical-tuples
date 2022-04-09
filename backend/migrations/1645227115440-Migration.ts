import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1645227115440 implements MigrationInterface {
    name = "Migration1645227115440";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }
}
