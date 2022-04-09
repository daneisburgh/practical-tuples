import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647801548870 implements MigrationInterface {
    name = "Migration1647801548870";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "maxDevices" integer NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "maxDevices"`);
    }
}
