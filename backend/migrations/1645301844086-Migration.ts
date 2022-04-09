import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1645301844086 implements MigrationInterface {
    name = "Migration1645301844086";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "isNew" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "isNew"`);
    }
}
