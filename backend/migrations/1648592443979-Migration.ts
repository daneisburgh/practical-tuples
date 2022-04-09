import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648592443979 implements MigrationInterface {
    name = "Migration1648592443979";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "deviceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" ADD "deviceId" character varying`);
    }
}
