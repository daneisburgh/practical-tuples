import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647798097489 implements MigrationInterface {
    name = "Migration1647798097489";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "isNew" TO "isValid"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "isValid" TO "isNew"`);
    }
}
