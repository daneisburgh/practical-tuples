import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647894670440 implements MigrationInterface {
    name = "Migration1647894670440";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "isVerified" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "isVerified" SET DEFAULT false`);
    }
}
