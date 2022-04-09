import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1645303353174 implements MigrationInterface {
    name = "Migration1645303353174";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "hash" TO "info"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "info"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "info" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "info"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "info" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "info" TO "hash"`);
    }
}
